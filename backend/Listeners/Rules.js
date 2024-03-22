const House = require('../Models/House');

module.exports = (socket, io) => {
    socket.on('createRule', async rule => {
        await House.findOneAndUpdate({ _id : socket.room }, { $push : { rules : rule } })
            .then(rules => io.to(socket.room).emit('rulesChange', { rules : rules }))
            .catch(err => console.log(err));
    });

    socket.on('modifyRule', async rule => {
        await House.findOneAndUpdate({ _id : socket.room, rules : { $elemMatch : { _id : rule._id } } }, { $set : { 'rules.$.rule' : rule.rule, } })
            .then(rules => io.to(socket.room).emit('rulesChange', { rules : rules }))
            .catch(err => console.log(err));
    });

    socket.on('deleteRule', async rule => {
        await House.findOneAndUpdate({ _id : socket.room }, { $pull : { rules : rule } })
            .then(rules => io.to(socket.room).emit('rulesChange', { rules : rules }))
            .catch(err => console.log(err));
    });
}