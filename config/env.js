const dotenv = require('dotenv');
const fs = require('fs');

module.exports = () => {
  dotenv.config();
  if (process.env.NODE_ENV === 'test') {
    Object.assign(process.env, dotenv.parse(fs.readFileSync('.env.test')));
  }
};
