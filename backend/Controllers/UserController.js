const User = require('../Models/User');
const House = require('../Models/House');
const { hash, compare } = require('../Middleware/PasswordHash');
const { sendCode, verifyCode, deleteCode } = require('../Middleware/Email');
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
    .catch(() => res.json({ error : 'Error fetching user.' }));
};

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
  const { userId, password } = req.body;

  const hashedPassword = await hash(password);

  if (hashedPassword.error)
  {
    res.status(404);
    res.json({ error: hashedPassword.error });
  }
  else
  {
    await User.findOneAndUpdate({ _id : userId }, { password : hashedPassword.password })
      .then(() => {
        res.status(200);
        res.json({ changed : true, error : '' });
      })
      .catch((e) => {
        res.status(404);
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
  const { id } = req.body;
  const user = await User.findOne({ _id: id })
    .catch(() => null);

  res.status(200);
  if(!user)
    res.json({ sent: false, error: 'User not found.' });
  else
    res.json(await sendCode(user));
};

const verifyUser = async (req, res) => {
  const { id, code } = req.body;
  const user = await User.findOne({ _id : id })
    .catch(() => null);

  res.status(200);
  if(!user)
    res.json({ error: 'User could not be found.' });
  else
  {
    const verificationError = await verifyCode(user, code);
    if (verificationError)
      res.json({ verified: false, error: verificationError });
    else
      await deleteCode(user, code)
        .then(async (deleteRespose) =>
          await User.updateOne({ _id : user._id }, { verified : true, error : '' })
            .then(() => res.json(deleteRespose))
            .catch(() => res.json({ verified : false, error : 'Could not update user status.' })))
        .catch(() => res.json({ verified : false, error : 'VerificationEntry could not be deleted.' }));
  }
};

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

module.exports = { signup, login, getHouse, updateUser, updatePassword, deleteUser, sendVerification, verifyUser, encode, decode };
