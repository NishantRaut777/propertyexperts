import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing, deleteListing, getListing, updateListing, getListings } from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);

// get listings by query
router.get("/get", getListings);

export default router;