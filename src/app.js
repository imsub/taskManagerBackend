import express from "express";
import cookieParser from 'cookie-parser';
import { apiResponse } from "./middlewares/response.middleware.js";
import healthCheckRouter from "./routes/healthcheck.routes.js"
import router from "./routes/index.js";
import {errorMiddleware} from "./middlewares/index.js";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public', {
    maxAge: '1d',         // Cache files for 1 day
    etag: false           // Disable ETag header if not needed
  }));
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1", router);
app.use(apiResponse);
app.use(errorMiddleware.errorHandler);
export default app;
