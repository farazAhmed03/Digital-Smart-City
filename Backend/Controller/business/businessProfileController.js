import BusinessProfile from "../../Models/business/BusinessProfile.js";
import Product from "../../Models/business/Product.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { deleteImage } from "../../utils/cloudinaryCleanup.js";



export const getMyBusinessProfile = async (req, res) => {
    try {
        const businessId = req.business.id;
        const profile = await BusinessProfile.findOne({ businessId });
        if (!profile) {
            return res.status(200).json({ success: true, profile: null }); // Return success with null so frontend can show empty form
        }
        res.json({ success: true, profile });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const getBusinessProfile = async (req, res) => {
    try {
        const { businessId } = req.params;
        const profile = await BusinessProfile.findOne({ businessId });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        const products = await Product.find({ businessId });
        const profileObj = profile.toObject();
        profileObj.products = products.map(p => ({
            id: p._id,
            title: p.productName,
            description: p.shortDescription,
            price: p.price,
            image: p.productImage,
            businessId: p.businessId
        }));

        res.json({ success: true, data: profileObj });


    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const updateBusinessProfile = async (req, res) => {
    try {
        const businessId = req.business.id;
        let profileData = { ...req.body };

        // Parse contactInfo if stringified by FormData
        if (typeof profileData.contactInfo === 'string') {
            profileData.contactInfo = JSON.parse(profileData.contactInfo);
        }

        let profile = await BusinessProfile.findOne({ businessId });

        // Handle Image Uploads
        let logoUrl = profile ? profile.logo : "";
        let coverImageUrl = profile ? profile.coverImage : "";

        if (req.files) {
            if (req.files.logo && req.files.logo.length > 0) {
                if (profile && profile.logo) {
                    await deleteImage(profile.logo);
                }
                const uploadResult = await uploadToCloudinary(req.files.logo[0], "business_profiles");
                logoUrl = uploadResult.secure_url;
            } else if (req.body.logo) {
                logoUrl = req.body.logo;
            }

            if (req.files.coverImage && req.files.coverImage.length > 0) {
                if (profile && profile.coverImage) {
                    await deleteImage(profile.coverImage);
                }
                const uploadResult = await uploadToCloudinary(req.files.coverImage[0], "business_profiles");
                coverImageUrl = uploadResult.secure_url;
            } else if (req.body.coverImage) {
                coverImageUrl = req.body.coverImage;
            }
        } else {
            if (req.body.logo) logoUrl = req.body.logo;
            if (req.body.coverImage) coverImageUrl = req.body.coverImage;
        }

        profileData.logo = logoUrl;
        profileData.coverImage = coverImageUrl;

        if (profile) {
            // Update existing profile
            profile = await BusinessProfile.findOneAndUpdate(
                { businessId },
                { $set: profileData },
                { new: true }
            );
        } else {
            // Create new profile
            profile = new BusinessProfile({
                businessId,
                ...profileData
            });
            await profile.save();
        }

        res.json({ success: true, message: "Profile updated successfully", profile });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const getProfilesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const profiles = await BusinessProfile.find({ category });

        // Fetch products for each profile
        const profilesWithProducts = await Promise.all(profiles.map(async (profile) => {
            const products = await Product.find({ businessId: profile.businessId });
            const pObj = profile.toObject();
            pObj.products = products.map(p => ({
                id: p._id,
                title: p.productName,
                description: p.shortDescription,
                price: p.price,
                image: p.productImage,
                businessId: p.businessId
            }));

            return pObj;
        }));

        res.json({ success: true, profiles: profilesWithProducts });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
