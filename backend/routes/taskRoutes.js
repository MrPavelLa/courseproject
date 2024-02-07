const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.post('/:id/addUser/:userId', taskController.addUserToTask);
router.post('/:id/addUserResult/:userId', taskController.addUserResultToTask);
router.delete('/:id', taskController.deleteTask);
router.get('/owner/:ownerId', taskController.getTasksByOwner);
router.get('/accessibleToWithInfo/:userId', taskController.getTasksAccessibleToWithInfo);
router.get('/accessibleToWithQuestions/:userId', taskController.getTasksAccessibleToWithQuestions);
router.get('/connectedUsers/:taskId', taskController.getConnectedUsers);

module.exports = router;
