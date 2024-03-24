const User = require('../Models/User');
const { verifyToken, decodeToken } = require('../Middleware/Token');

module.exports = io => {
    const sessions = {};
    
    const createSession = (user, room) => {
        const id = Date.now().toString(16);
        sessions[id] = { user : user, room : room };
        return id;
    };

    const getSession = async (token) => {
        // console.log('the token in getSession is ' + token);
        if (!token)
            return;
            

        if(!verifyToken(token))
        {
            console.log("The token was not verified");
            return { error : 'Token could not be verified.' };
        }
            
        const payload = decodeToken(token).payload;
        console.log(payload);
        const userId = payload.user._id;
        console.log('userId is ' + userId);

        const user = await User.findOne({ _id : userId })
            .catch(() => null);

        if(!user)
            return { error : 'Could not fetch user.' };
        
        return { user : user, room : user.houseID, error : '' };
    };

    const addEventListeners = socket => {
        require('../Listeners/GroupChat')(socket, io);
        require('../Listeners/Tasks')(socket, io);
    };

    return { getSession, addEventListeners };
}