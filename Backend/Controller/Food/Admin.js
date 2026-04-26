import { Admins } from "../../Models/Admins.js";
import { ObjectId } from "mongodb";
import { deleteImage, deleteMultipleImages } from "../../utils/cloudinaryCleanup.js";
import { selectCollection } from "../../HelperFun/helperFun.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { UpdateTimingsToDb } from "../Education/Admin.js";

export { UpdateTimingsToDb };


export const UpdateFoodMenuToDb = async (req, res) => {
    try {
        let { menuItems } = req.body;
        const { ServiceId, AdminEmail } = req.token;
        const FoodCollection = selectCollection(req, "FOOD");
        console.log(`\n--- [UpdateFoodMenu] Start Update for ${AdminEmail} ---`);
        if (!FoodCollection) {
            return res.json({ success: false, message: "Invalid Food Service type." });
        }
        if (!ServiceId || !ObjectId.isValid(ServiceId)) {
            return res.json({ success: false, message: "Session error: Invalid Service ID." });
        }
        // 1. Fetch current data to identify old images
        const currentService = await FoodCollection.findOne({ _id: new ObjectId(ServiceId) });
        const oldMenu = currentService?.menu || currentService?.menuItems || [];
        const oldImages = oldMenu.map(item => item.img).filter(img => img && typeof img === "string");

        // 2. Process NEW images (Base64 -> Cloudinary)
        const processedMenuItems = await Promise.all((menuItems || []).map(async (item) => {
            if (item.img && typeof item.img === "string" && item.img.startsWith("data:image")) {
                try {
                    console.log(`[Cloudinary] Uploading new image for: ${item.name}...`);
                    const base64Data = item.img.split(",")[1];
                    const buffer = Buffer.from(base64Data, "base64");
                    
                    const uploadRes = await uploadToCloudinary(buffer, "Food/Menu");
                    console.log(`[Cloudinary] Upload Success: ${uploadRes.secure_url}`);
                    return { ...item, img: uploadRes.secure_url };
                } catch (uploadErr) {
                    console.error(`[Cloudinary] Upload Failed for ${item.name}:`, uploadErr.message);
                    return item; // Fallback to base64 if upload fails
                }
            }
            return item; // Already a URL or empty
        }));

        menuItems = processedMenuItems;

        // 3. Identify and Delete Orphaned Images
        const newImages = menuItems.map(item => item.img).filter(img => img && typeof img === "string");
        const orphanedImages = oldImages.filter(oldImg => !newImages.includes(oldImg));

        if (orphanedImages.length > 0) {
            console.log(`[Cloudinary] Detected ${orphanedImages.length} orphaned images. Cleaning up...`);
            for (const imgUrl of orphanedImages) {
                if (imgUrl.includes("res.cloudinary.com")) {
                    console.log(`[Cloudinary] Deleting: ${imgUrl}`);
                    try {
                        await deleteImage(imgUrl);
                    } catch (delErr) {
                        console.warn(`[Cloudinary] Failed to delete ${imgUrl}:`, delErr.message);
                    }
                }
            }
        }

        // 4. Update Database
        const updateResult = await FoodCollection.updateOne(
            { _id: new ObjectId(ServiceId) },
            { $set: { menu: menuItems } }
        );

        if (updateResult.matchedCount === 0) {
            return res.json({ success: false, message: "Service profile not found." });
        }

        console.log(`--- [UpdateFoodMenu] Success for ${AdminEmail} ---\n`);
        res.json({ success: true, message: "Menu and Cloudinary updated successfully ✅" });

    } catch (error) {
        console.error("[UpdateFoodMenu] CRITICAL ERROR:", error);
        res.json({ success: false, message: "System error updating menu." });
    }
};

export const SubmitSupportTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const { ServiceId } = req.token;
        const ServiceCollection = selectCollection(req, "FOOD");

        const ticket = {
            id: new ObjectId(),
            subject,
            message,
            status: "Open",
            timestamp: new Date(),
        };

        await ServiceCollection.updateOne(
            { _id: new ObjectId(ServiceId) },
            { $push: { supportTickets: ticket } }
        );

        res.json({ success: true, message: "Ticket submitted successfully.", ticket });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to submit ticket." });
    }
};

// --- Update promotions ---
export const UpdateFoodPromotions = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { promotions } = req.body;

        if (!Array.isArray(promotions)) {
            return res.json({ success: false, message: "Promotions array required." });
        }

        const foodColl = selectCollection(req, "FOOD");
        await foodColl.updateOne(
            { _id: new ObjectId(ServiceId) },
            { $set: { promotions } }
        );

        res.json({ success: true, message: "Promotions updated." });
    } catch (error) {
        console.error("UpdateFoodPromotions error:", error);
        res.json({ success: false, message: "Failed to update promotions." });
    }
};

