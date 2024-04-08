const House = require('../Models/House');

module.exports = (socket, io) => {
    const taskObj = task => ({
        task : task.task,
        createdBy : socket.user.firstName,
        assignedTo : task.assignedTo,
        completed : false
    });

    const updateObj = task => ({
        'tasks.$.task' : task.task,
        'tasks.$.createdBy' : task.createdBy,
        'tasks.$.assignedTo' : task.assignedTo,
        'tasks.$.completed' : task.completed
    });

    socket.on('createTask', async task => {
        await House.findByIdAndUpdate(socket.room, { $push : { tasks : taskObj(task) } }, { new : true })
            .then(house => io.to(socket.room).emit('tasksChange', { tasks : house.tasks }))
            .catch(err => console.log(err));
    });

    socket.on('modifyTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room, 'tasks._id' : task._id }, { $set : updateObj(task) }, { new : true })
            .then(house => io.to(socket.room).emit('tasksChange', { tasks : house.tasks }))
            .catch(err => console.log(err));
    });

    // socket.on('searchTask', async input => {
    //     var house = await House.find({ _id : socket.room } ).exec();
    //     var taskList = await house.tasks.find({ house.tasks.task : 'Buy' }).exec();
    //     console.log(house);
    //     // output = await tasks.find({ task : input.task }).exec()
    //         // .then(house => io.to(socket.room).emit('tasksChange', { output }))
    //         // .catch(err => console.log(err));
    // });

    socket.on('deleteTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { tasks : { _id: task._id } } }, { new : true })
            .then(house => io.to(socket.room).emit('tasksChange', { tasks : house.tasks }))
            .catch(err => console.log(err));
    });
}