import { DecodeTheToken } from "../HelperFun/helperFun.js";

export const RoleMW = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.cookies.adm_token;
        if (!token) return res.json({ success: false, message: "Not authorized." });
        const decoded = DecodeTheToken(token);
        if (!decoded) return res.json({ success: false, message: "Not authorized." });
        req.token = decoded;
        next();
    };
};
