import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    otpHash: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        required: true,
        enum: ["REGISTER", "LOGIN", "RESET_PASSWORD"]
    },

    fullName: String,

    phone: String,

    passwordHash: String,

    address: String,

    DOB: String,

    attempts: {
        type: Number,
        default: 0
    },

    expiresAt: {
        type: Date,
        required: true,
    }

}, {
    timestamps: true
});

/*
🔥 Auto delete expired OTP (MongoDB TTL Index)
*/

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const UserOtpVerifications =
    mongoose.model("UserOtpVerifications", OtpSchema);