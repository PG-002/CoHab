const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('updateStatus', async status => {
        await House.findOneAndUpdate({ _id : socket.room, 'statuses.userId' : socket.user._id }, { $set : { 'statuses.$.status' : status } }, { new : true})
            .then(house => io.to(socket.room).emit('statusChange', { statuses : house.statuses }))
            .catch(async () => {
                await House.findByIdAndUpdate(socket.room, { $push : { statuses : { userId : socket.user._id, status : status } } }, { new : true })
                    .then(house => io.to(socket.room).emit('statusChange', { statuses : house.statuses }))
                    .catch(e => console.log(e));
            })
    });
}