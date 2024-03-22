const express = require('express');
const { createHouse } = require('../Controllers/HouseController');
const { joinHouse } = require('../Controllers/HouseController');
const { updateHouse } = require('../Controllers/HouseController');
const { deleteHouse } = require('../Controllers/HouseController');

const router = express.Router();

router.post('/createHouse', createHouse);
router.post('/joinHouse', joinHouse);
router.post('/updateHouse', updateHouse);
router.post('/deleteHouse', deleteHouse);
// add user
// add event
// add reminder
// add task
// add event
// add rules
// add grocery
// send group message
// add todo
// set noise level
// delete house


module.exports = router;