import { asyncHandler } from "../utils/async-handler.js";
import { status } from "http-status";
import { Project, ProjectMember } from "../models/index.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

const getProjects = asyncHandler(async (req, res, next) => {
  const { email, username } = req.body;
  const { _id, email: _email, username: _username } = req.user;
  if (email !== email || username !== _username)
    throw new ApiError(status.ApiError, "Incorrect email or username");

  const projects = await Project.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(_id) },
    },
    {
      $lookup: {
        from: "projectmembers",
        localField: "_id",
        foreignField: "project",
        as: "members",
      },
    },
    {
      $unwind: "$members",
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        description: { $first: "$description" },
        createdBy: { $first: "$createdBy" },
        members: {
          $push: {
            role: "$members.role",
            user: "$members.user",
            createdBy: "$members.createdBy",
            createdAt: "$members.createdAt",
            updatedAt: "$members.updatedAt",
          },
        },
      },
    },
  ]);
  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data: projects,
    message: "Success",
  };
  next();
});

const getProjectById = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const members = await Project.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(projectId) },
    },
    {
      $lookup: {
        from: "projectmembers",
        localField: "_id",
        foreignField: "project",
        as: "members",
      },
    },
    {
      $unwind: "$members",
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        description: { $first: "$description" },
        createdBy: { $first: "$createdBy" },
        members: {
          $push: {
            role: "$members.role",
            user: "$members.user",
            createdBy: "$members.createdBy",
            createdAt: "$members.createdAt",
            updatedAt: "$members.updatedAt",
          },
        },
      },
    },
  ]);
  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data: members,
    message: "Success",
  };
  next();
});

const createProject = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const { _id } = req.user;
  const response = await Project.findOne({ name });
  if (response)
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Project name already exist.",
    );
  const session = await mongoose.startSession();
  req.session = session;
  await session.withTransaction(async () => {
    const [projectDoc] = await Project.create(
      [{ name, description, createdBy: _id }],
      { session },
    );
    await ProjectMember.create(
      [{ user: _id, role: "project_admin", project: projectDoc._id }],
      { session },
    );
  });
  req.apiResponse = {
    statusCode: status.CREATED,
    data: { success: true },
    message: "Project created successfully",
  };
  next();
});

const updateProject = asyncHandler(async (req, res, next) => {
  const { description, name, _id } = req.body;
  await Project.updateOne(
    { _id },
    {
      $set: {
        ...(!!description && { description }),
        ...(!!name && { name }),
      },
    },
  );
  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data: { success: true },
    message: "Project updated successfully",
  };
  next();
});

const deleteProject = asyncHandler(async (req, res, next) => {
  const { _id, name } = req.body;
  const data = {};
  let objectIds = Array.isArray(_id)
    ? _id.map((id) => new mongoose.Types.ObjectId(id))
    : !!_id
      ? [new mongoose.Types.ObjectId(_id)]
      : [];
  const projectName = Array.isArray(name) ? name : !!name ? [name] : [];
  const session = await mongoose.startSession();
  req.session = session;
  if (!objectIds.length && projectName.length)
    objectIds = (
      await Project.find({
        name: { $in: projectName },
      }).select("_id")
    ).map((doc) => doc._id);
  await session.withTransaction(async () => {
    const projectDeleteResult = await Project.deleteMany({
      ...(objectIds.length && { _id: { $in: objectIds } }),
      ...(projectName.length && { name: { $in: projectName } }),
    }).session(session);

    const memberDeleteResult = await ProjectMember.deleteMany({
      project: { $in: objectIds },
    }).session(session);
    data.projectDeleteResult = projectDeleteResult.deletedCount;
    data.membersDeleted = memberDeleteResult.deletedCount;
  });
  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data,
    message: "Project(s) deleted successfully",
  };
  next();
});

const getProjectMembers = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const members = await ProjectMember.aggregate([
    {
      $match: {
        ...(!!projectId && { project: new mongoose.Types.ObjectId(projectId) }),
      },
    },
    {
      $project: {
        _id: 1,
        user: 1,
        role: 1,
      },
    },
  ]);
  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data: members,
    message: "Success",
  };
  next();
});

const addMemberToProject = asyncHandler(async (req, res) => {
  // add member to project
});

const deleteMember = asyncHandler(async (req, res) => {
  // delete member from project
});

const updateMemberRole = asyncHandler(async (req, res) => {
  // update member role
});

export default {
  addMemberToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
};
