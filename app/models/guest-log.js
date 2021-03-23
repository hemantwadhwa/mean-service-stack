const { Schema, model } = require('mongoose');

const GuestLogSchema = new Schema({
  resource: String,
  method: String,
  url: String,
  params: {},
  body: {},
  query: {},
  protocol: String,
  ip: String,
  responseSize: {
    type: Number,
    default: 0,
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

exports.model = model('GuestLog', GuestLogSchema);
exports.schema = GuestLogSchema;
