import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Please provide a value for the username field.'],
    validate: {
      validator: (value) => {
        const name = validator.blacklist(value, '_');
        return validator.isAlphanumeric(name);
      },
      message:
        'Username must consist of letters, numbers, and underscores only.',
    },
    maxLength: [30, 'Username cannot exceed 30 characters.'],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'Please provide a value for the username field.'],
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a value for the password field.'],
    validate: {
      validator: (value) => {
        return (
          value.match(/\w/) &&
          value.match(/\d/) &&
          !validator.isAlphanumeric(value)
        );
      },
      message: 'Password must consist of letter, digit, and special character.',
    },
    minLength: [8, 'Password must be above 8 characters.'],
  },
  photo: {
    type: String,
    default: 'default.jpeg',
  },
  mobileNumber: {
    type: String,
    trim: true,
    validate: [validator.isMobilePhone, 'Please provide a valid Phone Number.'],
  },
  active: {
    type: Boolean,
    default: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Password and confirm password does not match.',
    },
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  notificationSettings: {
    type: {
      taskAssignment: {
        type: Boolean,
        default: true,
      },
      taskActivity: {
        type: Boolean,
        default: true,
      },
      reminder: {
        type: Boolean,
        default: true,
      },
      projectActivity: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: true,
      },
    },
    default: {
      taskAssignment: true,
      taskActivity: true,
      reminder: true,
      projectActivity: true,
      email: true,
    },
  },
  personalization: {
    type: {
      theme: {
        type: String,
        default: 'light',
        enum: ['light', 'dark', 'system'],
      },
      defaultProjectView: {
        type: String,
        default: 'grid',
        enum: ['grid', 'table'],
      },
      priorityColors: {
        type: {
          high: {
            type: String,
            default: '#ff0000',
          },
          medium: {
            type: String,
            default: '#ffd700',
          },
          low: {
            type: String,
            default: '#008000',
          },
        },
        default: {
          high: '#ff0000',
          medium: '#ffd700',
          low: '#008000',
        },
      },
      customFields: [String],
    },
    default: {
      theme: 'light',
      defaultProjectView: 'grid',
      priorityColors: {
        high: '#ff0000',
        medium: '#ffd700',
        low: '#008000',
      },
    },
  },
  dataVisibility: {
    type: {
      firstName: {
        type: Boolean,
        default: true,
      },
      lastName: {
        type: Boolean,
        default: true,
      },
      mobile: {
        type: Boolean,
        default: false,
      },
      country: {
        type: Boolean,
        default: false,
      },
      language: {
        type: Boolean,
        default: false,
      },
      dob: {
        type: Boolean,
        default: false,
      },
    },
    default: {
      firstName: true,
      lastName: true,
      mobile: false,
      country: false,
      language: false,
      dob: false,
    },
  },
  currentProject: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
  },
  firstName: String,
  lastName: String,
  occupation: String,
  country: String,
  language: String,
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

// Encrypts Password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  // this keyword points to current query

  if (this.getFilter().login) {
    delete this.getFilter().login;
    this.find({ active: { $ne: false } }).select('-active');
  } else if (this.getFilter().emailVerificationToken) {
    this.find({ active: { $ne: false } }).select('-emailVerified -active');
  } else {
    this.find({ active: { $ne: false }, emailVerified: { $ne: false } }).select(
      '-emailVerified -active'
    );
  }

  next();
});

// Generates email verification token
userSchema.methods.generateToken = function (type) {
  if (type === 'email') {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    this.emailVerificationTokenExpires = Date.now() + 48 * 24 * 60 * 60 * 1000;

    return verificationToken;
  }

  if (type === 'password') {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
};

// Checks if provided password is correct
userSchema.methods.comparePasswordInDb = async function (pswd, pswdDb) {
  return await bcrypt.compare(pswd, pswdDb);
};

// Checks if password has changed after verification
userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < passwordChangedTimestamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
