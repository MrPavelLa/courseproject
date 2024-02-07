const mongoose = require('mongoose');

const verificationsSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length >= 6;
      },
      message: 'Пароль должен содержать минимум 6 символов'
    }
  },
  role: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return ['admin', 'user', 'organizer'].includes(value);
      },
      message: 'Ошибка роли'
    }
  },
  phonenumber: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\+375\d{9}$/.test(value);
      },
      message: 'Неправильный номер телефона. Формат +375xx 13 символов'
    }
  }
});

const Verifications = mongoose.model('Verifications', verificationsSchema);

module.exports = Verifications;
