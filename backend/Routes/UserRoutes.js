const express = require('express');
const { signup, login, joinHouse, getHouse, updateUser, updatePassword, deleteUser, sendVerification, verifyUser, encode, decode } = require('../Controllers/UserController');

const router = express.Router();

// User CRUD Operations
router.post('/signup', signup);
router.post('/login', login);
router.put('/joinHouse', joinHouse);
router.get('/getHouse', getHouse);
router.put('/updateUser', updateUser);
router.put('/updatePassword', updatePassword);
router.delete('/deleteUser', deleteUser);

// Verification Operations
router.post('/sendVerification', sendVerification);
router.get('/verifyUser', verifyUser);

router.get('/encode', encode);
router.get('/decode', decode);

module.exports = router;