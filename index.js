import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";

dotenv.config();
const { PORT, DB_HOST } = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/user", authRouter);

app.use((err, req, res, next) => {
    const { status = 500, message = "Server error"} = err;
    res.status(status).json({message});
})

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
