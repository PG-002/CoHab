const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
const env = process.env;
const PORT = env.PORT || 5003;

// Connection to MongoDB
const mongoose = require('mongoose');
mongoose.connect(env.MONGODB_URI, { dbName : 'Co-habDB'})
    .then(() => console.log('Connected to MongoDB.'))
    .catch((e) => console.log(e));

const app = express();
app.set('port', PORT);
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

if(env.NODE_ENV === 'production')
{
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));
}

// Routes

const userRoutes = require('../backend/Routes/UserRoutes');
app.use('/api/users', userRoutes);

const houseRoutes = require('../backend/Routes/HouseRoutes');
app.use('/api/houses/', houseRoutes);


app.listen(PORT, () => console.log('Server listening on port ' + PORT));