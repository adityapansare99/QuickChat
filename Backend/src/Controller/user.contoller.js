import { User } from "../Model/user.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import {
  uploadoncloudinary,
  deletefromcloudinary,
} from "../Utils/cloudinary.js";

//register controller
const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if ([name, username, email, password].some((field) => field?.trim() === "")) {
    throw new apiError(404, "Username,Email,Name,Password Not Found");
  }

  const checkUserExits = await User.findOne({ $or: [{ username }, { email }] });

  if (checkUserExits) {
    throw new apiError(500, "User Already Exists");
  }

  const profilePic = req.file?.path;

  if (!profilePic) {
    throw new apiError(500, "Profile Picture not Uploaded");
  }

  let profileUrl;
  try {
    profileUrl = await uploadoncloudinary(profilePic);
  } catch (err) {
    throw new apiError(500, "Profile Picture Not Uploaded on Cloudinary");
  }

  try {
    const user = {
      name,
      username: username.toLowerCase(),
      email,
      password,
      profilePic: profileUrl?.url,
    };

    const nuser=await User.create(user);

    const userid = await User.findById(nuser._id).select(
      "-password -refreshtoken"
    );

    if (!userid) {
      throw new apiError(500, "Fail to Create User");
    }

    res
      .status(200)
      .json(new apiResponse(200, user, "User Created Successfully"));
  } catch (err) {
    if (profileUrl) {
      await deletefromcloudinary(profileUrl.public_id);
    }

    throw new apiError(500, "Unable to Register User");
  }
});

//GenerateTokens
const Generatingaccessandrefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError(500, "User not Found");
    }

    const accesstoken = user.generateAccessToken();
    const refereshtoken = user.generateRefreshToken();

    user.refreshToken = refereshtoken;

    await user.save({ validateBeforeSave: false });

    return { accesstoken, refereshtoken };
  } catch (err) {
    throw new apiError(500, "Not able to Generate the Tokens");
  }
};

//Login Controller
const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new apiError(500, "Fill the all Details");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new apiError(401, "User Not Found");
  }

  const checkPassword = await user.isCorrectPassword(password);

  if (!checkPassword) {
    throw new apiError(403, "Password Not Matched");
  }

  const { accesstoken, refereshtoken } = await Generatingaccessandrefreshtoken(
    user._id
  );

  const loggeduser = await User.findById(user._id);

  if (!loggeduser) {
    throw new apiError(500, "Fail to Login");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("AccessToken", accesstoken, options)
    .cookie("RefreshToken", refereshtoken, options)
    .json(new apiResponse(200, loggeduser, "Login Successfully"));
});

//Generate new Refreshtoken
const refereshtokenRegeneration = asyncHandler(async (req, res) => {
  const serversidetoken = req.cookies?.refereshtoken || req.body?.refereshtoken;

  if (!serversidetoken) {
    throw new apiError(500, "RefreshToken Not Found.Log in Again");
  }

  try {
    const decode = await jwt.verify(serversidetoken, process.env.refreshtoken);

    if (!decode) {
      throw new apiError(500, "Fail to Decode");
    }

    const user = await User.findOne(decode._id);

    if (!user) {
      throw new apiError(500, "User not Found");
    }

    if (user.refreshToken !== serversidetoken) {
      throw new apiError(500, "Token not Matched");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accesstoken, refereshtoken: newrefreshtoken } =
      await Generatingaccessandrefreshtoken(user._id);

    res
      .status(200)
      .cookie("AccessToken", accesstoken, options)
      .cookie("RefreshToken", newrefreshtoken, options)
      .json(
        new apiResponse(
          200,
          { accesstoken, refreshatoken: newrefreshtoken },
          "Automatically Token Generated"
        )
      );
  } catch (err) {
    throw new apiError(500, "Fail to Decode");
  }
});

//Logout Contoller
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refereshtoken", options)
    .json(new apiResponse(200, {}, "logged out successfully"));
});

//change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;

  if ([oldpassword, newpassword].some((field) => field?.trim() === "")) {
    throw new apiError(404, "fill all the details");
  }
  const user = await User.findById(req.user?._id);

  const comparepass = await user.isPasswordCorrect(oldpassword);

  if (!comparepass) {
    throw new apiError(404, "not matched password");
  }

  user.password = newpassword;

  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new apiResponse(200, {}, "password changed successfully"));
});

//get the current user
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(new apiResponse(200, user, "username got succefully"));
});

//updateaccountdetails email and fullname
const updateDetails = asyncHandler(async (req, res) => {
  const { fulllname, email } = req.body;

  if ([fulllname, email].some((field) => field?.trim() === "")) {
    throw new apiError(200, "fill all the details");
  }

  const updation = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fulllname,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refershtoken");

  return res
    .status(200)
    .json(new apiResponse(200, updation, "updated successfully"));
});

//update the avtar
const updateProfilePic = asyncHandler(async (req, res) => {
  const profilePic = req.file?.path;

  if (!profilePic) {
    throw new apiError(500, "file not found");
  }

  const response = await uploadoncloudinary(profilePic);

  if (!response.url) {
    throw new apiError(500, "avtar link not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePic: response.url,
      },
    },
    { new: true }
  ).select("-password -refershtoken");

  res.status(200).json(new apiResponse(200, user, "avatar updated"));
});

//Check Following to User and Followers
const userChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new apiError(500, "username not found");
  }

  const channel = User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "follower",
        as: "followers",
      },
    },

    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "following",
        as: "following",
      },
    },

    {
      $addFields: {
        subscribers: { $size: "$followers" },
        subscribed: { $size: "$following" },
        issubscribed: {
          $cond: {
            if: { $in: [req.user._id, "$followers.follower"] },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $project: {
        username: 1,
        fullname: 1,
        email: 1,
        avtar: 1,
        coverimage: 1,
        subscribers: { $size: "$follower" },
        subscribed: { $size: "$following" },
        issubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(500, "channel not found");
  }

  res.status(200).json(new apiResponse(200, channel[0], "channel profile"));
});

export {
  register,
  login,
  refereshtokenRegeneration,
  logout,
  changePassword,
  currentUser,
  updateDetails,
  updateProfilePic,
  userChannelProfile,
};
