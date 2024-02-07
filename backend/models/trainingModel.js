const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');
const Task = require('./taskModel');

const trainingSchema = new mongoose.Schema({
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
  logo: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  materials: [
    {
      title: {
        type: String,
      },
      link: {
        type: String,
      },
    }
  ], 
  resources: [
    {
      title: {
        type: String,
      },
      link: {
        type: String,
      },
    }
  ],
  isdeleted: {
    type: Boolean,
    default: false,
  }
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
