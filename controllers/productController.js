import ctrlWrapper from "../decorators/ctrlWrapper.js";

import productServices from "../services/productServices.js";

const { findAllProducts } = productServices;

export async function getProductList(req, res) {
    const productList = await findAllProducts();
    res.status(200).json(productList);
};

export default {
    getProductList: ctrlWrapper(getProductList),
};


