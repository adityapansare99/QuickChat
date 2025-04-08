import jwt from 'jsonwebtoken'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { apiError } from '../Utils/apiError.js';
import { User } from '../Model/user.model.js';

const verifyJWT=asyncHandler(async(req,_,next)=>{
    const token=req.cookies.accesstoken || req.header("Authorization") ?. replace("Bearer ","") || req.body.accesstoken ;

    if(!token){
        throw new apiError(401,"Token Not Found..");
    }

    try{
        const decodedToken=jwt.verify(token,process.env.accesstoken);

        if(!decodedToken){
            throw new apiError(403,"Token Not Decoded");
        }

        const user=await User.findById(decodedToken._id).select("-password -refreshtoken");

        if(!user){
            throw new apiError(401,"Invalid Token....")
        }


        req.user=user;

        next();
    }

    catch(err){
        console.log(`There is Error in decoding the token ${err}`);
        throw new apiError(500,"Token Not Decoded");
    }
})

export {verifyJWT}