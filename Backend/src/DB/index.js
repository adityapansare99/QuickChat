import { DbName } from "../constant.js";
import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const response=await mongoose.connect(`${process.env.dblink}${DbName}`);
        console.log("Connected to DataBase "+response.connection.host);
    }

    catch(err){
        console.log("Unable to connect DataBase");
        process.exit(1);
    }
}

export{connectDB};