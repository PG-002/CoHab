const User = require('../Models/User');
const House = require('../Models/House');
const { hash, compare } = require('../Middleware/PasswordHash');
const { sendCode, getEntry, removeEntry } = require('../Middleware/Email');
const { createToken, verifyToken, decodeToken } = require('../Middleware/Token');

const retUserObj = user => ({
  userId : user._id,
  firstName : user.firstName,
  lastName : user.lastName,
  email : user.email,
  houseId : user.houseId,
  verified : user.verified,
  location : user.location,
  error : ''
});

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await hash(password);

  if(hashedPassword.error)
    res.json({ error : hashedPassword.error });
  else
  {
    await User.create({ firstName : firstName, lastName : lastName, email : email, password : hashedPassword.password })
      .then(user => {
        res.status(201);
        res.json({ token : createToken(retUserObj(user)) });
      })
      .catch(e => {
        res.status(404);
        res.json({error : e.code === 11000 ? 'An account with that email already exists.' : 'User could not be created.' });
      });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({ email : email })
    .then(async (user) => {
      if(!user)
      {
        res.status(404);
        res.json({ error : 'Invalid email.' });
        return;
      }

      const hashCompare = await compare(password, user.password);
      console.log(hashCompare.match);

      if(hashCompare.error)
        res.json({ error : hashCompare.error });
      else if(hashCompare.match)
      {
        res.status(201);
        res.json({ token : createToken(retUserObj(user)) });
      }
      else
        res.json({ error : 'Password does not match.' });
    })
    .catch(() => {
      res.status(404);
      res.json({ error : 'Error fetching user.' })
    });
};

const getUserInfo = async (req, res) => {
  const { id } = req.body;

  res.status(200);
  await User.findById(id)
    .then(user => res.json({ token : createToken(retUserObj(user)), error : '' }))
    .catch(() => res.json({ token : null, error : 'Could not find user.' }));
}

const getHouse = async (req, res) => {
  const { userId } = req.body;

  res.status(200);

  await User.findById(userId)
    .then(async user => {
      if(!user.houseId)
      {
        res.json({ token : null, error : 'User is not in a house.' });
        return;
      }

      const house = await House.findById(user.houseId)
        .catch(() => null);

      if(!house)
        res.json({ token : null, error : 'House does not exist.' });
      else
        res.json({ token : createToken({ house : house }), error : '' });
    })
    .catch(() => res.json({ token : null, error : 'User does not exist.' }));
}

const updateUser = async (req, res) => {
  const { id, fieldName, fieldValue } = req.body;

  res.status(200);
  await User.updateOne({ _id: id }, { [fieldName]: fieldValue })
    .then(() => res.json({ updated: true, error: '' }))
    .catch((err) => res.json({ updated: false, error: err }));
};

const updatePassword = async (req, res) => {
  const { email, password } = req.body;

  res.status(200);

  const hashedPassword = await hash(password);

  if (hashedPassword.error)
  {
    res.json({ error : hashedPassword.error });
  }
  else
  {
    await User.findOneAndUpdate({ email : email }, { password : hashedPassword.password })
      .then(() => {
        res.json({ changed : true, error : '' });
      })
      .catch(() => {
        res.json({ changed : false, error : 'The password could not be updated.' });
      });
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.body;
  const user = await User.findOne({ _id: id }).catch(() => null);

  if (!user) {
    res.status(200);
    res.json({ deleted: false, error: 'User does not exist.' });
    return;
  }

  const house = await House.findOne({ _id: user.houseId }).catch((err) => null);

  if (house)
    await House.updateOne(
      { _id: house._id },
      { members: house.members.filter((objID) => objID !== id) }
    );

  res.status(200);
  await User.deleteOne({ _id: id })
    .then(() => res.json({ deleted: true, error: '' }))
    .catch((err) => res.json({ deleted: false, error: err }));
};

const sendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email : email })
    .catch(() => null);

  res.status(200);

  if(!user)
    res.json({ sent: false, error: 'User with that email could not be found.' });
  else
    res.json(await sendCode(user, user.verified ? 'password change' : 'account'));
};

const verifyCode = async (req, res) => {

  const { email, code } = req.body;
  
  res.status(200);

  const user = await User.findOne({ email : email })
    .catch(() => null);

  if(!user)
  {
    res.json({ verified : false, token : null, error : 'User with that email could not be found.'});
    return;
  }

  const entries = await getEntry(user._id);

  if(!entries || entries.length === 0)
  {
    res.json({ verfified : false, token : null, error : 'User does not have any pending verification codes.' })
    return;
  }

  const entry = entries.find(e => e.code === code);

  if(!entry)
  {
    res.json({ verfified : false, token : null, error : 'The code is invalid.' })
    return;
  }

  await removeEntry(entry._id);

  if(entry.expDate < Date.now())
  {
    res.json({ verified : false, token : null, error : 'This code has expired.' });
    return;
  }

  if(entry.type === 'account')
  {
    const updated = await User.findByIdAndUpdate(user._id, { verified : true }, { new : true })
      .catch(() => null);

    if(!updated)
    {
      res.json({ verfified : false, token : null, error : 'Error updating the user.' });
      return;
    }
  }

  if(entry.type === 'account' || entry.type === 'password change')
  {
    res.json({ verified : true, token : null, error : '' });
    return;
  }

  if(entry.type !== 'invite')
  {
    res.json({ verified : false, token : null, error : 'Invalid VerfificationEntry type.' });
    return;
  }

  const house = await House.findById(entry.houseId)
    .catch(() => null);

  if(!house)
  {
    res.json({ verified : false, token : null, error : 'Invalid houseId.' });
    return;
  }

  const houseUpdated = await House.findByIdAndUpdate(house._id, { $push : { members : user.firstName + ' ' + user.lastName } }, { new : true })
    .catch(() => null);

  if(!houseUpdated)
  {
    res.json({ verified : false, token : null, error : 'Error updating the house.' });
    return;
  }

  await User.findByIdAndUpdate(user._id, { houseId : house._id })
    .then(() => res.json({ verified : true, token : createToken({ house : house }), error : '' }))
    .catch(() => res.json({ verfified : false, token : null, error : 'Error updating the user.' }));
}

const encode = async (req, res) => {
  res.status(200);
  res.json({ token : createToken(req.body) });
}

const decode = async (req, res) => {
  const { token } = req.body;
  console.log(req.body);
  if (await verifyToken(token))
  {
    res.status(200);
    const obj = decodeToken(token).payload;
    res.json(obj);
  }
  else
  {
    res.status(200);
    res.json({ err: 'Token could not be verified.' });
  }
};

module.exports = { signup, login, getUserInfo, getHouse, updateUser, updatePassword, deleteUser, sendVerification, verifyCode, encode, decode };