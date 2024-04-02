const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('createEvent', async event => {
        event.start = Date.parse(event.start);
        event.end = Date.parse(event.end);
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { events : { title : event.title, start : event.start, 
                end : event.end, description : event.description, allDay : event.allDay, createdBy : event.createdBy } } }, { new : true })
            .then(house => io.to(socket.room).emit('eventsChange', { events : house.events }))
            .catch(err => console.log(err));
    });

    socket.on('modifyEvent', async event => {
        await House.findOneAndUpdate({ _id : socket.room, events : { $elemMatch : { _id : event.id } } }, { $set : 
                { 'events.$.title' : event.title, 'events.$.start' : event.start, 'events.$.end' : event.end, 
                  'events.$.description' : event.description, 'events.$.allDay' : event.allDay, 'events.$.createdBy' : event.createdBy } })
            .then(house => io.to(socket.room).emit('eventsChange', { events : house.events }))
            .catch(err => console.log(err));
    });

<<<<<<< HEAD
    socket.on('deleteEvent', async event => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { events : event } }, { new : true })
            .then(house => io.to(socket.room).emit('eventsChange', { events : house.events }))
            .catch(err => console.log(err));
    });
}
=======
  socket.on("deleteEvent", async (event) => {
    await House.findOneAndUpdate(
      { _id: socket.room },
      { $pull: { events: event } },
      { new: true }
    )
      .then((house) =>
        io.to(socket.room).emit("eventsChange", { events: house.events })
      )
      .catch((err) => console.log(err));
  });
};
>>>>>>> parent of a54ab03 (Merge branch 'main' into Calendar)
