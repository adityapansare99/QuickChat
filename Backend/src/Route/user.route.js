import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middelware.js";
import {
  register,
  login,
  refereshtokenRegeneration,
  logout,
  changePassword,
  currentUser,
  updateDetails,
  updateProfilePic,
  userChannelProfile,
} from "../Controller/user.contoller.js";
import {upload} from "../middleware/multer.middleware.js"

const userRoute = Router();

userRoute.route("/register").post(
    upload.single("profilePic")
    ,register);

userRoute.route("/login").post(login);

userRoute.route("/refereshtokenregeneration").post(refereshtokenRegeneration);

userRoute.route("/logout").post(logout);

userRoute.route("/changepassword").post(verifyJWT,changePassword);

userRoute.route("/currentuser").get(verifyJWT,currentUser);

userRoute.route("/updatedetails").post(verifyJWT,updateDetails);

userRoute.route("/updateprofilepic").post(verifyJWT,upload.single("profilePic"),updateProfilePic);

userRoute.route("/userchannelprofile/:username").post(verifyJWT,userChannelProfile);

export {userRoute}
