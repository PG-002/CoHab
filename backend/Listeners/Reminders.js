const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('createReminder', async reminder => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { reminders : { title : reminder.title, date : reminder.date } } }, { new : true })
            .then(house => io.to(socket.room).emit('remindersChange', { reminders : house.reminders }))
            .catch(err => console.log(err));
    });

    socket.on('modifyReminder', async reminder => {
        await House.findOneAndUpdate({ _id : socket.room, reminders : { $elemMatch : { _id : reminder._id } } }, { $set : { 'reminders.$.title' : reminder.title, 'reminders.$.date' : reminder.date } })
            .then(house => io.to(socket.room).emit('remindersChange', { reminders : house.reminders }))
            .catch(err => console.log(err));
    });

    socket.on('deleteReminder', async reminder => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { reminders : reminder } }, { new : true })
            .then(house => io.to(socket.room).emit('remindersChange', { reminders : house.reminders }))
            .catch(err => console.log(err));
    });
}