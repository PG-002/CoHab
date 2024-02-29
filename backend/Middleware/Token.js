const jwt = require('jsonwebtoken');

const createToken = (obj, expTime = '1m') => jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn : expTime });
const verifyToken = async (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, obj) => !err);
const decodeToken = (token) => jwt.decode(token, {complete : true});

module.exports = { createToken, verifyToken, decodeToken};