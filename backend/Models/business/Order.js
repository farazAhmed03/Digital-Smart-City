import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    location: { type: String },
    notes: { type: String },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: { type: String },
        quantity: { type: Number, default: 1 },
        price: { type: Number }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Received", "Under Review", "Pending", "Approved", "On The Way", "Delivered", "Rejected", "Canceled", "Suspended"],
        default: "Received"
    },
    statusHistory: [{
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String, default: "system" }
    }],
    isReviewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }

});

export default mongoose.model("Order", OrderSchema);
