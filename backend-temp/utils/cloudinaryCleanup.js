import cloudinary from "../Config/cloudinary.js";
import { getPublicIdFromUrl } from "../HelperFun/helperFun.js";

/**
 * Deletes a single image from Cloudinary given its URL.
 * @param {string} url - The full Cloudinary URL of the image.
 */
export const deleteImage = async (url) => {
    if (!url || typeof url !== "string") return;
    
    // Only attempt to delete if it's a Cloudinary URL
    if (!url.includes("res.cloudinary.com")) return;

    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return;

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error(`Failed to delete image from Cloudinary: ${url}`, error);
        // We don't throw here to avoid interrupting the main operation
        return null;
    }
};

/**
 * Deletes multiple images from Cloudinary given their URLs.
 * @param {string[]} urls - Array of Cloudinary URLs.
 */
export const deleteMultipleImages = async (urls) => {
    if (!Array.isArray(urls) || urls.length === 0) return;

    const validUrls = urls.filter(url => url && typeof url === "string" && url.includes("res.cloudinary.com"));
    
    // Use sequential processing to avoid timeouts or use Promise.all for small batches
    // Given the 449 timeout issue, we'll use a for loop for safety if there are many urls
    for (const url of validUrls) {
        await deleteImage(url);
    }
};

/**
 * Cleanup images for a School or College institute.
 * @param {Object} institute - The institute document.
 */
export const cleanupInstituteImages = async (institute) => {
    if (!institute) return;

    const urls = [];

    // Basic Info (Education sector often stores these inside basicInfo)
    if (institute.basicInfo?.bannerUrl) urls.push(institute.basicInfo.bannerUrl);
    if (institute.basicInfo?.aboutImgUrl) urls.push(institute.basicInfo.aboutImgUrl);
    
    // Fallback for top-level if any
    if (institute.bannerUrl) urls.push(institute.bannerUrl);
    if (institute.aboutImgUrl || institute.aboutImage) urls.push(institute.aboutImgUrl || institute.aboutImage);

    // Staff
    if (Array.isArray(institute.staff)) {
        institute.staff.forEach(s => s.image && urls.push(s.image));
    }

    // Gallery
    if (Array.isArray(institute.gallery)) {
        urls.push(...institute.gallery);
    }

    await deleteMultipleImages(urls);
};

/**
 * Cleanup images for a Health Service (Specialist or Pharmacy).
 * @param {Object} service - The health service document.
 * @param {string} type - SERVICE TYPE (SPECIALIST or PHARMACY).
 */
export const cleanupHealthServiceImages = async (service, type) => {
    if (!service) return;

    const urls = [];

    // Basic Info / Profile Image
    const profileImg = service.basicInfo?.img || service.basicInfo?.profileImg;
    if (profileImg) urls.push(profileImg);

    // Pharmacy specific
    if (type === "PHARMACY") {
        if (Array.isArray(service.Gallery)) {
            urls.push(...service.Gallery);
        }
        
        // Pharmacy banner if exists
        if (service.basicInfo?.bannerImg) urls.push(service.basicInfo.bannerImg);
    }
    
    // Specialist specific
    if (type === "SPECIALIST") {
        // Any specialist specific images? (Currently mostly basicInfo.img)
    }

    // Medical Orders / Prescriptions
    if (Array.isArray(service.Orders)) {
        service.Orders.forEach(order => {
            if (order.prescriptionFile) urls.push(order.prescriptionFile);
        });
    }

    await deleteMultipleImages(urls);
};

/**
 * Cleanup image for an Admission record.
 * @param {Object} admission - The admission document.
 */
export const cleanupAdmissionImages = async (admission) => {
    if (!admission) return;
    if (admission.paymentScreenshot) {
        await deleteImage(admission.paymentScreenshot);
    }
};

/**
 * Cleanup images for multiple Admission records.
 * @param {Object[]} admissions - Array of admission documents.
 */
export const cleanupAdmissionRecordImages = async (admissions) => {
    if (!Array.isArray(admissions) || admissions.length === 0) return;
    
    const urls = admissions
        .map(a => a.paymentScreenshot)
        .filter(url => url && typeof url === "string");

    await deleteMultipleImages(urls);
};

/**
 * Cleanup for Food Service (Restaurant/Bakery etc.)
 */
export const cleanupFoodServiceImages = async (service) => {
    if (!service) return;
    const urls = [];
    if (service.coverImage) urls.push(service.coverImage);
    if (service.aboutImage && service.aboutImage !== service.coverImage) urls.push(service.aboutImage);

    const menu = service.menu || service.menuItems;
    if (menu && Array.isArray(menu)) {
        menu.forEach(item => {
            if (item.img) urls.push(item.img);
        });
    }

    await deleteMultipleImages(urls);
};
