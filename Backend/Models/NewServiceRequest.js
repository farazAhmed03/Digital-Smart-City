import mongoose from "mongoose";

const NewServiceRequestSchema = new mongoose.Schema({

    fullname: String,
    email: String,
    whatsappnumber: String,
    AdminPassword: String,
    location: String,
    IDCard: String,
    type: String,
    language: String,
    phonenumber: String,
    catagory: String,
    newServiceDetails: {
        name: String,
        location: String,
        message: String
    },
    PaymentPlan: {
        type: String,
        default: null
    },
    source: {
        type: String,
        default: null
    },
    existingSectors: {
        type: [String],
        default: []
    },
    specialization: String,
    qualification: String,
    licenseNumber: String,
    yearsOfExperience: Number,
    hospitalAffiliation: String,
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    collection: "serviceProviderRequests"
});

export const NewServiceRequest =
    mongoose.model("NewServiceRequest", NewServiceRequestSchema);
