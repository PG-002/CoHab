const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
    email : {
        type : String,
        required : [true, 'Email is required.'],
        unique : [true, 'Email must be unique.']
    },
    code : {
        type : String,
        required : [true, 'Must have verification code.']
    }
}, { versionKey : false });

module.exports = userverification = mongoose.model('UserVerificationCodes', UserVerificationSchema, 'UserVerificationCodes');