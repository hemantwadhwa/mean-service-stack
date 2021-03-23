/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

exports.validateLoginRequest = function validateLoginRequest(requestBody) {
  return new Promise((resolve, reject) => {
    const validation = Joi.object({
      username: Joi.string().min(3).max(32).required(),
      password: Joi.string().min(4).max(32).required(),
    });

    const result = validation.validate(requestBody);

    if (result.error) {
      reject(result.error);
    } else {
      resolve();
    }
  });
};

exports.handleLoginRequest = function handleLoginRequest(requestBody) {
  return new Promise((resolve, reject) => {
    const { username, password } = requestBody;

    Admin.findOne({
      username,
    })
      .then((adminProfile) => {
        if (!adminProfile) {
          reject(new Error('Username/password is invalid'));
        } else {
          adminProfile.authenticate(password, (err, isMatch) => {
            if (err) {
              reject(err);
            } else if (!isMatch) {
              reject(new Error('Username/password is incorrect'));
            } else {
              const token = jwt.sign(
                JSON.stringify({
                  _id: adminProfile._id,
                  username: adminProfile.username,
                  name: adminProfile.name,
                  phoneNumber: adminProfile.phoneNumber,
                  accessType: adminProfile.accessType,
                }),
                Buffer.from(process.env.JWT_SECRET, 'base64'),
              );
              resolve(token);
            }
          });
        }
      });
  });
};
