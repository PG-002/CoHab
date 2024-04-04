const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerificationEntrySchema = new Schema({
    userId : {
        type : String,
        required : [true, 'User must be associated with this verification.']
    },
    type : {
        type : String,
        required : [true, 'Code must have a type.']
    },
    code : {
        type : String,
        required : [true, 'Must have verification code.']
    },
    houseId : {
        type : Schema.Types.ObjectId,
        default : null
    },
    expDate : {
        type : Schema.Types.Date,
        required : [true, 'An expiration date is required.']
    }
}, { versionKey : false });

module.exports = verificationEntry = mongoose.model('VerificationTable', VerificationEntrySchema, 'VerificationTable');