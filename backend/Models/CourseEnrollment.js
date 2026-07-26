import mongoose from "mongoose";

const CourseEnrollmentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    classMode: {
        type: String,
        enum: ["Online", "Physical"],
        default: "Online"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OnlineCourses",
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: false // Optional
    },
    paymentScreenshot: {
        type: String, // Cloudinary URL
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    rejectionReason: {
        type: String,
        required: function() {
            return this.status === "Rejected";
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "CourseEnrollments"
});

export const CourseEnrollments = mongoose.model("CourseEnrollments", CourseEnrollmentSchema);
