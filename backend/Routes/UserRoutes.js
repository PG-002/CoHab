const express = require('express');
const { signup, login, emailVerificationCode, validateVerificationCode, decode } = require('../Controllers/UserController');

const router = express.Router();

// User CRUD Operations
router.post('/signup', signup);
router.get('/login', login);

// Verify User
router.post('/sendVerificationCode', emailVerificationCode);
router.get('/validateVerificationCode', validateVerificationCode);

router.get('/decode', decode);


module.exports = router;