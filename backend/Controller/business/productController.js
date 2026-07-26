import Product from "../../Models/business/Product.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { deleteImage } from "../../utils/cloudinaryCleanup.js";


export const addProduct = async (req, res) => {
    try {
        const businessId = req.business.id;
        const { name, description, price } = req.body;
        let imageUrl = "";

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file, "products");
            imageUrl = uploadResult.secure_url;
        } else {
            imageUrl = req.body.image; // fallback for legacy or if still passing URL
        }

        const product = new Product({
            businessId,
            productImage: imageUrl,
            productName: name,
            shortDescription: description,
            price
        });


        await product.save();
        res.json({ success: true, message: "Product added successfully", data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        const businessId = req.business.id;
        const products = await Product.find({ businessId });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const businessId = req.business.id;
        const updateData = req.body;

        const product = await Product.findOne({ _id: productId, businessId });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let imageUrl = product.productImage;
        if (req.file) {
            // Delete old image if it exists
            if (product.productImage) await deleteImage(product.productImage);

            const uploadResult = await uploadToCloudinary(req.file, "products");
            imageUrl = uploadResult.secure_url;
        } else if (updateData.image && updateData.image !== product.productImage) {
            if (product.productImage) await deleteImage(product.productImage);
            imageUrl = updateData.image;
        }

        const mappedData = {
            productName: updateData.name || product.productName,
            shortDescription: updateData.description || product.shortDescription,
            price: updateData.price || product.price,
            productImage: imageUrl
        };

        const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: mappedData }, { new: true });
        res.json({ success: true, message: "Product updated successfully", data: updatedProduct });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const businessId = req.business.id;

        const product = await Product.findOne({ _id: productId, businessId });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.productImage) await deleteImage(product.productImage);

        await Product.findByIdAndDelete(productId);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const getBusinessProducts = async (req, res) => {
    try {
        const { businessId } = req.params;
        const products = await Product.find({ businessId });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
