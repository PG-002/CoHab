const express = require('express');
const { createHouse } = require('../Controllers/HouseController');
const { joinHouse } = require('../Controllers/HouseController');

const router = express.Router();

router.post('/createHouse', createHouse);
router.post('/joinHouse', joinHouse);
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