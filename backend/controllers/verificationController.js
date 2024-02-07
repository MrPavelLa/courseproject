const Verification = require('../models/verificationModel');
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

exports.createVerification = async (req, res) => {
  const { itemId, login, password, role, phonenumber } = req.body;

  try {
    const existingUser = await Verification.findOne({ login });

    if (existingUser) {
      return res.json({ error: 'Пользователь с таким логином уже существует.' });
    }

    const newVerification = await Verification.create({ itemId, login, password, role, phonenumber });

    res.status(201).json(true);
  } catch (error) {
    if (error.errors) {
      const validationErrors = Object.values(error.errors).map((e) => e.message);
      return res.json({ error: validationErrors });
    }
    res.json({ error: 'Ошибка при создании'});
  }
};


exports.deleteVerification = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const itemId = req.params.id; 

  try {
    const deletedVerification = await Verification.findOneAndDelete({ itemId });

    if (!deletedVerification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.json(deletedVerification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateVerification = async (req, res) => {
  const { login } = req.params;
  const { password } = req.body;

  try {
    const updatedVerification = await Verification.findOneAndUpdate({ login }, { password }, { new: true });

    if (!updatedVerification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    return res.json({ status: 'good' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getVerificationByLogin = async (req, res) => {

  const { login } = req.params;

  try {
    const verification = await Verification.findOne({ login });

    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllVerification = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  
  try {
    const allVerification = await Verification.find();

    res.json(allVerification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkLoginAndPassword = async (req, res) => {
  const { login, phonenumber } = req.body;

  try {
    const verification = await Verification.findOne({ login });

    if (!verification) {
      return res.json({ status: 'Логин не существует' });
    }

    if (verification.phonenumber !== req.body.phonenumber) {
      return res.json({ status: 'Пароль не совпадает с логином' });
    }

    res.json({ status: 'Совпадает' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};