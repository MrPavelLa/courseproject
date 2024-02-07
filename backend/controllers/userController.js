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

exports.createUser = async (req, res) => {
  const { firstName, lastName, logo } = req.body;

  try {
    const newUser = await User.create({ firstName, lastName, logo });
    res.json(newUser._id);
  } catch (error) {
    res.json({error: error.message});
    res.status(400).json({ message: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
 
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    console.log('Удаленный пользователь:', deletedUser);
    res.json({ message: 'Пользователь удален', deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserByCode = async (req, res) => {
  try {
    
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      console.log('Пользователь не найден.');
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    console.log('Пользователь найден:', user);
    res.json(user);
  } catch (error) {
    console.error('Ошибка при поиске пользователя:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserCapacity = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const { dCapacity } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { dCapacity } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    console.log('Обновленный пользователь:', updatedUser);
    res.json({ message: 'dCapacity обновлен', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

