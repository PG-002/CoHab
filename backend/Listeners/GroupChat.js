const House = require("../Models/House");

module.exports = (socket, io) => {
    socket.on('sendMessage', async message => {
        console.log("Entered send ");
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { groupChat : message } }, {new : true})
            .then(messages => io.to(socket.room).emit('groupChatChange', { messages : messages }))
            .catch(err => console.log(err));
    });

    socket.on('deleteMessage', async message => {
        console.log("Entered delete");
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { groupChat : message } }, {new : true})
            .then(messages => io.to(socket.room).emit('groupChatChange', { messages : messages }))
            .catch(err => console.log(err));
    });
};