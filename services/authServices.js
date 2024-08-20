import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";

const signup = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 8);
  return Customer.create({ ...data, password: hashPassword });
};

const setToken = (id, token = "") => {
  return Customer.findByIdAndUpdate(id, { token });
};

export default { signup, setToken };