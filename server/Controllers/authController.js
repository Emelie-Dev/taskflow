import User from '../Models/userModel.js';
import Email from '../Utils/Email.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import jwt from 'jsonwebtoken';
import CustomError from '../Utils/CustomError.js';
import crypto from 'crypto';
import util from 'util';
import Notification from '../Models/notificationModel.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const verifyResult = fs.readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../Public/Templates/verifyResult.html'
  ),
  'utf-8'
);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LOGIN_EXPIRES,
  });
};

const sendResponse = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    maxAge: process.env.JWT_LOGIN_EXPIRES,

    //  Prevents javascript access
    httpOnly: true,

    secure: true,
    sameSite: 'None',
  });

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const sendEmailLink = async (user, signup, req, res, next) => {
  // Gnerate email verification token
  const verificationToken = user.generateToken('email');
  await user.save({ validateBeforeSave: false });

  try {
    // Creates email verification url
    const verificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/verify_email/${verificationToken}`;

    // Sends verification email
    await new Email(user, verificationUrl).sendEmailVerification();

    return res.status(200).json({
      status: 'success',
      message:
        'A verification email has been sent to you. Click the link in the email to complete your signup process.',
    });
  } catch (err) {
    // Removes verification token from user data
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    let message;

    if (signup) {
      message =
        'There was an error sending verfication email. Please try logging in with the details you provided.';
    } else {
      message =
        'There was an error sending verfication email. Please try again later.';
    }

    const error = new CustomError(message, 500);

    error.isSignup = true;
    return next(error);
  }
};

const handleGoogleSignup = async (data) => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    const newUser = new User({
      firstName: data.given_name,
      lastName: data.family_name,
      emailVerified: true,
      email: data.email,
      photo: data.picture,
      isGoogleAuth: true,
    });

    newUser.username = `user${newUser._id}`;

    try {
      await newUser.save();
      return newUser;
    } catch {
      throw new Error();
    }
  } else {
    throw new CustomError('This email already exists.', 400);
  }
};

const handleGoogleLogin = async (data) => {
  let user = await User.findOne({ email: data.email, login: true });

  if (user) {
    if (!user.isGoogleAuth) {
      throw new CustomError(
        'You did not sign up with Google. Please log in with your email and password.',
        400
      );
    }

    if (!user.active) {
      // send reactivation email
      try {
        await new Email(user).sendReactivationEmail();
      } catch {}

      user = await User.findOneAndUpdate(
        { _id: user._id, login: true },
        { active: true },
        {
          new: true,
          runValidators: true,
        }
      ).select('-active -password');

      // sends reactivation notification
      await Notification.create({
        user: user._id,
        action: 'activation',
        type: ['security'],
      });
    }

    return user;
  } else {
    throw new CustomError(
      'There’s no account linked to this Google login.',
      404
    );
  }
};

export const authConfirmed = asyncErrorHandler(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

export const protectRoute = asyncErrorHandler(async (req, res, next) => {
  // Read the token and check if it exists
  const jwtToken = req.headers.authorization;

  let token;

  if (jwtToken && jwtToken.startsWith('Bearer')) {
    token = jwtToken.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new CustomError('You are not logged in.', 401));
  }

  // verify the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // if the user exists
  const user = await User.findById(decodedToken.id).select('-password');

  if (!user) {
    const error = new CustomError(
      'The user with the given token does not exist.',
      401
    );
    return next(error);
  }

  if (!user.isGoogleAuth) {
    // Checks if the user changed the password after token was issued
    const isPasswordChanged = user.isPasswordChanged(decodedToken.iat);

    if (isPasswordChanged) {
      const error = new CustomError(
        'Your password has been changed recently. Please login again.',
        401
      );
      return next(error);
    }
  }

  req.user = user;

  // Allow the user access the route
  next();
});

export const restrictAccessTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        'You are not allowed to perform this action.',
        403
      );
      return next(error);
    }
    next();
  };
};

export const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // Sends verification mail
  await sendEmailLink(newUser, true, req, res, next);

  // sendResponse(newUser, 201, req, res);
});

export const verifyEmail = asyncErrorHandler(async (req, res, next) => {
  //  Regenerates token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Finds user with genereated token
  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });

  const url =
    process.env.NODE_ENV === 'production'
      ? 'https://taskflow-266v.onrender.com'
      : 'http://localhost:5173';

  // If user does not exist
  if (!user) {
    const message = verifyResult.replace(
      '{{CONTENT}}',
      `<div class="body body-fail">The verification link is invalid or has expired! Log in to your account to generate a new one.
    
    <div class="btn-div"><a href="${url}/login"><button class='btn'>Login</button></a></div>
    
    </div>`
    );

    return res.status(404).send(message);
  }

  // If user exists
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;

  await user.save({ validateBeforeSave: false });

  const jwtToken = signToken(user._id);

  res.cookie('jwt', jwtToken, {
    maxAge: process.env.JWT_LOGIN_EXPIRES,
    httpOnly: true,
    // Heroku specific
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  const message = verifyResult
    .replace(
      '{{CONTENT}}',
      `<div class="body body-success">Your email has been successfully verified.
    </div>`
    )
    .replace(
      '{{CONTENT2}}',
      `<script>
   (() => {
   setTimeout(() => {
    window.location.href = '${url}/dashboard'
    }, 3000)
      })();
   </script>`
    );

  res.status(200).send(message);

  try {
    const url = `${req.protocol}://${req.get('host')}/settings`;
    return await new Email(user, url).sendWelcome();
  } catch {}
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new CustomError(
      'Please provide your email and password for logging in!',
      400
    );
    return next(err);
  }

  let user = await User.findOne({ email, login: true });

  if (user.isGoogleAuth) {
    return next(
      new CustomError(
        'It looks like you signed up with Google. Please log in using Google to access your account.',
        400
      )
    );
  }

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError('Incorrect email or password', 401);
    return next(error);
  }

  if (!user.active) {
    // send reactivation email
    try {
      await new Email(user).sendReactivationEmail();
    } catch {}

    user = await User.findOneAndUpdate(
      { _id: user._id, login: true },
      { active: true },
      {
        new: true,
        runValidators: true,
      }
    ).select('-active -password');

    await Notification.create({
      user: user._id,
      action: 'activation',
      type: ['security'],
    });
  }

  // Sends verification mail
  if (!user.emailVerified && !user.emailVerificationTokenExpires) {
    return await sendEmailLink(user, false, req, res, next);
  } else if (
    !user.emailVerified &&
    user.emailVerificationTokenExpires < Date.now()
  ) {
    return await sendEmailLink(user, false, req, res, next);
  } else if (!user.emailVerified) {
    return res.status(200).json({
      status: 'success',
      message:
        'Complete your signup process by clicking the verification link in the email we sent.',
    });
  }

  sendResponse(user, 200, req, res);
});

