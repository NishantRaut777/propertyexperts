import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json( listing );

    } catch (error) {
        next(error);
    }
};


// DELETE LISTING
export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing){
        return next(errorHandler(404, "Listing not found!"));
    }

    // check if listing belongs to loggedIn user or not
    if (req.user.id !== listing.userRef){
        return next(errorHandler(401, "You can only delete your own listings!"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted");
    } catch (error) {
        next(error);
    }
};


// UPDATE LISTING
export const updateListing = async (req, res, next) => {
    // First check if listing exists or not
    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404, "Listing not found"));
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, "You can only update your own listings"));
    }

    try {
        const updatedListings = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListings);

    } catch (error) {
        next(error);
    }
};