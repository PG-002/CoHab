const House = require('../Models/House')
const { createToken, verifyToken, decodeToken } = require('../Middleware/Token');
const User = require('../Models/User');

const createHouse = async (req, res) => {
    const { houseName, code } = req.body;

    await House.create({ houseName : houseName, joinHouseCode : code }).then(house => {
        res.status(200);
        
        const token = createToken({ house : house });

        res.json({token : token});
    }).catch(err => {
        console.log(err);
        res.status(200);
        res.json({error : err});
    })
}

const joinHouse = async (req, res) => {

    // _id is the user's id
    const { joinHouseCode, firstName, lastName, _id } = req.body;
    const fullName = firstName + ' ' + lastName;

    const house = await House.where({ joinHouseCode: joinHouseCode }).findOne();

    const user = await User.where({ _id: _id }).findOne();
    await User.updateOne({ _id : _id }, { houseId : house._id });

    await House.updateOne({ joinHouseCode : joinHouseCode }, {$inc: { amountOfUsers : 1 }, $push: { members : fullName }}).then(() => {
        res.status(200);
        res.json({user : {
            id : user._id,
            firstname: user.firstName,
            lastname: user.lastName,
            houseId : house._id
        }});
    }).catch(e => {
        console.log(e);
        res.status(200);
        res.json({ Error: e })
    });
}

const updateHouse = async (req, res) => {
    const { id, fieldName, fieldValue } = req.body;
    
    res.status(200);
    await House.updateOne({ _id : id }, { [fieldName] : fieldValue })
        .then(() => res.json({ updated : true, error : '' }))
        .catch(err => res.json({ updated : false, error: err }));
}

const deleteHouse = async (req, res) => {
    const { id } = req.body;
    const house = await House.findOne({ _id : id }).catch(() => null);

    if(!house)
    {
        res.status(200);
        res.json({ deleted : false, error : 'House does not exist.' });
        return;
    }

    await User.updateMany({ houseId : id }, { houseId : null }).catch(() => null);

    res.status(200);
    await House.deleteOne({ _id : id })
        .then(() => res.json({ deleted : true, error : '' }))
        .catch(err => res.json({ deleted : false, error : err }));
}

const modifyNoiseLevel = async (req, res) => {
    const { id, newLevel } = req.body;
    const house = await House.findOne({ _id : id }).catch(() => null);

    if(!house)
    {
        res.status(200);
        res.json({ deleted : false, error : 'House does not exist.' });
        return;
    }
    await House.updateOne({ _id : id }, { noiseLevel : newLevel })
        .then(() => res.json({ updated : true, error : '' }))
        .catch(err => res.json({ updated : false, error: err }));
}

module.exports = { createHouse, joinHouse, updateHouse, deleteHouse, modifyNoiseLevel };
