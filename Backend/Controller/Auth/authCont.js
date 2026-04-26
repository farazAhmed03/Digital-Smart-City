import { ObjectId } from "mongodb";
import argon2 from "argon2";
import JWT from "jsonwebtoken";
import { getPublicIdFromUrl, selectCollection } from "../../HelperFun/helperFun.js";
import { Admins } from "../../Models/Admins.js";
import { Schools, Colleges } from "../../Models/Schl&ClgSchemeas.js";
import { Specialists, Pharmacies, Emergencies } from "../../Models/HealthModels.js";
import { sendOtpEmail } from "../../utils/sendOtpEmail.js";
import { Users } from "../../Models/User.js";
import { UserOtpVerifications } from "../../Models/UserOTPVerification.js";

export const getServiceModel = (type) => {
    const map = {
        SCHOOL: Schools,
        COLLEGE: Colleges,
        SPECIALIST: Specialists,
        PHARMACY: Pharmacies,
        EMERGENCY: Emergencies
    };

    return map[type] || null;
};

/* =========================================================
   SUPER ADMIN SETUP & AUTH
========================================================= */

export const createInitialSuperAdmin = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input types"
            });
        }

        const exists = await Admins.findOne({ role: "SUPER_ADMIN" });

        if (exists) {
            return res.status(403).json({
                success: false,
                message: "Super Admin already exists"
            });
        }

        const passwordHash = await argon2.hash(password);

        await Admins.create({
            AdminName: name.trim(),
            AdminEmail: email.toLowerCase().trim(),
            AdminPassword: passwordHash,
            role: "SUPER_ADMIN",
            Status: true,
            Verified: true
        });

        return res.status(201).json({
            success: true,
            message: "Super Admin created"
        });

    } catch (err) {

        console.error("createInitialSuperAdmin error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const SuperAdminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }
        const AdminColl = selectCollection(req, "Admins");

        /* =====================================================
           Fetch Super Admin Document
        ===================================================== */

        const superAdminDoc = await AdminColl.findOne({ role: "SUPER_ADMIN" });

        if (!superAdminDoc) {
            return res.status(500).json({
                success: false,
                message: "System error: Super Admin not configured"
            });
        }

        /* =====================================================
           SUPER ADMIN LOGIN
        ===================================================== */

        if (email === superAdminDoc.AdminEmail) {

            const isPasswordValid = await argon2.verify(superAdminDoc.AdminPassword, password);

            if (isPasswordValid) {

                const token = JWT.sign(
                    {
                        id: superAdminDoc._id,
                        role: "SUPER_ADMIN",
                        AccessTo: "All",
                        sessionVersion: Date.now()
                    },
                    process.env.JWT_KEY,
                    { expiresIn: "1d" }
                );

                res.cookie("adm_token", token, {
                    httpOnly: true,
                    secure: true,          // MUST be true for SameSite: None
                    sameSite: "None",      // Allows cross-site cookies between different domains
                    path: "/",
                    maxAge: 24 * 60 * 60 * 1000
                });

                return res.json({
                    success: true,
                    role: "SUPER_ADMIN",
                    AccessTo: "All",
                    message: "Super Admin login successful"
                });
            }
        }
        /* =====================================================
           MANAGER LOGIN
        ===================================================== */

        const manager = superAdminDoc.SAManagers?.find(
            m => m.email === email
        );

        if (manager) {

            const isPasswordValid = await argon2.verify(manager.password, password);

            if (isPasswordValid) {

                const token = JWT.sign(
                    {
                        id: superAdminDoc._id,
                        role: "SAManager",
                        AccessTo: manager.AccessTo,
                        sessionVersion: Date.now()
                    },
                    process.env.JWT_KEY,
                    { expiresIn: "1d" }
                );

                res.cookie("adm_token", token, {
                    httpOnly: true,
                    secure: true,          // MUST be true for SameSite: None
                    sameSite: "None",      // Allows cross-site cookies between different domains
                    path: "/",
                    maxAge: 24 * 60 * 60 * 1000
                });

                return res.json({
                    success: true,
                    role: "SAManager",
                    AccessTo: manager.AccessTo,
                    message: "Manager login successful"
                });
            }
        }

        /* =====================================================
           INVALID LOGIN
        ===================================================== */

        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const SuperAdminLogout = async (req, res) => {
    try {
        res.clearCookie("adm_token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
        });

        return res.json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const RetriveSuperAdminData = async (req, res) => {
    try {
        const superAdmin = await Admins.findOne({
            role: "SUPER_ADMIN"
        }).lean();

        if (!superAdmin) {
            return res.json({
                success: false,
                message: "Super admin not found"
            });
        }

        if (req.token.role === "SUPER_ADMIN") {

            return res.json({
                success: true,
                data: superAdmin,
                AccessTo: "All",
                SAMail: superAdmin.AdminEmail
            });
        }

        if (req.token.role === "SAManager") {
            return res.json({
                success: true,
                AccessTo: req.token.AccessTo
            });
        }

        return res.status(403).json({
            success: false,
            message: "Not authorized"
        });

    } catch (err) {

        console.error("Retrieve error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const CreateSAManager = async (req, res) => {

    try {

        /* =====================================================
           Authorization Layer ⭐
        ===================================================== */

        if (req.token.role !== "SUPER_ADMIN") {
            return res.json({
                success: false,
                message: "Not authorized."
            });
        }

        const { email, password, AccessTo } = req.body;

        if (!email || !password || !AccessTo) {
            return res.json({
                success: false,
                message: "email, password and AccessTo required."
            });
        }

        const lowerEmail = email.trim().toLowerCase();

        const AdminColl = selectCollection(req, "Admins");

        const adminId = new ObjectId(req.token.id);

        /* =====================================================
           Fetch Admin Document ⭐
        ===================================================== */

        const superAdmin = await AdminColl.findOne({
            _id: adminId
        });

        if (!superAdmin) {
            return res.json({
                success: false,
                message: "Invalid attempt."
            });
        }

        /* =====================================================
           Prevent Duplicate Manager Email ⭐
        ===================================================== */

        const managerExists = await AdminColl.findOne({
            "SAManagers.email": lowerEmail
        });

        if (managerExists) {
            return res.json({
                success: false,
                message: "Manager already exists.",

            });
        }

        /* =====================================================
           Create Manager Object ⭐
        ===================================================== */

        const managerObj = {
            email: lowerEmail,
            password: await argon2.hash(password),
            AccessTo,
            createdAt: new Date()
        };

        /* =====================================================
           Atomic Database Update ⭐
        ===================================================== */

        await AdminColl.updateOne(
            { _id: adminId },
            {
                $push: {
                    SAManagers: managerObj
                }
            }
        )

        return res.json({
            success: true,
            message: "Manager added successfully.",
            data: {
                AccessTo,
                email: lowerEmail
            }
        });

    } catch (error) {

        console.error("CreateSAManager error:", error);

        return res.json({
            success: false,
            message: "Something went wrong."
        });
    }
};

export const DeleteThSAManager = async (req, res) => {
    try {
        const role = req.token.role;
        if (role !== "SUPER_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const AdminColl = selectCollection(req, "Admins");
        const result = await AdminColl.updateOne(
            { _id: new ObjectId(req.token.id) },
            {
                $pull: {
                    SAManagers: { email: email }
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Operation completed successfully"
        });

    } catch (error) {
        console.error("DeleteThSAManager Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};




// Client


export const RequestRegisterOtp = async (req, res) => {
    try {

        const { fullName, email, phone, password, address, DOB } = req.body;

        if (!fullName || !email || !password || !address || !DOB) {
            return res.json({
                success: false,
                message: "All required fields must be filled."
            });
        }

        if (password.length < 6) {
            return res.json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }


        /* =====================================================
           🔥 Check Existing User
        ===================================================== */

        const existingEmail = await Users.findOne({
            email
        });

        if (existingEmail) {
            return res.json({
                success: false,
                message: "User already registered."
            });
        }

        if (phone) {

            const existingPhone = await Users.findOne({
                phone: phone.trim()
            });

            if (existingPhone) {
                return res.json({
                    success: false,
                    message: "Phone number already registered."
                });
            }
        }

        /* =====================================================
           🔥 Remove Previous OTP
        ===================================================== */

        await UserOtpVerifications.deleteOne({
            email,
            purpose: "REGISTER"
        });

        /* =====================================================
           🔥 Generate OTP
        ===================================================== */

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpHash = await argon2.hash(otp);
        const passwordHash = await argon2.hash(password);

        /* =====================================================
           🔥 Store OTP Record
        ===================================================== */

        await UserOtpVerifications.create({
            email,
            otpHash,
            purpose: "REGISTER",
            fullName: fullName.trim(),
            phone: phone ? phone.trim() : null,
            passwordHash,
            address: address.trim(),
            DOB,
            attempts: 0,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        /* =====================================================
           🔥 Send OTP Email
        ===================================================== */

        const emailSent = await sendOtpEmail(email, otp);

        if (!emailSent) {

            await UserOtpVerifications.deleteOne({
                email,
                purpose: "REGISTER"
            });

            return res.json({
                success: false,
                message: "OTP sending failed. Please try again."
            });
        }

        return res.json({
            success: true,
            message: "OTP sent to your email."
        });

    } catch (error) {

        console.error("RequestRegisterOtp error:", error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

export const VerifyRegisterOtp = async (req, res) => {
    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        const otpRecord = await UserOtpVerifications.findOne({
            email: email,
            purpose: "REGISTER"
        });

        if (!otpRecord) {
            return res.json({
                success: false,
                message: "OTP expired or not found."
            });
        }

        if (otpRecord.attempts >= 5) {

            await UserOtpVerifications.deleteOne({
                _id: otpRecord._id
            });

            return res.json({
                success: false,
                message: "Too many wrong attempts."
            });
        }

        const isValidOtp = await argon2.verify(
            otpRecord.otpHash,
            otp.toString()
        );

        if (!isValidOtp) {

            await UserOtpVerifications.updateOne(
                { _id: otpRecord._id },
                { $inc: { attempts: 1 } }
            );

            return res.json({
                success: false,
                message: "Invalid OTP."
            });
        }

        const existingEmail = await Users.findOne({
            email
        });

        if (existingEmail) {

            await UserOtpVerifications.deleteOne({
                _id: otpRecord._id
            });

            return res.json({
                success: false,
                message: "User already registered."
            });
        }

        const newUser = await Users.create({
            fullName: otpRecord.fullName,
            email: otpRecord.email,
            phone: otpRecord.phone,
            password: otpRecord.passwordHash,
            role: "user",
            address: otpRecord.address,
            DOB: otpRecord.DOB,
            isBlocked: false,
            isVerified: true
        });

        /* =====================================================
           🔥 Auto-Login Logic after Registration
        ===================================================== */
        const tokenPayload = {
            userId: newUser._id.toString(),
            role: newUser.role
        };

        const token = JWT.sign(
            tokenPayload,
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("user_token", token, {
            httpOnly: true,
            secure: true,          // MUST be true for SameSite: None
            sameSite: "None",      // Allows cross-site cookies between different domains
            maxAge: 24 * 60 * 60 * 1000
        });

        await UserOtpVerifications.deleteOne({
            _id: otpRecord._id
        });

        return res.json({
            success: true,
            message: "User registered and logged in successfully.",
            userId: newUser._id
        });

    } catch (error) {

        console.error("VerifyRegisterOtp error:", error);

        return res.json({
            success: false,
            message: "Something went wrong. try again",
        });
    }
}

export const LoginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        /* =====================================================
           1️⃣ Input Validation
        ===================================================== */

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const UserColl = selectCollection(req, "Users");

        /* =====================================================
           2️⃣ User Lookup (Case Safe)
        ===================================================== */

        const user = await UserColl.findOne({
            email
        });

        /* =====================================================
           4️⃣ Check Account Verification
        ===================================================== */

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or password."
            });
        }

        /* =====================================================
           5️⃣ Password Verification (Handles both user/admin fields)
        ===================================================== */
        const accountPassword = user.password || user.AdminPassword;

        if (!accountPassword) {
            return res.json({
                success: false,
                message: "Account configuration error."
            });
        }

        const isMatch = await argon2.verify(
            accountPassword,
            password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        /* =====================================================
           6️⃣ JWT Token Generation (Minimal Payload ⭐)
        ===================================================== */

        const tokenPayload = {
            userId: user._id.toString(),
            role: user.role
        };

        const token = JWT.sign(
            tokenPayload,
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        /* =====================================================
           7️⃣ Secure Cookie Configuration
        ===================================================== */

        res.cookie("user_token", token, {
            httpOnly: true,
            secure: true,          // MUST be true for SameSite: None
            sameSite: "None",      // Allows cross-site cookies between different domains
            maxAge: 24 * 60 * 60 * 1000
        });

        /* =====================================================
           8️⃣ Success Response (No Sensitive Data)
        ===================================================== */

        return res.status(200).json({
            success: true,
            message: "Login successful.",
        });

    } catch (error) {

        console.error("LoginUser error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

export const UserLogout = (req, res) => {
    res.clearCookie("user_token", {
        path: "/",
        sameSite: "None",
        secure: true,
        httpOnly: true
    });
    return res.status(200).json({
        success: true,
        message: "Logout successful."
    });
};

export const GetLoggedInUser = async (req, res) => {
    try {
        const UserColl = selectCollection(req, "Users");

        const user = await UserColl.findOne(
            { _id: new ObjectId(req.token.userId) },
            {
                projection: {
                    password: 0 // Never send password
                }
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error("GetLoggedInUser error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};
