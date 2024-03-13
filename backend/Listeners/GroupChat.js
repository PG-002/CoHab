const House = require("../Models/House");

module.exports = (socket, io) => {
    socket.on('sendMessage', async message => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { groupChat : message } })
            .then(messages => io.to(socket.room).emit('groupChatChange', { messages : messages }))
            .catch(err => console.log(err));
    });

    socket.on('deleteMessage', async message => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { groupChat : message } })
            .then(messages => io.to(socket.room).emit('groupChatChange', { messages : messages }))
            .catch(err => console.log(err));
    });
};