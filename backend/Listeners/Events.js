const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('createEvent', async event => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { events : { title : event.title, date : event.date, duration : event.duration, event_location : event.event_location, 
            longitude : event.longitude, latitude : event.latitude, whosGoing : event.whosGoing } } }, { new : true })
            .then(house => io.to(socket.room).emit('eventsChange', { events : house.events }))
            .catch(err => console.log(err));
    });

    socket.on('modifyEvent', async event => {
        await House.findOneAndUpdate({ _id : socket.room, events : { $elemMatch : { _id : event._id } } }, { $set : { 'events.$.title' : event.title, 'events.$.date' : event.date, 
        'events.$.duration' : event.duration, 'events.$.event_location' : event.event_location, 'events.$.longitude' : event.longitude, 'events.$.latitude' : event.latitude, 
         'events.$.whosGoing' : event.whosGoing } })
            .then(house => io.to(socket.room).emit('eventsChange', { events : house.events }))
            .catch(err => console.log(err));
    });

    socket.on('deleteEvent', async event => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { events : event } }, { new : true })
            .then(house => io.to(socket.room).emit('eventsChange', { events : house.events }))
            .catch(err => console.log(err));
    });
}