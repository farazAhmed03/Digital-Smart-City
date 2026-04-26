import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    adminEmail: { type: String, required: true, unique: true },
    adminPassword: { type: String, required: true },
    adminName: { type: String, required: true },
    ownerName: { type: String }, // For display in management table
    phone: { type: String, required: true },
    whatsapp: { type: String },
    idCard: { type: String, required: true },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ["new_request", "under_review", "pending", "approved", "rejected", "suspended"],
        default: "approved"
    },
    verified: { type: Boolean, default: true },
    role: { type: String, default: "BUSINESS_ADMIN" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Business", BusinessSchema, "businesses");

