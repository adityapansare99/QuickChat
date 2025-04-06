import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const uploadoncloudinary = async (filepath) => {
  if (!fs.existsSync(filepath)) {
    console.log("File Not Found: ", filepath);
  }

  try {
    if (!filepath) return null;

    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    console.log("Successfully Uploaded to Cloudinary " + response.url);

    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("File not Deleted from Local Storage", err);
      } else {
        console.log("File Deleted from Local Storage");
      }
    });

    return response;
  } catch (err) {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log("File not Deleted from Local Storage", err);
      } else {
        console.log("File Deleted from Local Storage");
      }
    });

    console.log("Upload to Cloudinary Failed ", err);
    return null;
  }
};

const deletefromcloudinary = async (id) => {
  try {
    const response = await cloudinary.uploader.destroy(id);
    console.log("delted successfully", response);
  } catch (err) {
    console.log("error in deleting the file", err);
    return null;
  }
};

export { uploadoncloudinary, deletefromcloudinary };
