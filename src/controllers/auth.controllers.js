import { asyncHandler } from "../utils/async-handler.js";
import { status } from "http-status";
import { User } from "../models/index.js";
import { ApiError } from "../utils/api-error.js";
import {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
} from "../utils/mail.js";
import crypto from "crypto";
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, username, password, fullName } = req.body;
  let response = await User.isEmailTaken(email);
  if (response) {
    throw new ApiError(status.INTERNAL_SERVER_ERROR, "Email already taken");
  }
  response = await User.isUserNameTaken(username);
  if (response) {
    throw new ApiError(status.INTERNAL_SERVER_ERROR, "Username already taken");
  }
  const user = new User({ email, username, password, fullName });
  const token = await user.generateTemporaryToken();
  user.emailVerificationToken = token.hashedToken;
  user.emailVerificationExpiry = token.tokenExpiry;
  await user.save();
  const mailContent = emailVerificationMailgenContent(
    fullName,
    `http://localhost:${process.env.PORT}/verifyEmail/${token.unHashedToken}`,
  );
  await sendEmail({
    email,
    subject: "Verify Email",
    mailgenContent: mailContent,
  });
  if (user) {
    req.apiResponse = {
      statusCode: status.CREATED,
      data: { username: user.username, success: true },
      message: "Success",
    };
    next();
  }
});
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  let response = null;
  if (!!email && !!username) {
    response = await User.getUserByEmailOrUserName({ email, username });
  } else if (!!email && !username) {
    response = email && (await User.getUserByEmailOrUserName({ email }));
  } else if (!!username && !email) {
    response = email && (await User.getUserByEmailOrUserName({ username }));
  }
  if (!response)
    throw new ApiError(
      status.UNAUTHORIZED,
      "User does not exist or invalid credentials",
    );
  const isPaswordCorrect = response
    ? await response.isPasswordCorrect(password)
    : false;
  if (!isPaswordCorrect)
    throw new ApiError(status.UNAUTHORIZED, "Incorrect Password");

  if (response && isPaswordCorrect) {
    const accessToken = await response.generateToken("access");
    const refreshToken = await response.generateToken("refresh");
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use true in production (HTTPS)
      sameSite: "Strict", // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use true in production (HTTPS)
      sameSite: "Strict", // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    req.apiResponse = {
      statusCode: status.ACCEPTED,
      data: { success: true },
      message: "Success",
    };
    next();
  }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const { email, username, _id } = req.user;
  const response = await User.getUserByEmailOrUserName({
    email,
    username,
    _id,
  });
  if (!!response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("jwt");
    req.apiResponse = {
      statusCode: status.ACCEPTED,
      data: { success: true },
      message: "Logged out successfully",
    };
    next();
  } else {
    throw new ApiError(status.UNAUTHORIZED, "Invalid token");
  }
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  //const { email, username ,_id} = req.user;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  //const response = await User.getUserByEmailOrUserName({email,username,_id,emailVerificationToken:hashedToken , emailVerificationExpiry: {  $gt:  new Date().toUTCString() } , isEmailVerified:false});
  const response = await User.getUserByEmailOrUserName({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: new Date().toUTCString() },
    isEmailVerified: false,
  });
  if (response) {
    response.isEmailVerified = true;
    response.emailVerificationToken = null;
    response.emailVerificationExpiry = new Date(0);
    await response.save();
    req.apiResponse = {
      statusCode: status.ACCEPTED,
      data: { success: true },
      message: "Email Verified Successfully",
    };
    next();
  } else {
    throw new ApiError(status.UNAUTHORIZED, "Invalid token");
  }

  //validation
});

