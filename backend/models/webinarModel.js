const mongoose = require('mongoose');
const User = require('./userModel');
const validator = require('validator');

const webinarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  speaker: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },  
  datetime: {
    type: Date,
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
  capacity: {
    type: Number,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  enrolledCount: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },  
  certificates:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  accessibleTo: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  liveStream: {
    enabled: {
      type: Boolean,
      default: false,
    },
    webcamLibrary: {
      type: String,
      enum: ['WebRTC', 'other'],
      default: 'WebRTC',
    },
  },
  isdeleted: {
    type: Boolean,
    default: false,
  }
});

const Webinar = mongoose.model('Webinar', webinarSchema);

module.exports = Webinar;
