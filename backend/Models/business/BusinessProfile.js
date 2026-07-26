import mongoose from "mongoose";

const BusinessProfileSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    category: { type: String, required: true }, // Determined which public section the business appears in
    coverImage: { type: String, required: true },
    logo: { type: String, required: true },
    businessName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    about: { type: String, required: true },
    services: { type: String, default: "" }, // Changed to String for simple listing
    openingHours: { type: String, default: "" }, // Changed to String for flexible format
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String },
        location: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("BusinessProfile", BusinessProfileSchema, "businessprofiles");

