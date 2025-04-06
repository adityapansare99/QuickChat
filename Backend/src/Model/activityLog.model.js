import mongoose, { Schema } from "mongoose";

const activityLogSchema=new Schema({
    loggedTime:{
        type:Date,
        required:true,
    },

    roomId:{
        type:Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },

    activeTime:{
        type:Date,
        required:true
    },

    lastSeenTime:{
        type:Date,
        required:true
    },

    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

const ActivityLog=mongoose.model('ActivityLog',activityLogSchema);

export {ActivityLog}