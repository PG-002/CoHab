const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName : {
        type : String,
        required : [true, 'First name is required.']
    },
    lastName : {
        type : String,
        required : [true, 'Last name is required.']
    },
    email : {
        type : String,
        unique : [true, 'This email is already in use.'],
        required : [true, 'Email is required.']
    },
    password : {
        type : String,
        required : [true, 'Password is required.']
    },
    houseID : {
        type : String,
        default : null,
        required : false
    },
    location : {
        lastUpdated : {
            type : Schema.Types.Date,
            default : Date.now(),
            required : [true, 'Must include the time the user\'s location was last updated.']
        },
        lattitude : {
            type : Number,
            default : 0,
            required : [true, 'Must include the user\'s lattitude.'] 
        },
        longitude : {
            type : Number,
            default : 0,
            required : [true, 'Must include the user\'s longitude.']
        },
        isTracking : {
            type : Boolean,
            default : true,
            required : [true, 'isTracking is required.']
        }
    }
}, { versionKey : false });

module.exports = user = mongoose.model('Users', UserSchema, 'Users');