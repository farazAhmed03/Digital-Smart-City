import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    ServiceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    ServiceName: {
        type: String,
        required: true
    },

    ServiceType: {
        type: String,
        required: true
    },

    Sector: {
        type: String,
        enum: ["EDUCATION", "HEALTH", "FOOD"],
        required: false // Keep as false for backward compatibility, but we will populate it
    },

    ServiceStatus: {
        type: Boolean,
        required: true
    },
});

const AdminSchema = new mongoose.Schema({

    AdminName: {
        type: String,
        required: true
    },

    AdminEmail: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    },

    IDCard: String,

    location: String,

    whatsappnumber: String,
    phonenumber: String,

    AdminPassword: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "admin"
    },

    pastRole: {
        type: String,
        default: null
    },

    Verified: {
        type: Boolean,
        default: false
    },

    Status: Boolean,

    PaymentPlan: {
        type: String,
        enum: ["FREE", "BASIC", "PREMIUM", "ENTERPRISE"],
        default: "FREE"
    },

    PlanStartDate: { type: Date, default: Date.now },
    PlanExpiry: { type: Date, default: null },

    Services: [ServiceSchema],

    Managers: [Object],

    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    collection: "Accounts"
});

export const Admins = mongoose.model("Admins", AdminSchema);