const resendEmailVerification = asyncHandler(async (req, res, next) => {
  const { email, username } = req.body;
  if (email !== req.user.email || username !== req.user.username) {
    throw new ApiError(status.UNAUTHORIZED, "Invalid credential");
  }
  let response = null;
  if (!!email && !!username) {
    response = await User.getUserByEmailOrUserName({
      email,
      username,
      isEmailVerified: false,
    });
  } else if (!!email && !username) {
    response =
      email &&
      (await User.getUserByEmailOrUserName({ email, isEmailVerified: false }));
  } else if (!!username && !email) {
    response =
      email &&
      (await User.getUserByEmailOrUserName({
        username,
        isEmailVerified: false,
      }));
  }
  if (!response)
    throw new ApiError(
      status.UNAUTHORIZED,
      "User does not exist or invalid credentials",
    );
  const token = await response.generateTemporaryToken();
  response.emailVerificationToken = token.hashedToken;
  response.emailVerificationExpiry = token.tokenExpiry;
  await response.save();
  const mailContent = emailVerificationMailgenContent(
    response.fullName,
    `http://localhost:${process.env.PORT}/verifyEmail/${token.unHashedToken}`,
  );
  await sendEmail({
    email,
    subject: "Reverify Email",
    mailgenContent: mailContent,
  });
  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data: { success: true },
    message: "Email verification send",
  };
  next();
});
const resetForgottenPassword = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  let response = null;
  if (!!email && !!username) {
    response = await User.getUserByEmailOrUserName({ email, username });
  } else if (!!email && !username) {
    response = email && (await User.getUserByEmailOrUserName({ email }));
  } else if (!!username && !email) {
    response = email && (await User.getUserByEmailOrUserName({ username }));
  }
  if (!response)
    throw new ApiError(status.UNAUTHORIZED, "User does not exist.");

  const token = await response.generateToken("temporary");
  response.forgotPasswordToken = token.hashedToken;
  response.forgotPasswordExpiry = token.tokenExpiry;
  response.temporaryPassword = password;
  response.temporaryPasswordExpiry = token.tokenExpiry;
  await response.save();
  //const resetLink = `${process.env.CLIENT_URL}/reset-password/${response._id}/${token}`;
  const mailContent = forgotPasswordMailgenContent(
    response.fullName,
    `http://localhost:${process.env.PORT}/verifyResetPassword/${token.unHashedToken}`,
  );
  await sendEmail({
    email: response.email,
    subject: "Reset Password",
    mailgenContent: mailContent,
  });

  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data: { success: true },
    message: "Password reset link sent",
  };
  next();
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { email, username } = req.body;
  let response = null;
  if (!!email && !!username) {
    response = await User.getUserByEmailOrUserName({ email, username });
  } else if (!!email && !username) {
    response = email && (await User.getUserByEmailOrUserName({ email }));
  } else if (!!username && !email) {
    response = email && (await User.getUserByEmailOrUserName({ username }));
  }
  if (!response)
    throw new ApiError(status.UNAUTHORIZED, "User does not exist.");
  const [_accesstoken, _refreshToken] = [
    await response.generateToken("access"),
    await response.generateToken("refresh"),
  ];
  res.cookie("accessToken", _accesstoken, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === "production", // Use true in production (HTTPS)
    sameSite: "Strict", // Prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
  res.cookie("refreshToken", _refreshToken, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === "production", // Use true in production (HTTPS)
    sameSite: "Strict", // Prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
  req.apiResponse = {
    statusCode: status.ACCEPTED,
    data: { success: true },
    message: "Success",
  };
  next();
});

const forgotPasswordRequest = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const response = await User.getUserByEmailOrUserName({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: new Date().toUTCString() },
    temporaryPasswordExpiry: { $gt: new Date().toUTCString() },
  });
  if (!!response) {
    response.forgotPasswordToken = null;
    response.forgotPasswordExpiry = new Date(0);
    response.password = response.temporaryPassword;
    response.temporaryPassword = null;
    response.temporaryPasswordExpiry = new Date(0);
    await response.save();
    req.apiResponse = {
      statusCode: status.ACCEPTED,
      data: { success: true },
      message: "Password reset Successfully",
    };
    next();
  } else {
    throw new ApiError(status.UNAUTHORIZED, "Invalid token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { email, username, oldPassword, newPassword } = req.body;
  let response = null;
  if (!!email && !!username) {
    response = await User.getUserByEmailOrUserName({ email, username });
  } else if (!!email && !username) {
    response = email && (await User.getUserByEmailOrUserName({ email }));
  } else if (!!username && !email) {
    response = email && (await User.getUserByEmailOrUserName({ username }));
  }
  if (!response)
    throw new ApiError(
      status.UNAUTHORIZED,
      "User does not exist or invalid credentials",
    );
  const isPaswordCorrect = response
    ? await response.isPasswordCorrect(oldPassword)
    : false;
  if (!isPaswordCorrect)
    throw new ApiError(status.UNAUTHORIZED, "Incorrect Password");

  if (!!response && !!isPaswordCorrect) {
    response.password = newPassword;
    await response.save();
    req.apiResponse = {
      statusCode: status.ACCEPTED,
      data: { success: true },
      message: "Password changed",
    };
    next();
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
});

export default {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgottenPassword,
  verifyEmail,
};
