const express = require('express');
const router = express.Router();
const lecturController = require('../controllers/lecturController');

router.post('/', lecturController.createLecture);
router.delete('/:id', lecturController.deleteLecture);
router.post('/:id/addUser/:userId', lecturController.addUserToLecture);
router.post('/:id/addUserToCertificate/:userId', lecturController.addUserToCertificateLecture);
router.get('/', lecturController.getAllLectures);
router.get('/:id', lecturController.getLectureById);  
router.get('/random', lecturController.getRandomLecture); 


module.exports = router;
