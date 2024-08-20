import User from "../models/User.js";
import authServices from "../services/authServices.js";
import userServices from "../services/userServices.js";
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
  const user = await userServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const newUser = await authServices.signup({
    ...req.body,
    verificationToken,
  });

//   const verifyEmail = {
//     from: {
//       email: SENDGRID_FROM,
//       name: "Welcome to Water tracker",
//     },
//     personalizations: [
//       {
//         to: [{ email: email }],

//         dynamic_template_data: {
//           email: email,
//           BASE_URL: BASE_URL,
//           verificationToken: verificationToken,
//         },
//       },
//     ],
//     template_id: WELCOME_EMAIL,
//   };

//   await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await userServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await userServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );

//   res.redirect(
//     "https://julika-gulchitai.github.io/capybara-components-frontend/signin"
//   );
};

// const resendVerifyEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await userServices.findUser({ email });

//   if (!user) {
//     throw HttpError(404, "User not found");
//   }
//   if (user.verify) {
//     throw HttpError(400, "Verification has already been passed");
//   }

//   const verifyEmail = {
//     from: {
//       email: SENDGRID_FROM,
//       name: "Water tracker",
//     },
//     personalizations: [
//       {
//         to: [{ email: email }],

//         dynamic_template_data: {
//           email: email,
//           BASE_URL: BASE_URL,
//           verificationToken: verificationToken,
//         },
//       },
//     ],
//     template_id: TEMPLATE_ID,
//   };

//   await sendEmail(verifyEmail);

//   res.json({ message: "Verification email sent" });
// };

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email is wrong!");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified!");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password is wrong! Try again!");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

  await authServices.setToken(user._id, token);

  res.json({
    token,
    user: {
      email,
      username: user.username,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, username } = req.user;

  res.json({
    user: {
      email,
      username,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id);

  res.status(204).json({
    message: "You are logged out",
  });
};

const updateUser = async (req, res) => {
  const { _id: owner, password } = req.user;
  const { new_password, password: old_password, email } = req.body;
  const changedData = { ...req.body };

  if (old_password && new_password) {
    const user = await userServices.findUserById(owner);
    if (!user) {
      throw HttpError(404, "User not found!");
    }

    const passwordCompare = await bcrypt.compare(old_password, password);
    if (!passwordCompare) {
      throw HttpError(401, "Incorrect password!");
    }

    changedData.password = await bcrypt.hash(new_password, 8);
  }

  const user = await userServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email is already used");
  }

//   if (req.file) {
//     const { path: filePath } = req.file;
//     const webpPath = `${filePath.split(".")[0]}.webp`;
//     const image = await Jimp.read(filePath);
//     await image.cover(250, 250).write(filePath);
//     await webp.cwebp(filePath, webpPath, "-q 100");
//     let { url: photo } = await cloudinary.uploader.upload(webpPath, {
//       folder: "avatars",
//     });

//     photo = photo.replace("http", "https");

//     changedData.avatarURL = photo;
//     await unlink(filePath);
//     await unlink(webpPath);
//   }

  const newUser = await userServices.updateUser(owner, changedData);

//   if (req.file && newUser && avatarURL !== null) {
//     const avatar_id = avatarURL.split("/").pop().split(".")[0];
//     await cloudinary.uploader.destroy(`avatars/${avatar_id}`);
//   }

  res.status(201).json({
    user: {
      email: newUser.email,
      username: newUser.username,
    },
  });
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(404, "Please provide the valid email!");
  }
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found!");
  }

  const token = await ResetToken.findOne({ owner: user._id });
  if (token) {
    throw HttpError(
      404,
      "Only after one hour you can reques for new password!"
    );
  }

  const resetToken = new ResetToken({ owner: user._id, token: nanoid() });
  await resetToken.save();

//   const verifyEmail = {
//     from: {
//       email: SENDGRID_FROM,
//       name: "Forgot password",
//     },
//     personalizations: [
//       {
//         to: [{ email: email }],

//         dynamic_template_data: {
//           email: email,
//           id: user._id.toString(),
//           BASE_URL2: BASE_URL2,
//           token: resetToken.token,
//         },
//       },
//     ],
//     template_id: FORGOT_PASSWORD_EMAIL,
//   };

//   await sendEmail(verifyEmail);

  res.json({
    success: true,
    message: "Password reset link is sent to your email!",
  });
};

const resetPassword = async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw HttpError(404, "User not found!");
  }

  if (user.password === password) {
    throw HttpError(409, "Password must be different!");
  }

  if (password.trim().length < 8 || password.trim().length > 64) {
    throw HttpError(401, "Password must be 8 to 64 characters long!");
  }

  user.password = await bcrypt.hash(password, 8);
  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });

//   const verifyEmail = {
//     from: {
//       email: SENDGRID_FROM,

//       name: "You have requested to changed your password",
//     },
//     personalizations: [
//       {
//         to: [{ email: user.email }],

//         dynamic_template_data: {
//           email: user.email,
//         },
//       },
//     ],
//     template_id: CHANGED_PASSWORD_EMAIL,
//   };

//   await sendEmail(verifyEmail);

  res.json({
    success: true,
    message: "Password reset succesfully!",
  });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
//   resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
  forgotPassword: ctrlWrapper(forgotPassword),
  resetPassword: ctrlWrapper(resetPassword),
};