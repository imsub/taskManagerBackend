import { body, param } from "express-validator";
import { AvailableUserRoles } from "../utils/constants.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/api-error.js";
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
        throw new ApiError(500, "Either email or username must be provided.");
      }
      return true;
    }),
  ];
};
const updateProjectValidator = () => {
  return [
    body("_id").notEmpty().withMessage("Project ID is required"),
    body("name").optional().notEmpty().withMessage("Project name is required"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Project description is required"),
    body().custom((value) => {
      const { description, name } = value;
      if (!description && !name) {
        throw new ApiError(
          500,
          "Either Project description or name must be provided.",
        );
      }
      return true;
    }),
  ];
};

const deleteProjectValidator = () => {
  return [
    body("_id")
      .optional()
      .custom((value) => {
        const _id = Array.isArray(value) ? value : [value];
        if (_id.length === 0) {
          throw new ApiError(500, "Project ID(s) is required");
        }
        for (let id of _id) {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(500, `Invalid project ID: ${id}`);
          }
        }

        return true;
      }),
    body("name")
      .optional()
      .custom((value) => {
        const name = Array.isArray(value) ? value : [value];
        if (name.length === 0) {
          throw new ApiError(500, "Project name(s) is required");
        }
        for (let _name of name) {
          if (typeof _name !== "string") {
            throw new ApiError(500, `Invalid project name: ${_name}`);
          }
        }

        return true;
      }),
    body().custom((value) => {
      const { _id, name } = value;
      if (!_id && !name) {
        throw new ApiError(
          500,
          "Either Project ID or name must be provided to delete records.",
        );
      }
      if (
        Array.isArray(_id) &&
        Array.isArray(name) &&
        _id.length !== name.length
      ) {
        throw new ApiError(
          500,
          "Request Body has inconsistent data for Project ID and name as no of records does not match provided in array.",
        );
      }
      if (
        (!Array.isArray(_id) && Array.isArray(name)) ||
        (Array.isArray(_id) && !Array.isArray(name))
      ) {
        throw new ApiError(
          500,
          "Request Body has inconsistent data for Project ID and name as one param is in array and other one is string.",
        );
      }
      return true;
    }),
  ];
};
const projectMembersValidator = () => {
  return [
    param("projectId")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("project ID is required"),
  ];
};
const addProjectMembersValidator = () => {
  return [
    body("projectId")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("project ID is required"),
    body("userId")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("user ID is required"),
    body("role").trim().isString().notEmpty().withMessage("role is required"),
  ];
};
const removeProjectMembersValidator = () => {
  return [
    body("projectId")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("project ID is required"),
    body("userId")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("user ID is required")
  ];
};
const updateProjectMemberRoleValidator = () => {
  return [
    body("projectId")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("project ID is required"),
    body("userId")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("user ID is required"),
      body("role").trim().isString().notEmpty().withMessage("role is required")
  ];
};
export default {
  addMemberToProjectValidator,
  createProjectValidator,
  getProjectByIdValidator,
  getProjectsValidator,
  updateProjectValidator,
  deleteProjectValidator,
  projectMembersValidator,
  addProjectMembersValidator,
  removeProjectMembersValidator,
  updateProjectMemberRoleValidator
};
