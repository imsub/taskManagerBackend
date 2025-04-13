import { Router } from "express";
import { authController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import { userValidation } from "../validators/index.js";
import {authMiddleware} from "../middlewares/index.js";

const router = Router();
router.route("/register").post(userValidation.userRegisterValidator(), validatorMiddleware.validate, authController.registerUser);
router.route("/login").get(userValidation.userLoginValidator(), validatorMiddleware.validate, authController.loginUser);
router.route("/logout").get(userValidation.userLogoutValidator(), validatorMiddleware.validate, authMiddleware.verifyJWTAcessToken,authController.logoutUser);
router.route("/verifyEmail/:token").post(validatorMiddleware.validateToken,authController.verifyEmail);
router.route("/resendEmailVerification").post(userValidation.verifyEmailvalidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAcessToken,authController.resendEmailVerification);
router.route("/resetPassword/:token").post(userValidation.verifyEmailvalidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAcessToken,authController.changeCurrentPassword);
router.route("/resetForgotPassword").post(userValidation.userLoginValidator(), validatorMiddleware.validate,authController.resetForgottenPassword);
// router.post("/verifyPasswordResetToken",validate(authValidation.token),authController.verifyPassowrdResetToken);
export default router;
