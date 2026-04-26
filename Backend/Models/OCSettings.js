import mongoose from "mongoose";

const OCSettingsSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: "Digital Smart Skills Hub" },
        tagline: { type: String, default: "Online & Physical Courses Available to Boost Your Career." },
        ctaText: { type: String, default: "Browse Courses" },
        backgroundImage: { type: String } // Cloudinary URL
    },
    feeInfo: {
        easyPaisaNumber: { type: String, default: "0348 9437142" },
        easyPaisaAccountHolder: { type: String, default: "Digital Kohat Official Team" },
        bankDetails: { type: String, default: "HBL - 1234 5678 9012 3456" },
        bankAccountHolder: { type: String, default: "Branch: Kohat Cantt Official" },
        instructions: { type: String, default: "Please upload your payment screenshot after transfer." }
    },
    registration: {
        successMessage: { type: String, default: "Application Verified! You have successfully submitted your interest." },
        isEnabled: { type: Boolean, default: true }
    },
    uiTexts: {
        viewDetailsBtn: { type: String, default: "View Details" },
        enrollNowBtn: { type: String, default: "Enroll Now" },
        courseCompletedBtn: { type: String, default: "Course Completed" },
        closedStatusText: { type: String, default: "Admissions Closed" }
    }
}, {
    timestamps: true,
    collection: "OCSettings"
});

export const OCSettings = mongoose.model("OCSettings", OCSettingsSchema);
