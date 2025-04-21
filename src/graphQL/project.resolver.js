import { Project } from "../models/index.js";

const resolvers = {
  getUser: async ({ id }) => {
    try {
      const user = await Project.findById(id);
      return user;
    } catch (err) {
      throw new Error("Error retrieving user");
    }
  },
  getUsers: async () => {
    try {
      const users = await Project.find();
      return users;
    } catch (err) {
      throw new Error("Error retrieving users");
    }
  },
  createUser: async ({ name, email, password }) => {
    try {
      const user = new Project({ name, email, password });
      await user.save();
      return user;
    } catch (err) {
      throw new Error("Error creating user");
    }
  },
  updateUser: async ({ id, name, email, password }) => {
    try {
      const user = await Project.findByIdAndUpdate(
        id,
        { name, email, password },
        { new: true }
      );
      return user;
    } catch (err) {
      throw new Error("Error updating user");
    }
  },
  deleteUser: async ({ id }) => {
    try {
      const user = await Project.findByIdAndRemove(id);
      return user;
    } catch (err) {
      throw new Error("Error deleting user");
    }
  },
};

module.exports = resolvers;