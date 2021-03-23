const bcrypt = require('bcrypt');

const { Schema, model } = require('mongoose');

const AdminSchema = new Schema({
  username: {
    type: String,
    required: 'Username required',
    unique: true,
  },
  name: {
    type: String,
    required: 'Name required',
  },
  phoneNumber: {
    type: String,
    required: 'Phone number required',
  },
  password: {
    type: String,
    required: 'Password required',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  accessType: {
    type: String,
    default: 'Admin',
  },
});

/* Compares and authenticates password against the stored password */
AdminSchema.methods.authenticate = function authenticate(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      callback(err);
    } else {
      callback(null, isMatch);
    }
  });
};

AdminSchema.pre('save', function preSave(next) {
  const admin = this;

  admin.lastModified = Date.now();

  if (!admin.isModified('password')) {
    next();
  } else {
    // generate salt
    bcrypt.genSalt(process.env.SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        next(err);
      } else {
        // hash the password with new salt
        bcrypt.hash(admin.password, salt, (err1, hash) => {
          if (err1) {
            next(err1);
          } else {
            Object.assign(admin, {
              password: hash,
            });
            next();
          }
        });
      }
    });
  }
});

exports.model = model('Admin', AdminSchema);
exports.schema = AdminSchema;
