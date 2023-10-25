import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    // get access to access_token key from cookies
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        if (err) return next(errorHandler(403, "Forbidden"));

        // if it is successful assign current loggedIn user value to req.user and continue the process
        req.user = user;
        next();
    });
};