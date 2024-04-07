const express = require('express');
const authorize = require('./middlewares/authorizationByRole');
const { FeedbackUploadController } = require('./controllers/FeedbackController');
const router = express.Router();

router.post('/upload', authorize, FeedbackUploadController);

module.exports = router;