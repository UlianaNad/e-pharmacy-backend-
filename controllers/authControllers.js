import Customer from "../models/Customer.js";
import authServices from "../services/authServices.js";
import customerServices from "../services/customerServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import Jimp from "jimp";
//import cloudinary from "../helpers/claudinary.js";
//import { unlink } from "fs/promises";
import { nanoid } from "nanoid";
//import sendEmail from "../helpers/sendEmail.js";
import ResetToken from "../models/ResetToken.js";
//import webp from "webp-converter";
import "dotenv/config";
import sendEmail from "../helpers/sendEmail.js";


const {
  JWT_SECRET,
  BASE_URL,
  WELCOME_EMAIL,
  SENDGRID_FROM,
  FORGOT_PASSWORD_EMAIL,
  CHANGED_PASSWORD_EMAIL,
  BASE_URL2,
} = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const customer = await customerServices.findCustomer({ email });
  if (customer) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const newCustomer = await authServices.signup({
    ...req.body,
    verificationToken,
  });

  const verifyEmail = {
    from: {
      email: SENDGRID_FROM,
      name: "Welcome to E-Pharmacy",
    },
    personalizations: [
      {
        to: [{ email: email }],

        dynamic_template_data: {
          email: email,
          BASE_URL: BASE_URL,
          verificationToken: verificationToken,
        },
      },
    ],
    template_id: WELCOME_EMAIL,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    customer: {
      email: newCustomer.email,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const customer = await customerServices.findCustomer({ verificationToken });

  if (!customer) {
    throw HttpError(404, "Customer not found");
  }

  await customerServices.updateCustomer(
    { _id: customer._id },
    { verify: true, verificationToken: "" }
  );

  res.redirect(
    `https://${BASE_URL}/`
  );
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await customerServices.findCustomer({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    from: {
      email: SENDGRID_FROM,
      name: "E-Pharmacy",
    },
    personalizations: [
      {
        to: [{ email: email }],

        dynamic_template_data: {
          email: email,
          BASE_URL: BASE_URL,
          verificationToken: verificationToken,
        },
      },
    ],
    template_id: TEMPLATE_ID,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const customer = await customerServices.findCustomer({ email });

  if (!customer) {
    throw HttpError(401, "Email is wrong!");
  }

  if (!customer.verify) {
    throw HttpError(401, "Email not verified!");
  }

  const passwordCompare = await bcrypt.compare(password, customer.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password is wrong! Try again!");
  }

  const payload = {
    id: customer._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

  await authServices.setToken(customer._id, token);

  res.json({
    token,
    customer: {
      email,
      name: customer.name,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, name } = req.customer;

  res.json({
    customer: {
      email,
      name,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.customer;
  await authServices.setToken(_id);

  res.status(204).json({
    message: "You are logged out",
  });
};

const updateCustomer = async (req, res) => {
  const { _id: owner, password } = req.customer;
  const { new_password, password: old_password, email } = req.body;
  const changedData = { ...req.body };

  if (old_password && new_password) {
    const customer = await customerServices.findCustomerById(owner);
    if (!customer) {
      throw HttpError(404, "Customer not found!");
    }

    const passwordCompare = await bcrypt.compare(old_password, password);
    if (!passwordCompare) {
      throw HttpError(401, "Incorrect password!");
    }

    changedData.password = await bcrypt.hash(new_password, 8);
  }

  const customer = await customerServices.findCustomer({ email });
  if (customer) {
    throw HttpError(409, "Email is already used");
  }

  const newCustomer = await customerServices.updateCustomer(owner, changedData);

  res.status(201).json({
    customer: {
      email: newCustomer.email,
      name: newCustomer.name,
    },
  });
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(404, "Please provide the valid email!");
  }
  const customer = await customerServices.findCustomer({ email });
  if (!customer) {
    throw HttpError(404, "Customer not found!");
  }

  const token = await ResetToken.findOne({ owner: customer._id });
  if (token) {
    throw HttpError(
      404,
      "Only after one hour you can reques for new password!"
    );
  }

  const resetToken = new ResetToken({ owner: customer._id, token: nanoid() });
  await resetToken.save();

  const verifyEmail = {
    from: {
      email: SENDGRID_FROM,
      name: "Forgot password",
    },
    personalizations: [
      {
        to: [{ email: email }],

        dynamic_template_data: {
          email: email,
          id: user._id.toString(),
          BASE_URL2: BASE_URL2,
          token: resetToken.token,
        },
      },
    ],
    template_id: FORGOT_PASSWORD_EMAIL,
  };

  await sendEmail(verifyEmail);

  res.json({
    success: true,
    message: "Password reset link is sent to your email!",
  });
};

const resetPassword = async (req, res) => {
  const { password } = req.body;

  const customer = await Customer.findById(req.customer._id);

  if (!customer) {
    throw HttpError(404, "Customer not found!");
  }

  if (customer.password === password) {
    throw HttpError(409, "Password must be different!");
  }

  if (password.trim().length < 8 || password.trim().length > 64) {
    throw HttpError(401, "Password must be 8 to 64 characters long!");
  }

  customer.password = await bcrypt.hash(password, 8);
  await customer.save();

  await ResetToken.findOneAndDelete({ owner: customer._id });

  const verifyEmail = {
    from: {
      email: SENDGRID_FROM,

      name: "You have requested to changed your password",
    },
    personalizations: [
      {
        to: [{ email: user.email }],

        dynamic_template_data: {
          email: user.email,
        },
      },
    ],
    template_id: CHANGED_PASSWORD_EMAIL,
  };

  await sendEmail(verifyEmail);

  res.json({
    success: true,
    message: "Password reset succesfully!",
  });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateCustomer: ctrlWrapper(updateCustomer),
  forgotPassword: ctrlWrapper(forgotPassword),
  resetPassword: ctrlWrapper(resetPassword),
};