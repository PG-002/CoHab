const House = require('../Models/House')
const { createToken } = require('../Middleware/Token');
const User = require('../Models/User');
const { sendInvite, getHouse, deleteCode } = require('../Middleware/Email');

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

const sendJoinCode = async (req, res) => {
    const { houseId, email } =  req.body;

    const user = User.findOne({ email : email })
        .catch(() => null);

    const house = House.findById(houseId)
        .catch(() => null);

    if(!house)
    {
        res.status(404);
        res.json({ sent : false, error : 'House does not exist.' });
        return;
    }

    if(!user)
    {   
        res.status(404);
        res.json({ sent : false, error : 'User does not exist.' });
        return;
    }

    if(!user.verified)
    {
        res.status(404);
        res.json({ sent : false, error : 'This user has not confirmed their email.' });
        return;
    }

    res.status(200);
    res.json(await sendInvite(user, house));
}

const join = async (req, res) => {
    const { userId, code } = req.body;

    const user = User.findById(userId)
        .catch(() => null);

    if(!user)
    {
        res.status(404);
        res.json({ houseId : null, error : 'User does not exist.' });
        return;
    }

    const verificationError = await verifyCode(user, code);

    if(verificationError)
    {
        res.status(404);
        res.json(verificationError);
        return;
    }

    const houseId = getHouse(userId, code);

    if(!houseId)
    {
        res.status(404);
        res.json({ houseId : null, error : 'Could not get the houseId.' });
        return;
    }

    const updateErr = User.findByIdAndUpdate(userId, { houseId : houseId })
        .then(() => null)
        .catch(err => err);

    if(updateErr)
    {
        res.status(404);
        res.json({ houseId : null, error : 'User could not be updated.' });
        return;
    }

    await deleteCode(user, code)
        .then(() => {
            res.status(200);
            res.json({ houseId : houseId, error : '' });
        })
        .catch(() => {
            res.status(404);
            res.json({ houseId : null, error : 'VerificationEntry could not be deleted.' });
        });
};

const updateHouse = async (req, res) => {
    const { id, fieldName, fieldValue } = req.body;
    
    res.status(200);
    await House.updateOne({ _id : id }, { [fieldName] : fieldValue })
        .then(() => res.json({ updated : true, error : '' }))
        .catch(err => res.json({ updated : false, error: err }));
}

const deleteHouse = async (req, res) => {
    const { id } = req.body;
    const house = await House.findById(id)
        .catch(() => null);

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

module.exports = { createHouse, sendJoinCode, join, updateHouse, deleteHouse, modifyNoiseLevel };
