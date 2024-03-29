const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HouseSchema = new Schema({
    houseName : {
        type : String,
        required : [true, 'House requires a name.']
    },
    amountOfUsers : {
        type : Number,
        default : 0
    },
    members : {
        type : [{ type : String }],
        default : []
    },
    reminders : {
        type : [{
            title : {
                type : String,
                required : [true, 'Reminder needs a title.']
            },
            date : {
                type : Schema.Types.Date,
                required : [true, 'Reminder needs a date.']
            }
         }],
        default : []
    },
    groupChat : {
        type : [{
            message : {
                type : String,
                required : [true, 'Message must contain a value.']
            },
            sentBy : {
                type : String,
                required : [true, 'Message must have an author.']
            },
            date : {
                type : Schema.Types.Date,
                required : [true, 'Date must be included with the message.']
            }
        }],
        default : []
    },
    events : {
        type : [{
            title : {
                type : String,
                required : [true, 'Event must have a title.']
            },
            start : {
                type : Schema.Types.Date,
                required : [true, 'Event must have a start date.']
            },
            end : {
                type : Schema.Types.Date,
                required : [true, 'Event must have a start date.']
            },
            allDay : {
                type : Boolean,
                required : [true, 'Must indicate if event is all day.']
            },
            createdBy: {
                type : Schema.Types.ObjectId,
                required : [true, 'Event must have author.']
            }
        }],
        default : []
    },
    tasks : {
        type : [{ id : String, task : String, completed : Boolean }],
        default : []
    },
    rules : {
        type : [{ id : String, rule : String }],
        default : []
    },
    groceryNeeded : {
        type : [{ id : String, item : String }],
        default : []
    },
    noiseLevel : {
        type : Number,
        default : 0
    },
    joinHouseCode : {
        type : String,
        required : [true, 'House code required.']
    }
}, { versionKey : false });

module.exports = house = mongoose.model('Houses', HouseSchema, 'Houses');