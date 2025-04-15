import { Room } from "../Model/room.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";

//create a room
const createRoom = asyncHandler(async (req, res) => {
  const { username, name, password } = req.body;

  if ([username, name, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "Fill all details");
  }

  const existingroom = await Room.findOne({
    $or:[
        {username},{name}
    ]
  });

  if (existingroom) {
    throw new apiError(409, "Use Different Username and Name");
  }

  const room = await Room.create({
    username,
    name,
    password,
  });

  if (!room) {
    throw new apiError(500, "Unable to Create a Room");
  }

  const roomId = await Room.findById(room._id);

  if (!roomId) {
    throw new apiError(500, "Room Id Not Found");
  }

  res.status(200).json(new apiResponse(200, room, "Room Created Successfully"));
});

//join room
const joinRoom=asyncHandler(async(req,res)=>{
    const {name,password}=req.body;
    
    if([name,password].some((field)=>field?.trim()==="")){
        throw new apiError(400,"Enter Username and Password");
    }

    const checkroom=await Room.findOne({name});

    if(!checkroom){
        throw new apiError(400,"Room not Found");
    }

    if(checkroom.password!==password){
        throw new apiError(400,"Wrong Password");
    }

    res.status(200).json(new apiResponse(200,checkroom,"Entered in Room"));
})

const roomDetailsbyId=asyncHandler(async(req,res)=>{
    const {id}=req.params;

    if(!id){
        throw new apiError(400,"Id not Found");
    }

    const room=await Room.findById(id);

    if(!room){
        throw new apiError(400,"Room Not Found");
    }

    res.status(200).json(new apiResponse(200,room,"Room Found Successfully"));
})

//get all rooms of the user
const roomsByUser=asyncHandler(async(req,res)=>{
    const {userId}=req.params;

    if(!userId){
        throw new apiError(400,"User Id Not Found");
    }

    const rooms=await Room.find({owner:userId});

    if(!rooms){
        throw new apiError(400,"Rooms Not Found");
    }   

    res.status(200).json(new apiResponse(200,rooms,"Rooms Found Successfully"));
})

//delete room by id
const deleteRoom=asyncHandler(async(req,res)=>{
    const {roomId}=req.params;

    if(!roomId?.trim()){
        throw new apiError(400,"Room Not Found");
    }

    const deleteroom=await Room.findByIdAndDelete(roomId);

    if(!deleteroom){
        throw new apiError(400,"Unable to Delete Room");
    }

    res.status(200).json(200,deleteRoom,"Room Deleted Successfully");
})

export { createRoom, joinRoom, roomDetailsbyId, roomsByUser, deleteRoom };
