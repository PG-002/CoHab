const User = require('../Models/User')
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

const login = () => {}

const decode = async (req, res) => {
    const { token } = req.body;

    if(await verifyToken(token))
    {
        res.status(200);
        const obj = decodeToken(token).payload.user;
        res.json(obj);
    }
    else
    {
        res.status(200);
        res.json({err : 'Token could not be verified.'});
    }
}


module.exports = { signup, login, decode };