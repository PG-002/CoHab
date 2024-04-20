const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HouseSchema = new Schema({
    houseName : {
        type : String,
        required : [true, 'House requires a name.']
    },
    members : {
        type : [{ type : Schema.Types.ObjectId }],
        default : []
    },
    statuses : {
        type : [{
            userId : {
                type : Schema.Types.ObjectId,
                required : [true, 'Must have userId.']
            },
            status : {
                type : String,
                required : [true, 'Must have status.']
            }
        }]
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
            email : {
                type : String,
                required : [true, 'Message must have attached email.']
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
            description : {
                type : String,
                required : false
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
        type : [{
            task : String,
            createdBy : String,
            assignedTo : String,
            completed : Boolean
        }],
        default : []
    },
    noiseLevel : {
        type : Number,
        default : 0
    }
}, { versionKey : false });

module.exports = house = mongoose.model('Houses', HouseSchema, 'Houses');