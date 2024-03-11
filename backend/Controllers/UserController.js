const User = require('../Models/User');
const House = require('../Models/House');
const { hash, compare } = require('../Middleware/Hash');
const { sendCode, verifyCode, deleteCode } = require('../Middleware/Email');
const { createToken, verifyToken, decodeToken } = require('../Middleware/Token');

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await hash(password);

    res.status(200);
    if(hashedPassword.error)
        res.json({ token : createToken({ user : null, error : hashedPassword.error }) })
    else
        await User.create({ firstName : firstName, lastName : lastName, email : email, password : hashedPassword.password })
            .then((user) => res.json({ token : createToken({user : user, error : '' }) }))
            .catch(() => res.json({ token : createToken({ user : null, error : 'User could not be created.' }) }));
}

const login = async (req, res) => {
    const { email, password } = req.body;

    res.status(200);
    await User.findOne({ email : email })
        .then(async user => {
            if(!user)
            {
                res.json({ token : createToken({ user : null, error : 'Invalid email.' }) });
                return;
            }

            const hashCompare = await compare(password, user.password);

            if(hashCompare.error)
                res.json({ token : createToken({ user : null, error : hashCompare.error }) });
            else if(hashCompare.match)
                res.json({ token : createToken({ user : user, error : '' }) });
            else
                res.json({ token : createToken({ user : null, error : 'Password does not match.' }) })
        })
        .catch(() => res.json({ token : createToken({ user : null, error : 'Error fetching user.' }) }));
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