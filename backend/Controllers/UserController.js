const User = require('../Models/User');
const House = require('../Models/House');
const { sendCode, verifyCode, deleteCode } = require('../Middleware/Email');
const { createToken, verifyToken, decodeToken } = require('../Middleware/Token');

const signup = async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    res.status(200);
    await User.create({ firstName : firstName, lastName : lastName, email : email, username : username, password : password })
        .then((user) => res.json({ token : createToken({user : user, error : '' }) }))
        .catch(() => res.json({ token : createToken({ user : null, error : 'User could not be created.' }) }));
}

const login = async (req, res) => {
    const {username, password } = req.body;

    const query = User.where({ username: username, password: password });
    const user = await query.findOne();

    if (user) {
        console.log(user)
        res.status(200);
        res.json({user : {
            id : user._id,
            firstname: user.firstName,
            lastname: user.lastName,
            email : user.email
        },
    });
    } else {
        res.status(404);
        res.json({error : 404});
    }
}

const updateUser = async (req, res) => {
    const { id, fieldName, fieldValue } = req.body;
    
    res.status(200);
    await User.updateOne({ _id : id }, { [fieldName] : fieldValue })
        .then(() => res.json({ updated : true, error : '' }))
        .catch(err => res.json({ updated : false, error: err }));
}

const deleteUser = async (req, res) => {
    const { id } = req.body;
    const user = await User.findOne({ _id : id }).catch(() => null);

    if(!user)
    {
        res.status(200);
        res.json({ deleted : false, error : 'User does not exist.' });
        return;
    }

    const house = await House.findOne({ _id : user.houseID }).catch(err => null);

    if(house)
        await House.updateOne({ _id : house._id }, { members : house.members.filter(objID => objID !== id) });

    res.status(200);
    await User.deleteOne({ _id : id })
        .then(() => res.json({ deleted : true, error : '' }))
        .catch(err => res.json({ deleted : false, error : err }));
}

const sendVerification = async (req, res) => {
    const { id, type } = req.body;
    const user = await User.findOne({ _id : id }).catch(() => null);

    res.status(200);

    if(!user)
        res.json({ sent : false, error : 'User not found.' });
    else
        res.json(await sendCode(user, type));
}

const verifyUser = async (req, res) => {
    const { id, code } = req.body;
    const user = await User.findOne({ _id : id });

    res.status(200);

    if(!user)
        res.json({ error : 'User could not be found.' });
    else
    {
        const verificationError = await verifyCode(user, code);
        if(verificationError)
            res.json({ verfied : false, error : verificationError });
        else
            res.json(deleteCode(user, code))
    }
}

const decode = async (req, res) => {
    const { token } = req.body;

    if(await verifyToken(token))
    {
        res.status(200);
        const obj = decodeToken(token).payload;
        res.json(obj);
    }
    else
    {
        res.status(200);
        res.json({err : 'Token could not be verified.'});
    }
}

module.exports = { signup, login, updateUser, deleteUser, sendVerification, verifyUser, decode };