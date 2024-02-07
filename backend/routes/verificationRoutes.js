const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

router.post('/', verificationController.createVerification);
router.get('/:id', verificationController.getVerificationByLogin); 
router.delete('/:id', verificationController.deleteVerification)
router.put('/:login', verificationController.updateVerification);
router.get('/', verificationController.getAllVerification);
router.post('/check-login', verificationController.checkLoginAndPassword);

module.exports = router;
