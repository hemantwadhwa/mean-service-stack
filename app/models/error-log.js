/* External Dependencies */
const mongoose = require('mongoose');

const { Schema, SchemaTypes } = mongoose;
const { ObjectId } = SchemaTypes;

const ErrorLogSchema = new Schema({
  resource: String,
  method: String,
  url: String,
  params: {},
  body: {},
  query: {},
  protocol: String,
  error: {},
  accountID: {
    type: ObjectId,
  },
  accessType: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  message: String,
  serveTime: Number,
});

exports.model = mongoose.model('ErrorLog', ErrorLogSchema);
exports.schema = ErrorLogSchema;
