import {
  Task,
  SubTask,
} from "../models/index.js";
import { asyncHandler } from "../utils/async-handler.js";
import { status } from "http-status";
import { ApiError } from "../utils/api-error.js";

const getTasks = asyncHandler(async (req, res, next) => {
  //{title,description,project,assignedTo,assignedBy,status,attachments}
  const { title, projectId, assignedTo, assignedBy, status } = req.body;
  const result = await Task.find({
    ...(!!projectId && { project: projectId }),
    ...(!!assignedTo && { assignedTo }),
    ...(!!title && { title }),
    ...(!!assignedBy && { assignedBy }),
    ...(!!status && { status }),
  });
  req.apiResponse = {
    statusCode: status.OK,
    data: result,
    message: "Success",
  };
  next();
});


const getTaskById = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const result = await Task.findById(taskId);
  req.apiResponse = {
    statusCode: status.OK,
    data: result,
    message: "Success",
  };
  next();
});


const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, projectId, assignedTo, assignedBy, status , attachments} = req.body;
  const result = await Task.create({
    ...(!!projectId && { project: projectId }),
    ...(!!assignedTo && { assignedTo }),
    ...(!!title && { title }),
    ...(!!req?.user?._id && { assignedBy:req.user._id }),
    ...(!!status && { status }),
    ...(!!description && { description }),
    ...(!!attachments && { attachments }),
  });
  req.apiResponse = {
    statusCode: status.OK,
    data: result,
    message: "Success",
  };
  next();
});

// update task
const updateTask = asyncHandler(async (req, res, next) => {
  // update task
  const { title, description, projectId, assignedTo, assignedBy, status , attachments ,_id} = req.body;
  const result = await Task.create({
    ...(!!projectId && { project: projectId }),
    ...(!!assignedTo && { assignedTo }),
    ...(!!title && { title }),
    ...(!!req?.user?._id && { assignedBy:req.user._id }),
    ...(!!status && { status }),
    ...(!!description && { description }),
    ...(!!attachments && { attachments }),
  });
  req.apiResponse = {
    statusCode: status.OK,
    data: result,
    message: "Success",
  };
  next();
});

// delete task
const deleteTask = asyncHandler(async (req, res, next) => {
  // delete task
});

// create subtask
const createSubTask = asyncHandler(async (req, res, next) => {
  // create subtask
});

// update subtask
const updateSubTask = asyncHandler(async (req, res, next) => {
  // update subtask
});

// delete subtask
const deleteSubTask = asyncHandler(async (req, res, next) => {
  // delete subtask
});

export {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
