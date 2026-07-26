import rateLimit from "express-rate-limit";

// General rate limiter for all requests
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for authentication endpoints (Login/Register)
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    message: { success: false, message: "Too many login attempts. Please try again after an hour." },
    standardHeaders: true,
    legacyHeaders: false,
});
