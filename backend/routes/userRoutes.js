const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUserByCode);
router.put('/:id/updateCapacity', userController.updateUserCapacity);

module.exports = router;