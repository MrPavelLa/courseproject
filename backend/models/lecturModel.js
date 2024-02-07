const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');
const Task = require('./taskModel');

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  speaker: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    default: 0,
  },
  logo: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  enrolledCount: {
    type: Number,
    default: 0,
  },
  certificates:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  accessibleTo: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  isdeleted: {
    type: Boolean,
    default: false,
  }
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
