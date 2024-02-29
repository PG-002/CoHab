const express = require('express');
const { signup, login, decode } = require('../Controllers/UserController');

const router = express.Router();

router.post('/signup', signup);
router.get('/login', login);

router.get('/decode', decode);


module.exports = router;