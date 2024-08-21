import ctrlWrapper from "../decorators/ctrlWrapper.js";

import pharmaciesServices from "../services/pharmaciesServices.js";

const { findPharmacies,findNearestPharmacies } = pharmaciesServices;



export async function getPharmaciesList(req, res) {
  
    const pharmaciesList = await findPharmacies();
    res.status(200).json(pharmaciesList);
  };


export async function getNearestPharmaciesList(req,res) {
    const nearestPharmaciesList = await findNearestPharmacies();
    res.status(200).json(nearestPharmaciesList);
}

  export default {
    getPharmaciesList:ctrlWrapper(getPharmaciesList),
    getNearestPharmaciesList: ctrlWrapper(getNearestPharmaciesList)
  };