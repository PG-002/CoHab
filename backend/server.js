const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const env = process.env;

const app = express();
app.use(cors());




app.listen(5000);