import mongoose from "mongoose";

/* =========================================================
   🔹 Reusable Small Schemas
========================================================= */

const KeyValueSchema = new mongoose.Schema({
    key: { type: String, trim: true },
    value: { type: String, trim: true },
    label: { type: String, trim: true }
}, { _id: false });

/* =========================================================
   🔹 Basic Info
========================================================= */

const BasicInfoSchema = new mongoose.Schema({

    tagline: {
        type: String,
        trim: true,
        default: ""
    },

    about: {
        type: String,
        trim: true,
        default: ""
    },

    bannerUrl: {
        type: String,
        trim: true,
        default: ""
    },

    aboutImgUrl: {
        type: String,
        trim: true,
        default: ""
    }

}, { _id: false });

/* =========================================================
   🔹 Administration
========================================================= */

const AdministrationSchema = new mongoose.Schema({
    principal: { type: String, trim: true },
    vice_principal: { type: String, trim: true },
    managing_director: { type: String, trim: true },
    others: { type: [KeyValueSchema], default: [] }
}, { _id: false });

/* =========================================================
   🔹 Timings
========================================================= */

const TimingsSchema = new mongoose.Schema({
    opening: String,
    closing: String,
    break: String,
    office: String
}, { _id: false });

/* =========================================================
   🔹 Staff
========================================================= */

const StaffSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        default: ""
    }

}, { _id: true });

/* =========================================================
   🔹 Staff & Student
========================================================= */

const StaffAndStudentSchema = new mongoose.Schema({
    Total_Students: String,
    Total_Teachers: String,
    Qualification: String,
    Ratio: String,
    Medium: String,
    others: { type: [KeyValueSchema], default: [] }
}, { _id: false });

/* =========================================================
   🔹 Result & Performance
========================================================= */

const ResultAndPerformanceSchema = new mongoose.Schema({
    Pass_Precentage: String,
    Top_Achievers: String,
    Board_Result: String,
    MDCAT_Performance: String,
    others: { type: [KeyValueSchema], default: [] }
}, { _id: false });

/* =========================================================
   🔹 Events
========================================================= */

const EventSchema = new mongoose.Schema({
    title: String,
    catagory: String,
    location: String,
    time: String,
    Audience: String
}, { _id: true });

/* =========================================================
   🔹 Fee Structure
========================================================= */

const FeeSchema = new mongoose.Schema({
    Class: Number,
    MonthlyFee: Number,
    AnnualFee: Number,
    AdmissionFee: Number
}, { _id: true });

/* =========================================================
   🔹 Rating System
========================================================= */

const RatingSchema = new mongoose.Schema({

    totalStars: {
        type: Number,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    },

    average: {
        type: Number,
        default: 0
    },

    // userId → rating mapping
    userRatings: {
        type: Map,
        of: Number,
        default: {}
    }

}, { _id: false });

/* =========================================================
   🔹 Payment Gateway
========================================================= */

const PaymentGatewaySchema = new mongoose.Schema({
    easypaisa: {
        accountTitle: String,
        accountNumber: String
    },
    jazzcash: {
        accountTitle: String,
        accountNumber: String
    },
    bank: {
        bankName: String,
        accountTitle: String,
        accountNumber: String,
        iban: String
    }
}, { _id: false });

/* =========================================================
   🔥 MAIN SERVICE SCHEMA
========================================================= */

const ServiceSchema = new mongoose.Schema({

    /* ===============================
       🔹 Core Identity
    ================================ */

    ServiceName: { type: String, required: true, trim: true },

    AdminId: { type: String, required: true },

    // OLD + NEW compatibility
    Type: { type: String, trim: true },        // OLD
    ServiceType: { type: String, trim: true }, // NEW
    Address: { type: String, trim: true }, // NEW

    Status: { type: Boolean, default: true },

    /* ===============================
       🔹 Basic Info (Flat Structure)
    ================================ */

    basicInfo: { type: BasicInfoSchema, default: null },

    /* ===============================
       🔹 Subscription System
    ================================ */

    isActive: { type: Boolean, default: true },

    PaymentPlan: {
        type: String,
        enum: ["FREE", "BASIC", "PREMIUM", "ENTERPRISE"],
        default: "FREE"
    },

    PlanStartDate: { type: Date, default: Date.now },
    PlanExpiry: Date,

    /* ===============================
       🔹 Sections
    ================================ */

    administration: { type: AdministrationSchema, default: null },

    timings: { type: TimingsSchema, default: null },

    facilities: { type: [String], default: [] },

    staff: {
        type: [StaffSchema],
        default: []
    },

    StaffAndStudent: { type: StaffAndStudentSchema, default: null },

    ResultAndPerformance: { type: ResultAndPerformanceSchema, default: null },

    eventData: { type: [EventSchema], default: [] },

    extraActivities: {
        type: [String],
        default: []
    },

    feeData: { type: [FeeSchema], default: [] },

    gallery: { type: [String], default: [] },

    detailedReviews: {
        type: [new mongoose.Schema({
            userId: { type: String, default: null },
            name: { type: String, default: "Anonymous" },
            rating: { type: Number, required: true },
            comment: { type: String, default: "" },
            date: { type: Date, default: Date.now }
        }, { _id: true })],
        default: []
    },

    ratingData: { type: RatingSchema, default: null },

    paymentGateways: { type: PaymentGatewaySchema, default: null }

}, { timestamps: true });

/* =========================================================
   🔹 MODELS
========================================================= */

export const Schools = mongoose.model("Schools", ServiceSchema, "Schools");
export const Colleges = mongoose.model("Colleges", ServiceSchema, "Colleges");