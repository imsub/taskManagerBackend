import { body, param } from "express-validator";

const notesValidator = () => {
  return [
    body("projectId")
      .optional({ values: "falsy" }) // Allows undefined, null, empty string, 0, false
      .trim()
      .isMongoId()
      .withMessage("Invalid project ID"),

    body("userId")
      .optional({ values: "falsy" })
      .trim()
      .isMongoId()
      .withMessage("Invalid user ID"),

    body().custom((value) => {
      const { projectId, userId } = value;
      if (!projectId && !userId) {
        throw new ApiError(400, "Either projectId or userId must be provided.");
      }
      return true;
    }),
  ];
};
const getNoteByIdValidator = () => {
  return [
    param("_id")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("project ID is required"),
  ];
};
const createNotesValidator = () => {
  return [
    body("projectId")
      .trim()
      .isMongoId()
      .notEmpty()
      .withMessage("project ID is required"),
    body("userId").trim().isMongoId().withMessage("user ID is required"),
    body("content")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("user ID is required"),
  ];
};
const updateNotesValidator = () => {
  return [
    body("_id").trim().isMongoId().withMessage("note ID is required"),
    body("content")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("user ID is required"),
  ];
};
export default {
  notesValidator,
  getNoteByIdValidator,
  createNotesValidator,
  updateNotesValidator,
};
