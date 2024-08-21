import { Schema, model } from "mongoose";

const NearestPharmacySchema = new Schema(
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
  

const NearestPharmacy = model("nearest-pharmacy", NearestPharmacySchema);

export default NearestPharmacy;