import { DecodeTheToken } from "../HelperFun/helperFun.js";
export const AdminMW = (req, res, next) => {
    const token = req.cookies?.adm_token;
    if (!token) return res.json({ success: false, message: "Not authorized." });
    const decoded = DecodeTheToken(token);
    if (!decoded) {
        return res.json({ success: false, message: "Not authorized. Admin access required." });
    }
    req.token = decoded;
    next();
}