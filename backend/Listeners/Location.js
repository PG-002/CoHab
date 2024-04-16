const User = require('../Models/User');
const { use } = require('../Routes/UserRoutes');

module.exports = (socket, io) => {

    const updateObj = (lat, long) => ({
        'location.latitude' : parseInt(lat + ''), 
        'location.longitude' : parseInt(long + ''), 
        'location.lastUpdated' : Date.now()
    })

    const getRoomateLocations = async () => {

        const users = await User.find({ houseId : socket.room, 'location.isTracking' : true })
            .catch(() => null);

        if(!users)
            return [];

        return users.map(user => ({ name : user.firstName + ' ' + user.lastName, lat : user.location.latitude, long : user.location.longitude, lastUpdated : user.location.lastUpdated }))
    }

    socket.on('updateLocation', async (lat, long) =>
        await User.findByIdAndUpdate(socket.user._id, { $set : updateObj(lat, long) }, { new : true })
            .then(async () => io.to(socket.room).emit('locationChange', await getRoomateLocations()))
            .catch(err => console.log(err))
    );
}