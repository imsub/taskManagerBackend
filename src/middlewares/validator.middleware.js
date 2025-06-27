import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    //no errors
    return next();
  }

  const extractedError = [];
  errors.array().map((err) =>
    extractedError.push({
      [err.path || "customValidator"]: err.msg,
    }),
  );

  throw new ApiError(500, extractedError);
};
const validateToken = (req, res, next) => {
  const { token } = req.params ?? req.body;
  const hexRegex = /^[0-9a-f]{40}$/i;
  hexRegex.test(token)
    ? next()
    : res.status(401).json({ error: "invalid token" });
};
export default { validate, validateToken };
