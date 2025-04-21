import { Router } from "express";
import { projectController } from "../controllers/index.js";
import { projectValidation } from "../validators/index.js";
import { validatorMiddleware , authMiddleware } from "../middlewares/index.js";
export const projectRouter = Router()

projectRouter.route("/createProject").post(projectValidation.createProjectValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken, projectController.createProject);
projectRouter.route("/getProject/:projectId").get(projectValidation.getProjectByIdValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken, projectController.getProjectById);
projectRouter.route("/getProjects").get(projectValidation.getProjectsValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken, projectController.getProjects);
projectRouter.route("/updateProject").patch(projectValidation.updateProjectValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken, projectController.updateProject);
projectRouter.route("/deleteProject").delete(projectValidation.deleteProjectValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken, projectController.deleteProject);
projectRouter.route("/getProjectMembers/:projectId").get(projectValidation.projectMembersValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken, projectController.getProjectMembers);
//projectRouter.route("/getProjectMembers/:projectId").put(projectValidation.projectMembersValidator(), validatorMiddleware.validate,authMiddleware.verifyJWTAccessToken, projectController.getProjectMembers);

export default projectRouter;