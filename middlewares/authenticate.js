import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import customerServices from "../services/customerServices.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, _, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const customer = await customerServices.findUCustomerById(id);
    if (!customer || !customer.token) {
      return next(HttpError(401, "Not authorized"));
    }
    req.customer = customer;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;