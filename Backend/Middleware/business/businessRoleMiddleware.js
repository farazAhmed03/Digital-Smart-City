export const businessRole = (req, res, next) => {
    if (req.business && req.business.role === "BUSINESS_ADMIN") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Require Business Admin Role" });
    }
};
