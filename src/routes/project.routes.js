import { Router } from "express";
import { projectController } from "../controllers/index.js";
import { projectValidation } from "../validators/index.js";
import { validatorMiddleware, authMiddleware } from "../middlewares/index.js";
export const projectRouter = Router();

const withValidationAndAuth = (validatorRule, controllerFn) => [
  validatorRule,
  validatorMiddleware.validate,
  authMiddleware.verifyJWTAccessToken,
  controllerFn,
];
projectRouter
  .route("/createProject")
  .post(
    ...withValidationAndAuth(
      projectValidation.createProjectValidator(),
      projectController.createProject,
    ),
  );
projectRouter
  .route("/getProject/:projectId")
  .get(
    ...withValidationAndAuth(
      projectValidation.getProjectByIdValidator(),
      projectController.getProjectById,
    ),
  );
projectRouter
  .route("/getProjects")
  .get(
    ...withValidationAndAuth(
      projectValidation.getProjectsValidator(),
      projectController.getProjects,
    ),
  );
projectRouter
  .route("/updateProject")
  .patch(
    ...withValidationAndAuth(
      projectValidation.updateProjectValidator(),
      projectController.updateProject,
    ),
  );
projectRouter
  .route("/deleteProject")
  .delete(
    ...withValidationAndAuth(
      projectValidation.deleteProjectValidator(),
      projectController.deleteProject,
    ),
  );
projectRouter
  .route("/getProjectMembers/:projectId")
  .get(
    ...withValidationAndAuth(
      projectValidation.projectMembersValidator(),
      projectController.getProjectMembers,
    ),
  );
projectRouter
  .route("/addProjectMembers")
  .put(
    ...withValidationAndAuth(
      projectValidation.addProjectMembersValidator(),
      projectController.addMemberToProject,
    ),
  );
projectRouter
  .route("/removeProjectMembers")
  .delete(
    ...withValidationAndAuth(
      projectValidation.removeProjectMembersValidator(),
      projectController.deleteMember,
    ),
  );
projectRouter
  .route("/updateProjectMembers")
  .patch(
    ...withValidationAndAuth(
      projectValidation.updateProjectMemberRoleValidator(),
      projectController.updateMemberRole,
    ),
  );
export default projectRouter;
