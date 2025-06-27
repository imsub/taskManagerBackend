import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/200x200.png`,
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    temporaryPassword:{
      type: String,
    },
    temporaryPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
/**
* Check if entered password matches the user's password
* @param {string} password
* @returns {Promise<boolean>}
*/

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  const data = await mongoose.model("User",userSchema).findOne({email:email});
  return !!data;
};
userSchema.statics.checkUserValidityById = async function (_id) {
  const data = await mongoose.model("User",userSchema).findById(_id);
  return !!data;
};
userSchema.statics.getUserByEmailOrUserName = async(obj) =>{
      const data =  await mongoose.model("User",userSchema).findOne(obj);
      return data;
}
userSchema.statics.isUserNameTaken = async function (username) {
  const data = await mongoose.model("User",userSchema).findOne({username:username});
  return !!data;
};

userSchema.methods.generateToken = function (tokenType) {
  
return tokenType.toUpperCase() === "TEMPORARY" ? this.generateTemporaryToken() : 
  jwt.sign(
    {
      ...(tokenType.toUpperCase() === "ACCESS" && { username: this.username }),
      ...(tokenType.toUpperCase() === "ACCESS" && { email: this.email }),
      _id : this._id ,
    },
    process.env[`${tokenType.toUpperCase()}_TOKEN_SECRET`],
    { expiresIn: process.env[`${tokenType.toUpperCase()}_TOKEN_EXPIRY`] },
  );
};

/**
 * @description Method responsible for generating tokens for email verification, password reset etc.
 */
userSchema.methods.generateTemporaryToken = function () {
  // This token should be client facing
  // for example: for email verification unHashedToken should go into the user's mail
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  // This should stay in the DB to compare at the time of verification
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  // This is the expiry time for the token (20 minutes)
  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes;

  return { unHashedToken, hashedToken, tokenExpiry };
};
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */
export const User = mongoose.model("User", userSchema);
