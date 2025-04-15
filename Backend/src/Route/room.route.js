import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middelware.js";
import{createRoom, joinRoom, roomDetailsbyId, roomsByUser, deleteRoom} from "../Controller/room.controller.js"

const roomRoute=Router();

roomRoute.route("/createroom").post(verifyJWT,createRoom);
roomRoute.route("/joinroom").post(verifyJWT,joinRoom);
roomRoute.route("/roomdetailsbyid/:id").get(verifyJWT,roomDetailsbyId);
roomRoute.route("/roomsbyuser/:userId").get(verifyJWT,roomsByUser);
roomRoute.route("/deleteroom/:roomId").delete(verifyJWT,deleteRoom);

export{roomRoute}