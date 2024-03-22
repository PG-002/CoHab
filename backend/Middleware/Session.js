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
        if(!verifyToken(token))
            return { error : 'Token could not be verified.' };

        const payload = decodeToken(token).payload;
        let sessionId = payload.sessionId;
        const userId = payload.userId;

        if(sessions[sessionId])
            return { sessionId : sessionId, user : sessions[sessionId].user, room : sessions[sessionId].room, error : '' };

        sessionId = Object.keys(sessions).find(id => sessions[id].user._id.toString() === userId);
        if(sessionId)
            return { sessionId : sessionId, user : sessions[sessionId].user, room : sessions[sessionId].room, error : '' };

        const user = await User.findOne({ _id : userId })
            .catch(() => null);

        if(!user)
            return { error : 'Could not fetch user.' };
        
        return { sessionId : createSession(user, user.houseID), user : user, room : user.houseID, error : '' };
    };

    const addEventListeners = socket => {
        require('../Listeners/GroupChat')(socket, io);
        require('../Listeners/Tasks')(socket, io);
        require('../Listeners/Rules')(socket, io);
        require('../Listeners/Groceries')(socket, io);
    };

    return { getSession, addEventListeners };
}