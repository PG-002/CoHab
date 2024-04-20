const User = require('../Models/User');
const { verifyToken, decodeToken } = require('../Middleware/Token');

module.exports = (io) => {
  const auth = async (token) => {
    
    if(!token || !verifyToken(token))
      return { error : 'Token could not be verified.' };

    const payload = decodeToken(token).payload;
    const userId = payload.userId;

    const user = await User.findById({ _id : userId })
      .catch(() => null);

    if(!user)
      return { error : 'Could not fetch user.' };
    else if(!user.verified)
      return { error : 'User is not verified.' };
    else if(!user.houseId)
      return { error : 'User is not in a house.' };

    return { user : user, room : user.houseId, error : '' };
  };

  const addEventListeners = (socket) => {
    require('../Listeners/GroupChat')(socket, io);
    require('../Listeners/Tasks')(socket, io);
    require('../Listeners/Rules')(socket, io);
    require('../Listeners/Events')(socket, io);
    require('../Listeners/Location')(socket, io);
    require('../Listeners/NoiseLevel')(socket, io);
    require('../Listeners/StatusChange')(socket, io);
  };

  return { auth, addEventListeners };
};
