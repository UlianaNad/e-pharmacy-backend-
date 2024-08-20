
import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      maxLength: 32,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      maxLength: 64,
      minLength: 6,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      maxLength: 14,
      minLength: 10,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);


const User = model("user", UserSchema);

export default User;