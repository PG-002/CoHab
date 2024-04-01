const User = require('../Models/User');
const { verifyToken, decodeToken } = require('../Middleware/Token');

module.exports = io => {

    const auth = async (token) => {

        if (!token)
            return;

        if(!verifyToken(token))
        {
            console.log("The token was not verified");
            return { error : 'Token could not be verified.' };
        }
            
        const payload = decodeToken(token).payload;
        // console.log(payload);
        const userId = payload.user._id;
        console.log('userId is ' + userId);
        // const userId = payload.userId;

        const user = await User.findOne({ _id : userId })
            .catch(() => null);

        if(!user)
            return { error : 'Could not fetch user.' };

        return { user : user, room : user.houseId, error : '' };
    }

    const addEventListeners = socket => {
        require('../Listeners/GroupChat')(socket, io);
        require('../Listeners/Tasks')(socket, io);
        require('../Listeners/Rules')(socket, io);
        require('../Listeners/Groceries')(socket, io);
        require('../Listeners/Reminders')(socket, io);
        require('../Listeners/Events')(socket, io);
        require('../Listeners/Location')(socket, io);
    };

    return { auth, addEventListeners };
}