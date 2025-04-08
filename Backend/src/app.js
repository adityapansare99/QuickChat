import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();

app.use(
    cors({
        origin:process.env.domain,
        credentials : true
    })
)

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//healthcheck router
import { healthCheckRouter } from "./Route/healthCheck.route.js";
app.use('/quickchat/api/v1/healthcheck',healthCheckRouter);

//user router
import {userRoute} from "./Route/user.route.js";
app.use('/quickchat/api/v1/user',userRoute);

export {app}