const Training = require('../models/trainingModel');
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

exports.createTraining = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const trainingData = req.body;
    const newTraining = await Training.create(trainingData);
    
    res.status(201).json('Успешно создано');
  } catch (error) {
    console.error('Error creating training:', error);
    res.status(500).json('Произошла ошибка на сервере при создании');
  }
};

exports.deleteTraining = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const { id } = req.params;

  try {
    const training = await Training.findByIdAndUpdate(id, { isdeleted: true }, { new: true });


    if (!training) {
      return res.status(404).json({ message: 'Training not found.' });
    }

    res.status(204).json();  
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addUserToTraining = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData) {
    console.log(tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const trainingId = req.params.id;
  const userId = req.params.userId;

  try {
    const training = await Training.findById(trainingId);

    if (!training) {
      return res.status(404).json({ message: 'Вебинар не найден.' });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (training.enrolledCount >= training.capacity) {
      return res.status(400).json({ message: 'Достигнуто максимальное количество участников на вебинаре.' });
    }

    if (training.accessibleTo.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'Пользователь уже записан на вебинар.' });
    }

    training.accessibleTo.push(userToAdd._id);
    training.enrolledCount += 1;

    await training.save();

    res.json(training);
  } catch (error) {
    console.error('Ошибка при добавлении пользователя на вебинар:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.addMaterialToTraining = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const { id } = req.params;
  const { title, link } = req.body;

  try {
    const training = await Training.findByIdAndUpdate(
      id,
      { $push: { materials: { title, link } } },
      { new: true }
    );

    if (!training) {
      return res.status(404).json({ message: 'Training not found.' });
    }

    res.status(200).json(training.materials);
  } catch (error) {
    console.error('Error adding material to training:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addResourceToTraining = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const { id } = req.params;
  const { title, link } = req.body;

  try {
    const training = await Training.findByIdAndUpdate(
      id,
      { $push: { resources: { title, link } } },
      { new: true }
    );

    if (!training) {
      return res.status(404).json({ message: 'Training not found.' });
    }

    res.status(200).json(training.resources);
  } catch (error) {
    console.error('Error adding resource to training:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addUserToCertificateTraining = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const trainingId = req.params.id;
  const userId = req.params.userId;

  try {
    const training = await Training.findById(trainingId);

    if (!training) {
      return res.status(404).json({ message: 'Вебинар не найден.' });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (training.certificates.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'Пользователь уже записан на вебинар.' });
    }

    training.certificates.push(userToAdd._id);

    await training.save();

    res.json(training);
  } catch (error) {
    console.error('Ошибка при добавлении пользователя на вебинар:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (error) {
    console.error('Error getting all trainings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTrainingById = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData) {
    console.log(tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const trainingId = req.params.id;

  try {
    const training = await Training.findById(trainingId);

    if (!training) {
      return res.status(404).json({ message: 'Training not found.' });
    }

    res.json(training);
  } catch (error) {
    console.error('Error getting training by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getRandomTraining = async (req, res) => {
  try {
    const totalTrainings = await Training.countDocuments();
    const randomIndex = Math.floor(Math.random() * totalTrainings);

    const randomTraining = await Training.findOne().skip(randomIndex);

    if (!randomTraining) {
      return res.status(404).json({ message: 'No trainings found.' });
    }

    res.json(randomTraining);
  } catch (error) {
    console.error('Error getting random training:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





