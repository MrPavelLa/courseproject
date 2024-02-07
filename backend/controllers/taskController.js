const Task = require('../models/taskModel');
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

exports.createTask = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const taskData = req.body;
    const newTask = await Task.create(taskData);

    res.status(201).json(newTask._id);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addUserToTask = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const taskId = req.params.id;
  const userId = req.params.userId;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена.' });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    task.accessibleTo.push(userToAdd._id);

    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Ошибка при добавлении пользователя к задаче:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.addUserResultToTask = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const taskId = req.params.id;
  const userId = req.params.userId;
  const resultData = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена.' });
    }

    if (!task.accessibleTo.includes(userId)) {
      return res.status(403).json({ message: 'Пользователь не имеет доступа к данной задаче.' });
    }

    task.userResults.push({ userId, ...resultData });

    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Ошибка при добавлении результата пользователя к задаче:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.deleteTask = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'admin') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  const taskId = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена.' });
    }

    res.status(204).json();  
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getTasksByOwner = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);
  if (!tokenData || String(tokenData.role) !== 'organizer') {
    console.log('Роль', tokenData.role);
    console.log('Доступ запрещен. Недостаточно прав.', tokenData);
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
    const ownerId = req.params.ownerId;
  
    try {
      const tasks = await Task.find({ owner: ownerId });
      res.json(tasks);
    } catch (error) {
      console.error('Error getting tasks by owner:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.getTasksAccessibleToWithInfo = async (req, res) => {
    const token = req.header('Authorization');
    const tokenData = verifyToken(token);
    if (!tokenData) {
      console.log(tokenData);
      return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
    }
    const userId = req.params.userId;
  
    try {
      const tasks = await Task.find({ accessibleTo: userId });
  
      const formattedTasks = tasks.map(task => ({
        _id: task._id, 
        name: task.name,
        maxTime: task.maxTime
      }));
  
      res.json(formattedTasks);
    } catch (error) {
      console.error('Error getting tasks accessibleTo with info:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.getTasksAccessibleToWithQuestions = async (req, res) => {
    const token = req.header('Authorization');
    const tokenData = verifyToken(token);
    if (!tokenData) {
      console.log(tokenData);
      return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
    }
    const userId = req.params.userId;
  
    try {
      const tasks = await Task.find({ accessibleTo: userId });
  
      const formattedTasks = tasks.map(task => {
        const formattedQuestions = task.questions.map(question => ({
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
        }));
  
        return {
          name: task.name,
          questions: formattedQuestions,
        };
      });
  
      res.json(formattedTasks);
    } catch (error) {
      console.error('Error getting tasks accessibleTo with questions:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  exports.getConnectedUsers = async (req, res) => {
    const token = req.header('Authorization');
    const tokenData = verifyToken(token);
    if (!tokenData) {
      console.log(tokenData);
      return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
    }
    const taskId = req.params.taskId;
  
    try {
      const task = await Task.findById(taskId).populate('accessibleTo', 'firstName lastName');
  
      if (!task) {
        return res.status(404).json({ message: 'Задача не найдена.' });
      }
  
      res.json(task.accessibleTo);
    } catch (error) {
      console.error('Error getting connected users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


