import Pharmacy from "../models/Pharmacy.js";
import NearestPharmacy from "../models/NearestPharmacy.js";

const findPharmacies = () => Pharmacy.find();

const findNearestPharmacies = () => NearestPharmacy.find();

export default { findPharmacies, findNearestPharmacies };
