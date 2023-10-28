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


// GET LISTING BY ID
export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if(!listing) {
            return next(errorHandler(404, "Listing not found!"));
        }
        res.status(200).json(listing);

    } catch (error){
        next(error);
    }
};


// GET LISTINGS BY QUERY
export const getListings = async (req, res, next) => {
    try {
        // set limit value to the values passed else set it 9
        const limit = parseInt(req.query.limit) || 9;

        const startIndex =  parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;

        // if offer is undefined or false show listings both having offers and no offers
        if (offer === undefined || offer === "false"){
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === "false"){
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === "false"){
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        // if type is undefined or all then give listings having both sale and rent
        if (type === undefined || type === "all"){
            type = { $in: ["sale", "rent"] };
        }

        const searchTerm = req.query.searchTerm || "";

        const sort = req.query.sort || "createdAt";

        const order = req.query.order || "desc";

        // Search with above parameters
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: "i" },
            offer,
            furnished,
            parking,
            type
        }).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex);

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
};