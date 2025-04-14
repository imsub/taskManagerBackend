import { Router } from "express";
import { authController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import { userValidation } from "../validators/index.js";
import {authMiddleware} from "../middlewares/index.js";

const router = Router();
router.route("/register").post(userValidation.userRegisterValidator(), validatorMiddleware.validate, authController.registerUser);
router.route("/login").get(userValidation.userLoginValidator(), validatorMiddleware.validate, authController.loginUser);
router.route("/logout").get(userValidation.userLogoutValidator(), validatorMiddleware.validate, authMiddleware.verifyJWTAccessToken,authController.logoutUser);
router.route("/verifyEmail/:token").post(validatorMiddleware.validateToken,authController.verifyEmail);
router.route("/resendEmailVerification").post(userValidation.verifyEmailvalidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken,authController.resendEmailVerification);
router.route("/verifyPasswordReset/:token").post(validatorMiddleware.validateToken,authController.forgotPasswordRequest);
router.route("/resetForgotPassword").post(userValidation.userLoginValidator(), validatorMiddleware.validate,authController.resetForgottenPassword);
router.route("/resetAccessToken").get(authMiddleware.verifyJWTRefreshToken,authController.refreshAccessToken);
router.route("/changeCurrentPassword").post(userValidation.userChangeCurrentPasswordValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken,authController.changeCurrentPassword);
router.route("/userProfile").get(userValidation.verifyEmailvalidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken,authController.getCurrentUser);
export default router;
