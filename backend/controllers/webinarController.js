const Webinar = require('../models/webinarModel');
const User = require('../models/userModel');
const secretKey = 'TigerEyes39!';
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token.slice(7), secretKey);
    console.log('Декодированный токен:', decoded);
    return decoded;
  } catch (error) {
    console.error('Ошибка при верификации токена:', error);
    return null;
  }
};

exports.createWebinar = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const webinarData = req.body;
    const newWebinar = await Webinar.create(webinarData);
    
    res.status(201).json('Успешно создано');
  } catch (error) {
    console.error('Error creating webinar:', error);
    res.status(500).json('Произошла ошибка на сервере при создании');
  }
};

exports.deleteWebinar = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const { id } = req.params;

  try {
    const webinar = await Webinar.findByIdAndUpdate(id, { isdeleted: true }, { new: true });

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found.' });
    }

    res.status(204).json();  
  } catch (error) {
    console.error('Error deleting webinar:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addUserToWebinar = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData) {
    console.log(tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const webinarId = req.params.id;
  const userId = req.params.userId;

  try {
    const webinar = await Webinar.findById(webinarId);

    if (!webinar) {
      return res.status(404).json({ message: 'Вебинар не найден.' });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (webinar.enrolledCount >= webinar.capacity) {
      return res.status(400).json({ message: 'Достигнуто максимальное количество участников на вебинаре.' });
    }

    if (webinar.accessibleTo.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'Пользователь уже записан на вебинар.' });
    }

    webinar.accessibleTo.push(userToAdd._id);
    webinar.enrolledCount += 1;

    await webinar.save();

    res.json(webinar);
  } catch (error) {
    console.error('Ошибка при добавлении пользователя на вебинар:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.addUserToCertificateWebinar = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const webinarId = req.params.id;
  const userId = req.params.userId;

  try {
    const webinar = await Webinar.findById(webinarId);

    if (!webinar) {
      return res.status(404).json({ message: 'Вебинар не найден.' });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (webinar.certificates.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'Пользователь уже записан на вебинар.' });
    }

    webinar.certificates.push(userToAdd._id);

    await webinar.save();

    res.json(webinar);
  } catch (error) {
    console.error('Ошибка при добавлении пользователя на вебинар:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.getAllWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find();
    res.json(webinars);
  } catch (error) {
    console.error('Error getting all webinars:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getWebinarById = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData) {
    console.log(tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const webinarId = req.params.id;

  try {
    const webinar = await Webinar.findById(webinarId);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found.' });
    }

    res.json(webinar);
  } catch (error) {
    console.error('Error getting webinar by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getRandomWebinar = async (req, res) => {
  try {
    const totalWebinars = await Webinar.countDocuments();
    const randomIndex = Math.floor(Math.random() * totalWebinars);

    const randomWebinar = await Webinar.findOne().skip(randomIndex);

    if (!randomWebinar) {
      return res.status(404).json({ message: 'No webinars found.' });
    }

    res.json(randomWebinar);
  } catch (error) {
    console.error('Error getting random webinar:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

