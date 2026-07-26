import mongoose from "mongoose";

const PendingServiceRequestSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    whatsappnumber: String,
    AdminPassword: {
        type: String,
        required: true
    },
    location: String,
    IDCard: String,
    type: String,
    language: String,
    phonenumber: String,
    category: String,
    otpHash: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL Index
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "pendingServiceRequests"
});

export const PendingServiceRequest = mongoose.model("PendingServiceRequest", PendingServiceRequestSchema);
