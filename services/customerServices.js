import Customer from "../models/Customer.js";

const findCustomer = (filter) => Customer.findOne(filter);

const findCustomerById = (id) => Customer.findById(id);

const updateCustomer = (id, data) => Customer.findByIdAndUpdate(id, data);

export default { findCustomer, findCustomerById, updateCustomer };