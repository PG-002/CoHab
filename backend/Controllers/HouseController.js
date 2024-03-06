const House = require('../Models/House')
const { createToken, verifyToken, decodeToken } = require('../Middleware/Token');
const User = require('../Models/User');

const createHouse = async (req, res) => {
    const { houseName } = req.body;

    await House.create({ houseName : houseName, joinHouseCode : 'testcode' }).then(house => {
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
    const fullName = firstName + " " + lastName;

    const house = await House.where({ joinHouseCode: joinHouseCode }).findOne();

    const user = await User.where({ _id: _id }).findOne();
    await User.updateOne({ _id : _id }, {houseID: house._id });

    await House.updateOne({ joinHouseCode : joinHouseCode }, {$inc: { amountOfUsers : 1 }, $push: { members : fullName }}).then(() => {
        res.status(200);
        res.json({ Message : 'Success'});
    }).catch(e => {
        console.log(e);
        res.status(200);
        res.json({ Error: e })
    });
}
module.exports = { createHouse, joinHouse };
