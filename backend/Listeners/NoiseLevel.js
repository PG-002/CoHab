const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('setNoiseLevel', async level => {
        await House.findByIdAndUpdate(socket.room, { noiseLevel : parseInt(level + '', 10) }, { new : true })
            .then(house => io.to(socket.room).emit('noiseLevelChange', { noiseLevel : house.noiseLevel }))
            .catch(err => console.log(err));
    });
}