import mongoose, { mongo, Schema } from "mongoose";

const followSchema=new Schema({
    follower:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    following:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

const Follow=mongoose.model('Follow',followSchema);

export {Follow}