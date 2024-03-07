const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerificationEntrySchema = new Schema({
    type : {
        type : String,
        required : [true, 'Verficiation must have a type.']
    },
    userId : {
        type : String,
        required : [true, 'User must be associated with this verification.']
    },
    code : {
        type : String,
        required : [true, 'Must have verification code.']
    },
    expDate : {
        type : Schema.Types.Date,
        required : [true, 'An expiration date is required.']
    }
}, { versionKey : false });

module.exports = verificationEntry = mongoose.model('VerificationTable', VerificationEntrySchema, 'VerificationTable');