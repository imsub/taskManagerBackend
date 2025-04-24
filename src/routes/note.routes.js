import { Router } from "express";
import { noteController } from "../controllers/index.js";
import { noteValidation } from "../validators/index.js";
import { validatorMiddleware, authMiddleware } from "../middlewares/index.js";

const notesRouter = Router();
const withValidationAndAuth = (validatorRule, controllerFn) => [
  validatorRule,
  validatorMiddleware.validate,
  authMiddleware.verifyJWTAccessToken,
  controllerFn,
];

notesRouter
  .route("/getNotes")
  .get(
    ...withValidationAndAuth(
      noteValidation.notesValidator(),
      noteController.getNotes,
    ),
  );
notesRouter
  .route("/getNote/:_id")
  .get(
    ...withValidationAndAuth(
      noteValidation.getNoteByIdValidator(),
      noteController.getNoteById,
    ),
  );
notesRouter
  .route("/addNotes")
  .post(
    ...withValidationAndAuth(
      noteValidation.createNotesValidator(),
      noteController.createNote,
    ),
  );
notesRouter
  .route("/updateNote")
  .patch(
    ...withValidationAndAuth(
      noteValidation.updateNotesValidator(),
      noteController.updateNote,
    ),
  );
  notesRouter
  .route("/removeNote/:_id")
  .delete(
    ...withValidationAndAuth(
      noteValidation.getNoteByIdValidator(),
      noteController.deleteNote,
    ),
  );
export default notesRouter;
