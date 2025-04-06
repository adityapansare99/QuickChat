import mongoose, { Schema } from "mongoose";

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },

    username:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    profilePic:{
        type:String,
        required:true
    },

    refreshToken:{
        type:String
    },

    lastSeen:{
        type:Date,
        default:Date.now,
        required:true
    },

    onlineStatus:{
        type:Boolean,
        default:false,
        required:true
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema);

export {User}