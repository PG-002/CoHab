const House = require('../Models/House')
const { createToken, verifyToken, decodeToken } = require('../Middleware/Token');

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

module.exports = { createHouse };