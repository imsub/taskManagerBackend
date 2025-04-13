import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at lease 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Full name is required"),
  ];
};
const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("username").optional().isString().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body().custom((value) => {
      const { email, username } = value;
      if (!email && !username) {
        throw new Error("Either email or username must be provided.");
      }
      return true; // If validation passes, return true
    }),
  ];
};
const userLogoutValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("username").optional().isString().withMessage("Username is required"),
    body().custom((value) => {
      const { email, username } = value;
      if (!email && !username) {
        throw new Error("Either email or username must be provided.");
      }
      return true; // If validation passes, return true
    }),
  ];
};

const verifyEmailvalidator = () =>{
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("username").optional().isString().withMessage("Username is required"),
    body().custom((value) => {
      const { email, username } = value;
      if (!email && !username) {
        throw new Error("Either email or username must be provided.");
      }
      return true; // If validation passes, return true
    }),
  ];
}

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgottenPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

export default {
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userLoginValidator,
    userRegisterValidator,
    userResetForgottenPasswordValidator,
    userLogoutValidator,
    verifyEmailvalidator,
  };