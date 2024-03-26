const express = require('express');
const { createHouse } = require('../Controllers/HouseController');
const { joinHouse } = require('../Controllers/HouseController');
const { updateHouse } = require('../Controllers/HouseController');
const { deleteHouse } = require('../Controllers/HouseController');
const { modifyNoiseLevel } = require('../Controllers/HouseController');

const router = express.Router();

router.post('/createHouse', createHouse);
router.post('/joinHouse', joinHouse);
router.post('/updateHouse', updateHouse);
router.post('/deleteHouse', deleteHouse);
router.post('/modifyNoiseLevel', modifyNoiseLevel);
// add event
 
module.exports = router;