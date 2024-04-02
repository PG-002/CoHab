const House = require("../Models/House");

module.exports = (socket, io) => {

    const messageObj = message => ({
        message : message,
        sentBy : socket.user.firstName,
        email : socket.user.email,
        date : Date.now()
    });

    socket.on('sendMessage', async message => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { groupChat : messageObj(message) } }, { new : true })
            .then(messages => io.to(socket.room).emit('groupChatChange', { messages : messages }))
            .catch(err => console.log(err));
    });

    socket.on('deleteMessage', async message => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { groupChat : message } }, { new : true })
            .then(messages => io.to(socket.room).emit('groupChatChange', { messages : messages }))
            .catch(err => console.log(err));
    });
};