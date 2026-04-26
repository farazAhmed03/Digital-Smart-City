import jwt from 'jsonwebtoken';

export const verifyCustomerToken = (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token, authorization denied for customer resource" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY || "fallback_secret_key");
        if (!decoded.customer) {
            return res.status(401).json({ success: false, message: "Token is not a valid customer token" });
        }
        req.customer = decoded.customer;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};
