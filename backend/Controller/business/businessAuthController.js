import argon2 from "argon2";
import JWT from "jsonwebtoken";
import Business from "../../Models/business/Business.js";
import { getCollections } from "../../HelperFun/helperFun.js";

// Business Registration (Submit Request to SuperAdmin)
export const registerBusinessRequest = async (req, res) => {
    try {
        const { fullname, email, password, phonenumber, whatsappnumber, address, language, IDCard } = req.body;
        const { NRs } = getCollections(req);

        // Check if already requested or exists
        const existingReq = await NRs.findOne({ email });
        const existingBiz = await Business.findOne({ adminEmail: email });

        if (existingReq || existingBiz) {
            return res.json({ success: false, message: "Registration request already exists or email already registered" });
        }

        const newRequest = {
            fullname,
            email,
            password, // Storing plain for now as per existing pattern where Admin creates from it, but ideally hashed
            phonenumber,
            whatsappnumber,
            address,
            language,
            IDCard,
            catagory: "Business",
            type: "BUSINESS",
            status: "new_request",
            Verified: false,
            createdAt: new Date()
        };

        await NRs.insertOne(newRequest);
        res.json({ success: true, message: "Registration request submitted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// Business Login
export const businessLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const business = await Business.findOne({ adminEmail: email });

        if (!business) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (business.status === "Blocked") {
            return res.json({ success: false, message: "Your account is blocked. Contact support." });
        }

        const isMatch = await argon2.verify(business.adminPassword, password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = JWT.sign(
            { id: business._id, role: business.role },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("bus_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.json({
            success: true,
            message: "Login successful",
            business: {
                id: business._id,
                name: business.businessName,
                adminName: business.adminName
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const businessLogout = (req, res) => {
    res.clearCookie("bus_token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });
    res.json({ success: true, message: "Logged out successfully" });
};
