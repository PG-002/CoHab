const User = require('../Models/User');

module.exports = (socket, io) => {
    socket.on('updateLocation', async (lat, long) => {
        console.log(lat, long);
        await User.findOneAndUpdate({ _id : socket.user._id }, { $set : {'location.latitude' : lat, 'location.longitude' : long, 'location.lastUpdated' : Date.now() } }, { new : true })
            .then(user => io.to(socket.room).emit('locationChange', { userId : user._id, location : user.location }))
            .catch(err => console.log(err));
    });
}