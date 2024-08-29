import Product from "../models/Product.js";
import Reviews from "../models/Reviews.js";

const findAllReviews = () => Reviews.find();

export default { findAllReviews };

