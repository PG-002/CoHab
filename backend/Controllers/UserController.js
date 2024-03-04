const User = require('../Models/User');
const { sendVerificationCode, checkVerificationCode } = require('../Middleware/EmailVerification');
const { createToken, verifyToken, decodeToken } = require('../Middleware/Token');

const signup = async (req, res) => {
    const { firstname, lastname, email, username, password } = req.body;

    await User.create({
        firstname : firstname,
        lastname : lastname,
        email : email,
        username : username,
        password : password,
        houseID : null,
        location : {
            lastUpdated : Date.now(),
            lattitude : 0,
            longitude : 0,
            isTracking : false
        }
    }).then((user) => {
        res.status(200);
        res.json({ token : createToken({
            user : {
                id : user._id,
                firstname : user.firstname,
                lastname : user.lastname,
                email : user.email,
                error : ''
            },
        })});
    }).catch(error => {
        console.log(error);
        res.status(400);
        res.json({error : error});
    });
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

const emailVerificationCode = async (req, res) => {
    const { name, email } = req.body;

    let x = sendVerificationCode(name, email);

    res.status(200);
    res.json(x);
}

const validateVerificationCode = async (req, res) => {
    const { email, code } = req.body;

    res.status(200);
    res.json({msg : await checkVerificationCode(email, code)});
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


module.exports = { signup, login, emailVerificationCode, validateVerificationCode, decode };