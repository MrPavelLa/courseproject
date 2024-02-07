const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

router.post('/', trainingController.createTraining);
router.delete('/:id', trainingController.deleteTraining);
router.post('/:id/addUser/:userId', trainingController.addUserToTraining);
router.post('/:id/addUserToCertificate/:userId', trainingController.addUserToCertificateTraining);
router.get('/', trainingController.getAllTrainings);
router.get('/:id', trainingController.getTrainingById);
router.post('/:id/addMaterial', trainingController.addMaterialToTraining);
router.post('/:id/addResource', trainingController.addResourceToTraining);


module.exports = router;

