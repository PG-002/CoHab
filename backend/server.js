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

// Configures the app
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
    app.use(express.static(path.join(__dirname, "../frontend/build")));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html')));
}

// Routes
const userRoutes = require('../backend/Routes/UserRoutes');
const houseRoutes = require('../backend/Routes/HouseRoutes');

app.use('/api/users', userRoutes);
app.use('/api/houses/', houseRoutes);

// Configures the server and socket io connection
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors : { origin : '*' } });
const Session = require('../backend/Middleware/Session')(io);

// Authenticates client
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token ? socket.handshake.auth.token : socket.handshake.headers.token;
    const session = await Session.auth(token);

    if(session.error)
        return next(new Error(session.error));

    socket.user = session.user;
    socket.room = session.room;
    next();
});

// Connection event
io.on('connect', socket => {
    socket.join(socket.room);
    socket.emit('session', { sessionId : socket.sessionId });
    Session.addEventListeners(socket);
});

server.listen(PORT, () => console.log('Server listening on port ' + PORT));