import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const proctectRoute = async (req, res, next) => {
    try {
        // Look for the "Authorization" header
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
          return res.status(401).json({ success: false, message: "JWT must be provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error(error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}