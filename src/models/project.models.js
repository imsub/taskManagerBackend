import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
projectSchema.statics.checkProjectValidityById = async function (_id) {
  const data = await mongoose.model("Project",projectSchema).findById(_id);
  return !!data;
};
export const Project = mongoose.model("Project", projectSchema);
