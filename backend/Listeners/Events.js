const House = require('../Models/House');

module.exports = (socket, io) => {
  
  const updateObj = event => ({
    'events.$.title' : event.title,
    'events.$.start' : event.start,
    'events.$.end' : event.end,
    'events.$.description' : event.description,
    'events.$.allDay' : event.allDay,
    'events.$.createdBy' : event.createdBy
  });

  socket.on('createEvent', async (event) => {
    event.start = Date.parse(event.start);
    event.end = Date.parse(event.end);
    await House.findByIdAndUpdate(socket.room, { $push : { events : event } }, { new : true })
      .then((house) => io.to(socket.room).emit('eventsChange', { events : house.events }))
      .catch((err) => console.log(err));
  });
  
  socket.on('modifyEvent', async (event) => {
    await House.findOneAndUpdate({ _id : socket.room, $elemMatch : { _id : event._id } }, { $set : updateObj(event) }, { new : true })
      .then((house) => io.to(socket.room).emit('eventsChange', { events: house.events }))
      .catch((err) => console.log(err));
  });

  socket.on('deleteEvent', async (event) => {
    await House.findOneByIdAndUpdate({ _id : socket.room }, { $pull : { events : event } }, { new : true })
      .then((house) => io.to(socket.room).emit('eventsChange', { events : house.events }))
      .catch((err) => console.log(err));
  });
};
