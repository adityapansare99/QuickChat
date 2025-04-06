import mongoose, { Schema } from "mongoose";

const roomSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    username:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

const Room=mongoose.model('Room',roomSchema);

export {Room}