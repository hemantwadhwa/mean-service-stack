const { Schema, SchemaTypes, model } = require('mongoose');

const { ObjectId } = SchemaTypes;

const AdminLogSchema = new Schema({
  resource: String,
  method: String,
  url: String,
  params: {},
  body: {},
  query: {},
  protocol: String,
  responseSize: {
    type: Number,
    default: 0,
  },
  admin: {
    type: ObjectId,
    ref: 'Admin',
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  message: String,
  serveTime: Number,
});

AdminLogSchema.index({
  timestamp: 1,
});

AdminLogSchema.index({
  admin: 1,
});

exports.model = model('AdminLog', AdminLogSchema);
exports.schema = AdminLogSchema;
