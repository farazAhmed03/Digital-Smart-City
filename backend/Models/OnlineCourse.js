import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    lessonTitle: {
        type: String,
        required: true
    },
    lessonType: {
        type: String,
        enum: ["Video", "PDF", "Text"],
        required: true
    },
    content: {
        type: String, // URL for Video/PDF, Text for Text type
        required: true
    }
});

const SectionSchema = new mongoose.Schema({
    sectionTitle: {
        type: String,
        required: true
    },
    lessons: [LessonSchema]
});

const OnlineCourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    fullDescription: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    image: {
        type: String, // Cloudinary URL
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["Online", "Physical"],
        default: "Online"
    },
    platform: {
        type: String, // Zoom, Google Meet, etc (for Online mode)
        required: false
    },
    address: {
        type: String, // Physical location (for Physical mode)
        required: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    whatYouWillLearn: {
        type: [String], // Array of points
        default: []
    },
    whoIsThisCourseFor: {
        type: String,
        required: false
    },
    skillsYouWillGain: {
        type: [String], // Tags
        default: []
    },
    status: {
        type: String,
        enum: ["Active", "Closed"],
        default: "Active"
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    whatsappGroupLink: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]+$/.test(v);
            },
            message: props => `${props.value} is not a valid WhatsApp invite link!`
        }
    },
    curriculum: [SectionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "OnlineCourses"
});

export const OnlineCourses = mongoose.model("OnlineCourses", OnlineCourseSchema);
