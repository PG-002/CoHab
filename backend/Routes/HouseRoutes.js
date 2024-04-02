const express = require('express');
const { createHouse, sendJoinCode, join, updateHouse, deleteHouse, modifyNoiseLevel } = require('../Controllers/HouseController');

const router = express.Router();

router.post('/createHouse', createHouse);
router.post('/sendJoinCode', sendJoinCode);
router.post('/join', join);
router.post('/updateHouse', updateHouse);
router.post('/deleteHouse', deleteHouse);
router.post('/modifyNoiseLevel', modifyNoiseLevel);
 
module.exports = router;