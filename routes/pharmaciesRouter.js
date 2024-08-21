import express from "express";
import pharmaciesController from "../controllers/pharmaciesControllers.js";

const pharmaciesRouter = express.Router();

pharmaciesRouter.get("/", pharmaciesController.getPharmaciesList);

pharmaciesRouter.get("/nearest", pharmaciesController.getNearestPharmaciesList)

export default pharmaciesRouter;
