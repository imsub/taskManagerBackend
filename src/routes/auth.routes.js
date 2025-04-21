import { Router } from "express";
import { authController } from "../controllers/index.js";
import { validatorMiddleware , authMiddleware } from "../middlewares/index.js";
import { userValidation } from "../validators/index.js";

const authRouter = Router();
authRouter.route("/register").post(userValidation.userRegisterValidator(), validatorMiddleware.validate, authController.registerUser);
authRouter.route("/login").get(userValidation.userLoginValidator(), validatorMiddleware.validate, authController.loginUser);
authRouter.route("/logout").get(userValidation.userLogoutValidator(), validatorMiddleware.validate, authMiddleware.verifyJWTAccessToken,authController.logoutUser);
authRouter.route("/verifyEmail/:token").post(validatorMiddleware.validateToken,authController.verifyEmail);
authRouter.route("/resendEmailVerification").post(userValidation.verifyEmailvalidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken,authController.resendEmailVerification);
authRouter.route("/verifyPasswordReset/:token").post(validatorMiddleware.validateToken,authController.forgotPasswordRequest);
authRouter.route("/resetForgotPassword").post(userValidation.userLoginValidator(), validatorMiddleware.validate,authController.resetForgottenPassword);
authRouter.route("/resetAccessToken").get(authMiddleware.verifyJWTRefreshToken,authController.refreshAccessToken);
authRouter.route("/changeCurrentPassword").post(userValidation.userChangeCurrentPasswordValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken,authController.changeCurrentPassword);
authRouter.route("/userProfile").get(userValidation.verifyEmailvalidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken,authController.getCurrentUser);
export default authRouter;