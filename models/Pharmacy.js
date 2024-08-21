import { Schema, model } from "mongoose";

const PharmacySchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        default: 0,
      },
    },
  );
  

const Pharmacy = model("pharmacy", PharmacySchema);

export default Pharmacy;