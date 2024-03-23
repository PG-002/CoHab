const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('createTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { tasks : { task : task.task, completed : task.completed } } }, {new : true})
            .then(tasks => io.to(socket.room).emit('tasksChange', { tasks : tasks }))
            .catch(err => console.log(err));
    });

    socket.on('modifyTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room, tasks : { $elemMatch : { _id : task._id } } }, { $set : { 'tasks.$.task' : task.task, 'tasks.$.completed' : task.completed } }, {new : true})
            .then(tasks => io.to(socket.room).emit('tasksChange', { tasks : tasks }))
            .catch(err => console.log(err));
    });

    socket.on('deleteTask', async task => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { tasks : { _id : task.id } } }, { new: true })
            .then(tasks => io.to(socket.room).emit('tasksChange', { tasks : tasks }))
            .catch(err => console.log(err));
    });

    socket.on('requestTasks', ({ houseID }) => {
        House.findById(houseID)
          .then(house => {
            if (house) {
              io.to(socket.room).emit('tasksChange', { tasks: house.tasks });
            } else {
              // Handle the case where no house is found for the given houseID
              console.log(`No house found with ID: ${houseID}`);
            }
          })
          .catch(err => {
            console.log(err);
            // Handle the error appropriately
          });
      });
}