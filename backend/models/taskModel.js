const mongoose = require('mongoose');
const User = require('./userModel');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accessibleTo: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  maxTime: {
    type: Number, 
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
