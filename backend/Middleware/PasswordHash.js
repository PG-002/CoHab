const bcrypt = require('bcrypt');
const saltRounds = 5;

const hash = async (password) => {
    console.log('password in hash password is', password)
    return await bcrypt.hash(password, saltRounds)
    .then((hash) => ({ password : hash, error : '' }))
    .catch((e) => ({ password : '', error : 'Failed to hash password.', e : e }));}

const compare = async (password, hash) => await bcrypt.compare(password, hash)
    .then(res => ({ match : res, error : '' }))
    .catch(() => ({ match : false, error : 'There was an error matching the password.' }));

module.exports = { hash, compare };