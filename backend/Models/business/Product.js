import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    productImage: { type: String, required: true },
    productName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", ProductSchema, "products");

