const express = require('express');
const { signup, login, joinHouse, getHouse, updateUser, updatePassword, deleteUser, sendVerification, verifyUser, encode, decode } = require('../Controllers/UserController');

const router = express.Router();

// User CRUD Operations
router.post('/signup', signup);
router.post('/login', login);
router.post('/joinHouse', joinHouse);
router.post('/getHouse', getHouse);
router.post('/updateUser', updateUser);
router.post('/updatePassword', updatePassword);
router.post('/deleteUser', deleteUser);

// Verification Operations
router.post('/sendVerification', sendVerification);
router.post('/verifyUser', verifyUser);

router.post('/encode', encode);
router.post('/decode', decode);

module.exports = router;
