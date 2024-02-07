const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', commentController.createComment);

router.delete('/:commentId', commentController.deleteComment);

router.get('/:objectReference', commentController.getCommentsForObject);

module.exports = router;
