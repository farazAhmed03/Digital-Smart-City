import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    PatientName: {
        type: String,
        required: true
    },
    PatientEmail: {
        type: String,
        required: true
    },
    PatientPhone: {
        type: String,
        required: true
    },
    AppointmentDate: {
        type: Date,
        required: true
    },
    TimeSlot: {
        type: String, // e.g., "10:00 AM - 10:30 AM"
        required: true
    },
    ServiceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "HealthServices" // Generic reference
    },
    SpecialistId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admins"
    },
    Status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
        default: "Pending"
    },
    Problem: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

export const Appointments = mongoose.model("Appointments", AppointmentSchema);
