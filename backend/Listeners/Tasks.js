const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('createTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { tasks : { task : task.task, completed : task.completed } } }, { new : true })
            .then(house => io.to(socket.room).emit('tasksChange', { tasks : house.tasks }))
            .catch(err => console.log(err));
    });

    socket.on('modifyTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room, tasks : { $elemMatch : { _id : task._id } } }, { $set : { 'tasks.$.task' : task.task, 'tasks.$.completed' : task.completed } })
            .then(house => io.to(socket.room).emit('tasksChange', { tasks : house.tasks }))
            .catch(err => console.log(err));
    });

    socket.on('deleteTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { tasks : task } }, { new : true })
            .then(house => io.to(socket.room).emit('tasksChange', { tasks : house.tasks }))
            .catch(err => console.log(err));
    });
}