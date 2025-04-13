import express from "express";
import healthCheck from "./healthcheck.routes.js";
import authRoute from "./auth.routes.js";
import noteRoute from "./note.routes.js";
import projectRoute from "./project.routes.js";
import taskRoute from "./task.routes.js";

const router = express.Router();

router.use("/auth",authRoute);
router.use("/auth",healthCheck);
router.use("/note",noteRoute);
router.use("/project",projectRoute);
router.use("/task",taskRoute);


export default router;
