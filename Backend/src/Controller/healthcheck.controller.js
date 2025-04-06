import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";

const healthcheck=asyncHandler(async(req,res)=>{
    res.status(200).json(new apiResponse(200,{},"Connected to Server"));
})

export {healthcheck}