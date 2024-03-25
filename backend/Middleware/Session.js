const User = require('../Models/User');
const { verifyToken, decodeToken } = require('../Middleware/Token');

module.exports = io => {

    const auth = async (token) => {
        if(!verifyToken(token))
            return { error : 'Token could not be verified.' };

        const payload = decodeToken(token).payload;
        const userId = payload.userId;

        const user = await User.findOne({ _id : userId })
            .catch(() => null);

        if(!user)
            return { error : 'Could not fetch user.' };

        return { user : user, room : user.houseID, error : '' };
    }

    const addEventListeners = socket => {
        require('../Listeners/GroupChat')(socket, io);
        require('../Listeners/Tasks')(socket, io);
        require('../Listeners/Rules')(socket, io);
        require('../Listeners/Groceries')(socket, io);
        require('../Listeners/Reminders')(socket, io);
    };

    return { auth, addEventListeners };
}