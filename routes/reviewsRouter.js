import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", reviewsController.getReviewsList);

export default reviewsRouter;
