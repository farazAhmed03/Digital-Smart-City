import JWT from "jsonwebtoken";
import Business from "../../Models/business/Business.js";

export const businessAuth = async (req, res, next) => {
    try {
        const token = req.cookies.bus_token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token, authorization denied" });
        }

        const decoded = JWT.verify(token, process.env.JWT_KEY);
        req.business = decoded;

        const businessExists = await Business.findById(req.business.id);
        if (!businessExists || businessExists.status === "Blocked") {
            return res.status(403).json({ success: false, message: "Account is blocked or not found" });
        }

        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};
