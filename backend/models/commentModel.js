const mongoose = require('mongoose');
const User = require('./userModel');

const commentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  objectReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Object', 
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

