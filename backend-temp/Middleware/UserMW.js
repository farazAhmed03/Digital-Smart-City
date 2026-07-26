import { DecodeTheToken } from "../HelperFun/helperFun.js";

export const UserMW = (req, res, next) => {
    const token = req.cookies.user_token;

    if (!token) {
        return res.json({ success: false, message: "Not authorized." });
    }

    const decoded = DecodeTheToken(token);
    if (!decoded) {
        return res.json({ success: false, message: "Not authorized." });
    }

    req.token = decoded;
    next();
};