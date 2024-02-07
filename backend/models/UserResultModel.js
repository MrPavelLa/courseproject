const mongoose = require('mongoose');
const User = require('../models/userModel');

const userResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  result: {
    type: Number, 
    required: true,
  },
  dateTime: {
    type: Date,
    default: new Date().toISOString(),
  },  
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
});

const UserResult = mongoose.model('UserResult', userResultSchema);

module.exports = UserResult;
