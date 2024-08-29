import ctrlWrapper from "../decorators/ctrlWrapper.js";

import reviewsServices from "../services/reviewsServices.js";

const { findAllReviews } = reviewsServices;

export async function getReviewsList(req, res) {
    const reviewsList = await findAllReviews();
    res.status(200).json(reviewsList);
};

export default {
    getReviewsList: ctrlWrapper(getReviewsList),
};
