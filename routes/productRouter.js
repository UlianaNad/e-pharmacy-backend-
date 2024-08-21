import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", productController.getProductList);

export default productRouter;
