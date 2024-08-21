import express from "express";
import validateBody from "../decorators/validateBody.js";
import authControllers from "../controllers/authControllers.js";
import customerSchemas from "../schemas/customerSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import isResetTokenValid from "../middlewares/isResetTokenValid.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(customerSchemas.signupSchema),
  authControllers.register
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

// authRouter.post(
//   "/verify",
//   validateBody(customerSchemas.verifySchema),
//   authControllers.resendVerifyEmail
// );

authRouter.post(
  "/login",
  validateBody(customerSchemas.signupSchema),
  authControllers.login
);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.get("/current", authenticate, authControllers.getCurrent);

// authRouter.patch(
//   "/update",
//   authenticate,
//   upload.single("avatarURL"),
//   validateBody(usersSchemas.updateSchema),
//   authControllers.updateUser
// );

authRouter.post(
  "/forgot-password",
  validateBody(customerSchemas.forgotPassword),
  authControllers.forgotPassword
);

authRouter.post(
  "/reset-password",
  isResetTokenValid,
  authControllers.resetPassword
);

export default authRouter;
