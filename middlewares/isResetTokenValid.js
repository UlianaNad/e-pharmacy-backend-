import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";
import Customer from "../models/Customer.js";
import ResetToken from "../models/ResetToken.js";

const isResetTokenValid = async (req, res, next) => {

  const {  token ,id} = req.body;
  if (!token || !id) {
    throw HttpError(404, "Invalid request!");
  }

  if (!isValidObjectId(id)) {
    throw HttpError(404, "Invalid user!");
  }

  const customer = await Customer.findById(id);
  if (!user) {
    throw HttpError(404, "User not found!");
  }

  const resetToken = await ResetToken.findOne({owner: customer._id});
  if(!resetToken){
    throw HttpError(404, "Reset token not found!");
  }

 
  if(resetToken.token !== token){
    throw HttpError(404, "Reset token in invalid!");
  }


  req.customer = customer;

  next()

};

export default isResetTokenValid;