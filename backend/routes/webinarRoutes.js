const express = require('express');
const router = express.Router();
const webinarController = require('../controllers/webinarController');

router.post('/', webinarController.createWebinar);
router.delete('/:id', webinarController.deleteWebinar);
router.post('/:id/addUser/:userId', webinarController.addUserToWebinar);
router.post('/:id/addUserToCertificate/:userId', webinarController.addUserToCertificateWebinar);
router.get('/', webinarController.getAllWebinars);
router.get('/:id', webinarController.getWebinarById);
router.get('/random', webinarController.getRandomWebinar);

module.exports = router;