const Lecture = require('../models/lecturModel');
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

exports.createLecture = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const lectureData = req.body;
    const newLecture = await Lecture.create(lectureData);

    res.status(201).json('Успешно создано');
  } catch (error) {
    console.error('Error creating lecture:', error);
    res.status(500).json('Произошла ошибка на сервере при создании');
  }
};

exports.deleteLecture = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const { id } = req.params;

  try {
    const lecture = await Lecture.findByIdAndUpdate(id, { isdeleted: true }, { new: true });

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    res.status(204).json();
  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addUserToLecture = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData) {
    console.log(tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const lectureId = req.params.id;
  const userId = req.params.userId;

  try {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (lecture.accessibleTo.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already enrolled in the lecture.' });
    }

    lecture.accessibleTo.push(userToAdd._id);
    lecture.enrolledCount += 1;

    await lecture.save();

    res.json(lecture);
  } catch (error) {
    console.error('Error adding user to lecture:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addUserToCertificateLecture = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const lectureId = req.params.id;
  const userId = req.params.userId;

  try {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (lecture.certificates.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already enrolled in the lecture.' });
    }

    lecture.certificates.push(userToAdd._id);

    await lecture.save();

    res.json(lecture);
  } catch (error) {
    console.error('Error adding user to lecture:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.json(lectures);
  } catch (error) {
    console.error('Error getting all lectures:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getLectureById = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData) {    
    console.log(tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const lectureId = req.params.id;

  try {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    res.json(lecture);
  } catch (error) {
    console.error('Error getting lecture by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getRandomLecture = async (req, res) => {
  try {
    const randomLecture = await Lecture.aggregate([{ $sample: { size: 1 } }]);

    if (randomLecture.length === 0) {
      return res.status(404).json({ message: 'No lectures found.' });
    }

    res.json(randomLecture[0]);
  } catch (error) {
    console.error('Error getting random lecture:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
