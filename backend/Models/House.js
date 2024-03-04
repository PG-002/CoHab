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
    chatMessages : {
        type : [{
            message : {
                type : String,
                required : [true, 'Message must contain a value.']
            },
            sentBy : {
                type : Schema.Types.ObjectId,
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
            date : {
                type : Schema.Types.Date,
                required : [true, 'Event must have a date.']
            },
            duration : {
                type : Number,
                required : [true, 'Event needs a duration.']
            },
            event_location : {
                type : String,
                required : [true, 'Event needs a location.']
            },
            longitude : {
                type : Number,
                required : [true, 'Longitude is required for this event.']
            },
            latitude : {
                type : Number,
                required : [true, 'Latitude is required for this event.']
            },
            whosGoing : {
                type : [{ type : String }],
                default : []
            }
        }],
        default : []
    },
    taskList : {
        type : [{ type : String }],
        default : []
    },
    rules : {
        type : [{ type : String }],
        default : []
    },
    groceryNeeded : {
        type : [{ type : String }],
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