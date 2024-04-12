const User = require('../Models/User');

module.exports = (socket, io) => {

    const updateObj = (lat, long) => ({
        'location.latitude' : lat, 
        'location.longitude' : long, 
        'location.lastUpdated' : Date.now()
    })

    socket.on('updateLocation', async (lat, long) =>
        await User.findByIdAndUpdate(socket.user._id, { $set : updateObj(lat, long) }, { new : true })
            .then(user => io.to(socket.room).emit('locationChange', { userId : user._id, location : user.location }))
            .catch(err => console.log(err))
    );
}