import { Router } from "express";
import { healthcheck } from "../Controller/healthcheck.controller.js";

const healthCheckRouter=Router();

healthCheckRouter.route("/").get(healthcheck);

export {healthCheckRouter}