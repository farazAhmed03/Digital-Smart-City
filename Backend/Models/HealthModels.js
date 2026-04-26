import mongoose from "mongoose";

/* =========================================
   Reusable Schemas
========================================= */

const TimingSchema = new mongoose.Schema({
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
}, { _id: false });

const RatingSchema = new mongoose.Schema({
    average: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    userRatings: { type: Map, of: Number, default: {} } // Map of userId -> rating
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
    user: String,
    comment: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    duration: String,
    icon: String,
    isDefault: { type: Boolean, default: false },
    serviceKey: { type: String, default: null },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
});

const OrderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    whatsappNumber: String, // Added for wa.me integration
    email: String,
    prescriptionFile: String, // Cloudinary URL
    message: String,
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Cancelled"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

/* =========================================
   Specialist Schema
========================================= */

/* =========================================
   Specialist Schema
========================================= */

const SpecialistSchema = new mongoose.Schema({
    AdminId: { type: String, required: true },

    ServiceType: { type: String, enum: ["SPECIALIST", "PHARMACY"], default: "SPECIALIST" },

    basicInfo: {
        adminName: { type: String, required: true },
        img: { type: String, default: "" },
        serviceName: { type: String, default: "" },
        verified: { type: Boolean, default: true },
        specialization: { type: String, default: null },
        experience: { type: String, default: "0" },
        address: { type: String, default: "" },
        ratingData: { type: RatingSchema, default: {} }
    },

    about: {
        description: String,
        qualifications: String,
        yearsOfExperience: String,
        awards: [String]
    },

    Services: [ServiceSchema],

    education: [
        {
            degree: String,
            institution: String,
            year: String
        }
    ],

    Timings: { type: TimingSchema, default: {} },

    AvailableSlots: [String],

    Appointments: [
        {
            patientName: String,
            email: String,
            phone: String,
            whatsappNumber: String,
            date: String,
            time: String,
            message: String,
            consultationType: { type: String, enum: ["IN-CLINIC", "ONLINE"], default: "IN-CLINIC" },
            meetingLink: String,
            status: { type: String, enum: ["Pending", "Confirmed", "Rejected", "Completed"], default: "Pending" },
            appointmentNumber: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],

    detailedReviews: [ReviewSchema],

    ratingData: { type: RatingSchema, default: {} }, // Keep as fallback/backup

    About: String, // Keep for backward compatibility
    RatedIPs: { type: [String], default: [] },
    Status: { type: Boolean, default: true },

    /* Subscription */
    PaymentPlan: { type: String, enum: ["FREE", "BASIC", "PREMIUM", "ENTERPRISE"], default: "FREE" },
    SubscriptionStatus: { type: String, enum: ["Active", "Expired", "Suspended", "Trial"], default: "Active" },
    PlanStartDate: { type: Date, default: Date.now },
    PlanExpiry: Date
}, { timestamps: true });

/* =========================================
   PHARMACY RELATED Schema
========================================= */

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    price: String,
    stock: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" }
});

/* =========================================
   Pharmacy Schema
========================================= */

const PharmacySchema = new mongoose.Schema({
    AdminId: { type: String, required: true },

    ServiceType: { type: String, enum: ["SPECIALIST", "PHARMACY"], default: "PHARMACY" },

    basicInfo: {
        adminName: { type: String, required: true },
        serviceName: { type: String, required: true },
        img: { type: String, default: "" },
        verified: { type: Boolean, default: true },
        experience: { type: String, default: "0" },
        tagline: { type: String, default: "" },
        address: { type: String, default: "" },
        ratingData: { type: RatingSchema, default: {} }
    },

    // basicInfo: {
    //     serviceName: { type: String, required: true },
    //     pharmacyLogo: String,
    //     tagline: String,
    //     location: String,
    //     address: String,
    //     contactNumber: String,
    //     rating: { type: Number, default: 0 },
    //     status: { type: String, default: "Open" }
    // },

    about: {
        description: { type: String, default: "" },
        yearsOfService: { type: String, default: "" },
        ownerName: { type: String, default: "" },
        licenseNumber: { type: String, default: "" },
    },

    Medicines: [MedicineSchema],

    services: [ServiceSchema],

    Timings: { type: TimingSchema, default: {} },

    Orders: [OrderSchema],

    detailedReviews: [ReviewSchema],

    ratingData: { type: RatingSchema, default: {} },

    Gallery: [String], // Array of Cloudinary URLs

    RatedIPs: { type: [String], default: [] },
    Status: { type: Boolean, default: true },

    /* Subscription */
    PaymentPlan: { type: String, enum: ["FREE", "BASIC", "PREMIUM", "ENTERPRISE"], default: "FREE" },
    SubscriptionStatus: { type: String, enum: ["Active", "Expired", "Suspended", "Trial"], default: "Active" },
    PlanStartDate: { type: Date, default: Date.now },
    PlanExpiry: Date

}, { timestamps: true });

export const Pharmacies = mongoose.model("Pharmacies", PharmacySchema, "Pharmacies");
export const Specialists = mongoose.model("Specialists", SpecialistSchema, "Specialists");
export const Emergencies = mongoose.model("Emergencies", new mongoose.Schema({ serviceName: String, Status: Boolean }, { strict: false }), "Emergencies");