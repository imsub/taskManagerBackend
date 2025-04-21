import { Router } from "express";
import {noteController } from "../controllers/index.js";
const notesRouter = Router()

//notesRouter.route("/notes").get(userValidation.userRegisterValidator(), validatorMiddleware.validate, authController.registerUser);
export default notesRouter;