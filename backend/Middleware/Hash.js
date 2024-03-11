const bcrypt = require('bcrypt');
const saltRounds = 5;

const hash = async (password) => await bcrypt.hash(password, saltRounds)
    .then((hash) => ({ password : hash, error : '' }))
    .catch(() => ({ password : '', error : 'Failed to hash password.' }));

const compare = async (passoword, hash) => await bcrypt.compare(passoword, hash)
    .then(res => ({ match : res, error : '' }))
    .catch(() => ({ match : false, error : 'There was an error matching the password.' }));

module.exports = { hash, compare };