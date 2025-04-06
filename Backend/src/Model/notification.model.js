import mongoose, { Schema } from "mongoose";

const notificationschema=new Schema({
    status:{
        type:String, 
        default: "unread"
    },
    
    read:{
        type:Boolean,
        default: false
    },

    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    content:{
        type:Schema.Types.ObjectId,
        ref:"Message",
        required:true
    }
},
{timestamps:true})

const Notification=mongoose.model('Notification',notificationschema);

export {Notification}
