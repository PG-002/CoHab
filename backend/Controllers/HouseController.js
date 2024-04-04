const House = require('../Models/House')
const { createToken } = require('../Middleware/Token');
const User = require('../Models/User');
const { sendInvite, getHouse, deleteCode } = require('../Middleware/Email');

const createHouse = async (req, res) => {
    const { userId, houseName } = req.body;

    const user = await User.findById(userId)
        .catch(() => null);

    res.status(200);

    if(!user)
    {
        res.json({ token : null, error : 'User does not exist.' });
        return;
    }

    if(!user.verified)
    {
        res.json({ token : null, error : 'This user is not verified.' });
        return;
    }

    const house = await House.create({ houseName : houseName, members : [user.firstName + ' ' + user.lastName] })
        .catch(() => null);

    if(!house)
    {
        res.json({ token : null, error : 'House could not be created.' });
        return;
    }

    await User.findByIdAndUpdate(userId, { houseId : house._id })
        .then(() => res.json({ token : createToken({ house : house }), error : '' }))
        .catch(() => res.json({ token : null, error : 'User could not be put into house.' }));
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

    res.status(200);

    const user = User.findById(userId)
        .catch(() => null);

    if(!user)
    {
        res.json({ token : null, error : 'User does not exist.' });
        return;
    }

    const verificationError = await verifyCode(user, code);

    if(verificationError)
    {
        res.json({ token : null, error : verificationError  });
        return;
    }

    const houseId = await getHouse(userId, code);

    if(!houseId)
    {
        res.json({ token : null, error : 'Could not get the houseId.' });
        return;
    }

    const house = await House.findById(houseId)
        .catch(() => null);

    if(!house)
    {
        res.json({ token : null, error : 'Could not fetch house.' });
        return;
    }

    const updateErr = User.findByIdAndUpdate(userId, { houseId : houseId })
        .then(() => null)
        .catch(err => err);

    if(updateErr)
    {
        res.json({ token : null, error : 'User could not be updated.' });
        return;
    }

    await deleteCode(user, code)
        .then(() => res.json({ token : createToken({ house : house }), error : '' }))
        .catch(() => res.json({ token : null, error : 'VerificationEntry could not be deleted.' }));
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

module.exports = { createHouse, sendJoinCode, join, updateHouse, deleteHouse };
