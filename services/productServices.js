import Product from "../models/Product.js";

const findAllProducts = () => Product.find();

export default { findAllProducts };

