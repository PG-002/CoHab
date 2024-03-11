const express = require('express');
const { signup, login, updateUser, deleteUser, sendVerification, verifyUser, decode } = require('../Controllers/UserController');

const router = express.Router();

// User CRUD Operations
router.post('/signup', signup);
router.post('/login', login);
router.put('/updateUser', updateUser);
router.delete('/deleteUser', deleteUser);

// Verification Operations
router.post('/sendVerification', sendVerification);
router.get('/verifyUser', verifyUser);

router.get('/decode', decode);

module.exports = router;