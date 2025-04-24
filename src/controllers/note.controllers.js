import { ProjectNote, Project, ProjectMember, User } from "../models/index.js";
import { asyncHandler } from "../utils/async-handler.js";
import { status } from "http-status";
import { ApiError } from "../utils/api-error.js";

const getNotes = asyncHandler(async (req, res, next) => {
  const { projectId, userId } = req.body;
  let noOfParams = 0;
  if (userId) noOfParams++;
  if (projectId) noOfParams++;
  const isUserValid = !!userId && (await User.checkUserValidityById(userId));
  const isProjectValid =
    !!projectId && (await Project.checkProjectValidityById(projectId));
  if (isProjectValid || isUserValid) {
    const result = await ProjectNote.find({
      ...(!!projectId && { project: projectId }),
      ...(!!userId && { createdBy: userId }),
    });
    req.apiResponse = {
      statusCode: status.OK,
      data: result,
      message: "Success",
    };
    next();
  } else if (noOfParams === 1 && !isUserValid)
    throw new ApiError(status.SERVICE_UNAVAILABLE, "Invalid User ID");
  else if (noOfParams === 1 && !isProjectValid)
    throw new ApiError(status.SERVICE_UNAVAILABLE, "Invalid Project ID");
  else if (noOfParams === 2 && !isUserValid && !isProjectValid)
    throw new ApiError(status.SERVICE_UNAVAILABLE, "Invalid User & Project ID");
});

const getNoteById = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const result = await ProjectNote.findById(_id);
  req.apiResponse = {
    statusCode: status.OK,
    data: result,
    message: "Success",
  };
  next();
});

const createNote = asyncHandler(async (req, res, next) => {
  const { projectId, userId, content } = req.body;
  const isUserValid = !!userId && (await User.checkUserValidityById(userId));
  const isProjectValid =
    !!projectId && (await Project.checkProjectValidityById(projectId));
  if (!isUserValid && isProjectValid)
    throw new ApiError(status.SERVICE_UNAVAILABLE, "Invalid User ID");
  if (isUserValid && !isProjectValid)
    throw new ApiError(status.SERVICE_UNAVAILABLE, "Invalid Project ID");
  if (!isUserValid && !isProjectValid)
    throw new ApiError(status.SERVICE_UNAVAILABLE, "Invalid User & Project ID");
  const result = await ProjectNote.create({
    project: projectId,
    createdBy: userId,
    content,
  });
  req.apiResponse = {
    statusCode: status.OK,
    data: result,
    message: "Success",
  };
  next();
});

const updateNote = asyncHandler(async (req, res, next) => {
  const { _id, content } = req.body;
  const isNoteValid = await ProjectNote.findById(_id);
  if (!isNoteValid) {
    throw new ApiError(status.SERVICE_UNAVAILABLE, "Invalid note ID");
  }
  const result = await ProjectMember.updateOne({ _id }, { $set: { content } });
  req.apiResponse = {
    statusCode: status.OK,
    data: result,
    message: "Success",
  };
  next();
});

const deleteNote = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const result = await ProjectNote.deleteOne({_id});
  req.apiResponse = {
    statusCode: status.OK,
    data: { "No of records removed": result.deletedCount },
    message: "Success",
  };
  next();
});

export default { createNote, deleteNote, getNoteById, getNotes, updateNote };