export const logout = asyncErrorHandler(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    maxAge: process.env.JWT_LOGIN_EXPIRES,

    //  Prevents javascript access
    httpOnly: true,

    secure: true,
    sameSite: 'None',
  });

  return res.status(200).json({ status: 'success', message: null });
});

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // Get user from email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const error = new CustomError(
      'We could not find the user with the given email.',
      404
    );
    return next(error);
  }

  if (user.isGoogleAuth) {
    return next(
      new CustomError(
        'It looks like you signed up with Google. Please log in using Google to access your account.',
        400
      )
    );
  }

  // Generate reset token
  const passwordResetToken = user.generateToken('password');
  await user.save({ validateBeforeSave: false });

  try {
    // Generates reset token url
    const resetUrl = `${req.headers.origin}/reset_password/${passwordResetToken}`;

    // Sends email to user with token
    await new Email(user, resetUrl).sendPasswordReset();

    return res.status(200).json({
      status: 'success',
      message: 'A password reset link has been sent to your email.',
    });
  } catch (err) {
    // Removes reset token from user data
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        'There was an error sending the password reset email. Please try again later.',
        500
      )
    );
  }
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  //  Regenerates token
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Finds user with genereated token
  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // If user does not exist
  if (!user) {
    const error = new CustomError(
      'This reset link is invalid or has expired.',
      400
    );
    return next(error);
  }

  if (user.isGoogleAuth) {
    return next(
      new CustomError(
        'It looks like you signed up with Google. Please log in using Google to access your account.',
        400
      )
    );
  }

  // If request body is not good
  if (!req.body.password || !req.body.confirmPassword) {
    const error = new CustomError(
      'Please provide a value for the password and confirm password field.',
      400
    );
    return next(error);
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError('Password and confirm password do not match.', 400)
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  await Notification.create({
    user: user._id,
    action: 'update',
    type: ['security'],
    state: { reset: true },
  });

  return res.status(200).json({
    status: 'success',
    message: 'Password reset was successful.',
  });
});

export const googleAuth = asyncErrorHandler(async (req, res, next) => {
  const redirectUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://taskflow-vuni.onrender.com/api/v1/auth/google/callback'
      : 'http://localhost:2005/api/v1/auth/google/callback';

  const auth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = auth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent',
    state: JSON.stringify({
      signup: req.query.signup ? true : false,
      clientUrl: req.headers.origin,
    }),
  });

  res.header('Referrer-policy', 'no-referrer-when-downgrade');

  return res.json({ url: authorizeUrl });
});

export const googleAuthCallback = asyncErrorHandler(async (req, res, next) => {
  const { code } = req.query;
  const { signup, clientUrl } = JSON.parse(req.query.state);

  try {
    const redirectUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://taskflow-vuni.onrender.com/api/v1/auth/google/callback'
        : 'http://localhost:2005/api/v1/auth/google/callback';

    const auth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );

    const response = await auth2Client.getToken(code);
    await auth2Client.setCredentials(response.tokens);
    const { access_token } = auth2Client.credentials;

    const { data } = await axios(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );

    let user;

    if (signup) {
      user = await handleGoogleSignup(data);
    } else {
      user = await handleGoogleLogin(data);
    }

    const jwtToken = signToken(user._id);

    res.cookie('jwt', jwtToken, {
      maxAge: process.env.JWT_LOGIN_EXPIRES,

      //  Prevents javascript access
      httpOnly: true,

      secure: true,
      sameSite: 'None',
    });
    res.redirect(`${clientUrl}/dashboard`);
  } catch (err) {
    if (signup) {
      res.redirect(
        `${clientUrl}/signup?error=true&isOperational=${err.isOperational}`
      );
    } else {
      res.redirect(
        `${clientUrl}/login?error=true&statusCode=${err.statusCode}`
      );
    }
  }
});
