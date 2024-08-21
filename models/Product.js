import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
      suppliers: {
        type: String,
        required: true,
      },
      stock: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      category:{
        type: String,
        required: true,
      }

    },
  );
  

const Product = model("product", ProductSchema);

export default Product;