const express = require('express');
const { signup, login, getUserInfo, getHouse, updateUser, updatePassword, deleteUser, sendVerification, verifyCode, encode, decode } = require('../Controllers/UserController');

const router = express.Router();

// User CRUD Operations
router.post('/signup', signup);
router.post('/login', login);
router.post('/getUserInfo', getUserInfo);
router.post('/getHouse', getHouse);
router.post('/updateUser', updateUser);
router.post('/updatePassword', updatePassword);
router.post('/deleteUser', deleteUser);

// Verification Operations
router.post('/sendVerification', sendVerification);
router.post('/verifyCode', verifyCode);

router.post('/encode', encode);
router.post('/decode', decode);

module.exports = router;