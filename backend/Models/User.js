const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName : {
        type : String,
        required : [true, 'First name is requried.']
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
    username : {
        type : String,
        unique : [true, 'A user with that username already exists.'],
        required : [true, 'Username is required.']
    },
    password : {
        type : String,
        required : [true, 'Password is required.']
    },
    houseID : {
        type : String,
        required : false
    },
    location : {
        lastUpdated : {
            type : Schema.Types.Date,
            required : [true, 'Must include the time the user\'s location was last updated.']
        },
        lattitude : {
            type : Number,
            required : [true, 'Must include the user\'s lattitude.'] 
        },
        longitude : {
            type : Number,
            required : [true, 'Must include the user\'s longitude.']
        },
        isTracking : {
            type : Boolean,
            required : [true, 'isTracking is required.']
        }
    }
}, { versionKey : false });

module.exports = user = mongoose.model('Users', UserSchema, 'Users');