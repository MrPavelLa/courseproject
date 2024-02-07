const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  dCapacity: {
    type: Number,
    default: 0,
  }, 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
