
import { Schema, model } from "mongoose";

const ReviewsSchema = new Schema(
  {
    name: {
      type: String,
      maxLength: 32,
      default: null,
    },
    testimonial: {
      type: String,
      required: [true, "Review is required"],
    },
    
  }
);


const Reviews = model("reviews", ReviewsSchema);

export default Reviews;