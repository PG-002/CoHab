const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('addGrocery', async item => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { groceryNeeded : item } })
            .then(groceryNeeded => io.to(socket.room).emit('groceryChange', { groceryNeeded : item }))
            .catch(err => console.log(err));
    });

    socket.on('modifyGrocery', async item => {
        await House.findOneAndUpdate({ _id : socket.room, groceryNeeded : { $elemMatch : { _id : rule._id } } }, { $set : { 'groceryNeeded' : item } })
            .then(groceryNeeded => io.to(socket.room).emit('groceryChange', { groceryNeeded : item }))
            .catch(err => console.log(err));
    });

    socket.on('deleteGrocery', async item => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { groceryNeeded : item } })
            .then(groceryNeeded => io.to(socket.room).emit('groceryChange', { groceryNeeded : item }))
            .catch(err => console.log(err));
    });
}