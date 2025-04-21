import { body, param } from "express-validator";
import { AvailableUserRoles } from "../utils/constants.js";
const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};
const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRoles)
      .withMessage("Role is invalid"),
  ];
};
const getProjectByIdValidator = () => {
  return [
    param("projectId")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("project ID is required"),
  ];
};
const getProjectsValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .optional()
      .withMessage("Email is invalid"),
      body("username")
      .trim()
      .notEmpty()
      .optional()
      .withMessage("Username is required")
      .isLowercase(),
      body().custom((value) => {
        const { email, username } = value;
        if (!email && !username) {
          throw new Error("Either email or username must be provided.");
        }
        return true; // If validation passes, return true
      })
  ];
};
const updateProjectValidator = () => {
  return [
    body("_id").notEmpty().withMessage("Project ID is required"),
    body("name").optional().notEmpty().withMessage("Project name is required"),
    body("description").optional().notEmpty().withMessage("Project description is required"),
    body().custom((value) => {
      const { description, name } = value;
      if (!description && !name) {
        throw new Error("Either Project description or name must be provided.");
      }
      return true; // If validation passes, return true
    })
  ];
};
export default {
    addMemberToProjectValidator,
    createProjectValidator,
    getProjectByIdValidator,
    getProjectsValidator,
    updateProjectValidator
  };