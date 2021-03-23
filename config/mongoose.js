const mongoose = require('mongoose');

// Import mongoose models
require('../app/models');

module.exports = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  mongoose.Promise = Promise;
};
