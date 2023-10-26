import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req,res) => {
    res.send("Hello World");
};


// handling update User
export const updateUser = async (req, res, next) => {
    // If verifyUser gives the user i.e if the user is signed in and valid user then only allow
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"));

    // new:true makes sure that new data is updated in DB if not included old data will be added in DB
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true});

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json( rest );

    } catch (error) {
        next(error);
    }
};



// DELETE USER
export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account!"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        
        // once user is deleted delete the cookie also
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted!");
    } catch (error) {
        next(error);
    }
};


// GET USER LISTINGS
export const getUserListings = async (req, res, next) => {
    // allow only if loggedIn user is watching his own listings
    if (req.user.id === req.params.id){
        try {
            // find the listings where userRef is current loggedIn user's id
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json( listings );

        } catch (error) {
            next(error);
        }
    } else{
        return next(errorHandler(401, "You can only view your own listings!"));
    }
};