import Joi from "joi";
import { emailRegexp } from "../constants/regexp.js";

const signupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const updateSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(8).max(64),
  new_password: Joi.string().min(8).max(64),
  name: Joi.string().max(32),
});

const verifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export default {
  signupSchema,
  updateSchema,
  verifySchema,
  forgotPassword,
};