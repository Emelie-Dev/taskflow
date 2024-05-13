import User from '../Models/userModel.js';
import Email from '../Utils/Email.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import jwt from 'jsonwebtoken';
import CustomError from '../Utils/CustomError.js';
import crypto from 'crypto';
import util from 'util';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LOGIN_EXPIRES,
  });
};

const sendResponse = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    maxAge: process.env.JWT_LOGIN_EXPIRES,
    httpOnly: true,
    // Heroku specific
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  if (process.env.NODE_ENV.trim() === 'development') {
    return res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } else {
    return res.status(statusCode).json({
      status: 'success',
      token,
    });
  }
};

const sendEmailLink = async (user, req, res, next) => {
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
        'A verification email has been sent to you. Click the link in the email to complete the signup process.',
    });
  } catch (err) {
    // Removes verification token from user data
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        'There was an error sending verfication email. Please try again later.',
        500
      )
    );
  }
};

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
    return next(new CustomError('You are not logged in', 401));
  }

  // verify the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // if the user exists

  const user = await User.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError(
      'The user with the given token does not exist.',
      401
    );
    return next(error);
  }

  // Checks if the user changed the password after token was issued

  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);

  if (isPasswordChanged) {
    const error = new CustomError(
      'The password has been changed recently. Please login again.',
      401
    );
    return next(error);
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
  // await sendEmailLink(newUser, req, res, next);

  sendResponse(newUser, 201, req, res);
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

  // If user does not exist
  if (!user) {
    return next(
      new CustomError(
        'The verification link is invalid or has expired! Log in to your account to generate a new one.',
        404
      )
    );
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
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });

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

  const user = await User.findOne({ email, login: true });

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError('Incorrect email or password', 400);
    return next(error);
  }

  // Sends verification mail
  if (!user.emailVerified && user.emailVerificationTokenExpires < Date.now()) {
    return await sendEmailLink(user, req, res, next);
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
    maxAge: process.env.JWT_LOGOUT_EXPIRES,
    httpOnly: true,
    // Heroku specific
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  res.status(200).json({ status: 'success' });
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

  // Generate reset token
  const passwordResetToken = user.generateToken('password');
  await user.save({ validateBeforeSave: false });

  try {
    // Generates reset token url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/reset_password/${passwordResetToken}`;

    // Sends email to user with token
    await new Email(user, resetUrl).sendPasswordReset();

    return res.status(200).json({
      status: 'success',
      message: 'A password reset link has been sent to your email',
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
      'The reset link is invalid or has expired',
      400
    );
    return next(error);
  }

  // If user exists

  // If request body is not good
  if (!req.body.password || !req.body.confirmPassword) {
    const error = new CustomError(
      'Please provide a value for the password and confirm password field.',
      400
    );
    return next(error);
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  sendResponse(user, 200, req, res);
});