// --- Handle individual reports (approve/reject/reply) ---
export const UpdateReportStatus = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { reportId, status, response } = req.body;

        if (!reportId || !status) {
            return res.json({ success: false, message: "reportId and status are required." });
        }

        const validStatuses = ["Pending", "Approved", "Rejected", "Resolved"];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status value." });
        }

        const foodColl = selectCollection(req, "FOOD");
        if (!foodColl) {
            return res.json({ success: false, message: "Food collection not found." });
        }

        const filter = {
            _id: new ObjectId(ServiceId),
            $or: [
                { "reports.id": new ObjectId(reportId) },
                { "reports._id": new ObjectId(reportId) }
            ]
        };

        const update = {
            $set: {
                "reports.$[elem].status": status,
                ...(response !== undefined ? { "reports.$[elem].adminResponse": response, "reports.$[elem].respondedAt": new Date() } : {})
            }
        };

        const arrayFilters = [
            {
                $or: [
                    { "elem.id": new ObjectId(reportId) },
                    { "elem._id": new ObjectId(reportId) }
                ]
            }
        ];

        let result = await foodColl.updateOne(filter, update, { arrayFilters });

        if (result.matchedCount === 0) {
            // Fallback for older documents that might not use arrayFilters correctly
            result = await foodColl.updateOne(
                {
                    _id: new ObjectId(ServiceId),
                    $or: [
                        { "reports.id": new ObjectId(reportId) },
                        { "reports._id": new ObjectId(reportId) }
                    ]
                },
                {
                    $set: {
                        "reports.$.status": status,
                        ...(response !== undefined ? { "reports.$.adminResponse": response, "reports.$.respondedAt": new Date() } : {})
                    }
                }
            );
        }

        if (result.matchedCount === 0) {
            return res.json({ success: false, message: "Report not found or not part of this service." });
        }

        const updatedService = await foodColl.findOne(
            { _id: new ObjectId(ServiceId) },
            { projection: { reports: 1 } }
        );

        const updatedReport = updatedService.reports.find(r =>
            r.id?.toString() === reportId ||
            r._id?.toString() === reportId
        );

        res.json({ success: true, message: `Report marked as ${status} ✅.`, report: updatedReport });
    } catch (error) {
        console.error("UpdateReportStatus error:", error);
        res.json({ success: false, message: "An error occurred while updating the report status." });
    }
};


// --- Update cover image ---
export const UpdateCoverImage = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const coverImageFile = req.file;

        if (!coverImageFile) {
            return res.json({ success: false, message: "No image file uploaded." });
        }

        const foodColl = selectCollection(req, "FOOD");
        const currentService = await foodColl.findOne({ _id: new ObjectId(ServiceId) });

        if (!currentService) {
            return res.json({ success: false, message: "Service not found." });
        }

        // --- Image Cleanup Logic ---
        const oldCoverImageUrl = currentService.coverImage || currentService.aboutImage;
        if (oldCoverImageUrl) {
            console.log("Deleting old cover image...");
            await deleteImage(oldCoverImageUrl);
        }

        // --- Upload New Image ---
        const { uploadToCloudinary } = await import("../../utils/cloudinary.js");
        const uploadResult = await uploadToCloudinary(coverImageFile, "food-services/covers");

        if (!uploadResult || !uploadResult.secure_url) {
            throw new Error("Cloudinary upload failed.");
        }

        const newImageUrl = uploadResult.secure_url;

        // --- Update Database ---
        await foodColl.updateOne(
            { _id: new ObjectId(ServiceId) },
            {
                $set: {
                    coverImage: newImageUrl,
                    aboutImage: newImageUrl // Keep both in sync for compatibility
                }
            }
        );

        res.json({
            success: true,
            message: "Cover image updated successfully ✅.",
            coverImage: newImageUrl
        });

    } catch (error) {
        console.error("UpdateCoverImage error:", error);
        res.json({ success: false, message: "Failed to update cover image." });
    }
};


// --- Update Food Gallery ---
export const UpdateFoodGallery = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const FoodCollection = selectCollection(req, "FOOD");

        if (!FoodCollection) {
            return res.json({ success: false, message: "Invalid Food Service type." });
        }

        const currentService = await FoodCollection.findOne({ _id: new ObjectId(ServiceId) });
        if (!currentService) {
            return res.json({ success: false, message: "Service not found." });
        }

        const oldGallery = currentService.gallery || [];

        // --- 1. Identify Existing Images ---
        let existingImages = [];
        if (req.body.existingImages) {
            existingImages = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : [req.body.existingImages];
        }

        // --- 2. Delete Removed Images from Cloudinary ---
        const deletedImages = oldGallery.filter(img => !existingImages.includes(img));
        if (deletedImages.length > 0) {
            console.log(`Deleting ${deletedImages.length} removed gallery images...`);
            await deleteMultipleImages(deletedImages);
        }

        // --- 3. Upload New Images ---
        let newlyUploadedUrls = [];
        if (req.files && req.files.length > 0) {
            const { uploadToCloudinary } = await import("../../utils/cloudinary.js");
            for (const file of req.files) {
                try {
                    const result = await uploadToCloudinary(file, "food-services/gallery");
                    if (result?.secure_url) {
                        newlyUploadedUrls.push(result.secure_url);
                    }
                } catch (uploadError) {
                    console.error("Gallery upload error for file:", uploadError);
                }
            }
        }

        const finalGallery = [...existingImages, ...newlyUploadedUrls];

        // --- 4. Update Database ---
        await FoodCollection.updateOne(
            { _id: new ObjectId(ServiceId) },
            { $set: { gallery: finalGallery } }
        );

        res.json({
            success: true,
            message: "Gallery updated successfully ✅.",
            gallery: finalGallery
        });

    } catch (error) {
        console.error("UpdateFoodGallery error:", error);
        res.json({ success: false, message: "Failed to update gallery." });
    }
};
