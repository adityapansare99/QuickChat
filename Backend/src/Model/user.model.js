import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

//password hashing middlware
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
      return next();
    }

    this.password=await bcrypt.hash(this.password,10);
    next();
  })

//compare password
userSchema.methods.isCorrectPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

//generate accesstoken
userSchema.methods.generateAccessToken =async function(){
    return jwt.sign({
        _id:this._id,
        password:this.password,
        username:this.username,
        email:this.email
    },process.env.accesstoken,
    {expiresIn :process.env.accesstime})
}

userSchema.methods.generateRefreshToken =async function(){
    return jwt.sign({
        _id:this._id
    },process.env.refreshtoken,{expiresIn :process.env.refreshtime})
}

export {User}