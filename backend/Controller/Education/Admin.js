import JWT from "jsonwebtoken";
import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { Admins } from "../../Models/Admins.js";
import { Schools, Colleges } from "../../Models/Schl&ClgSchemeas.js";
import { getServiceModel, getSectorFromType, selectCollection, resolveServiceResource, getServiceDoc } from "../../HelperFun/helperFun.js";
import { checkPlanLimit, validatePlanFeature } from "../../utils/planValidation.js";
import { deleteImage, deleteMultipleImages } from "../../utils/cloudinaryCleanup.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

// Verify import at load time to catch reference issues early
if (typeof uploadToCloudinary === "undefined") {
    console.error("CRITICAL: uploadToCloudinary is not defined in Education/Admin.js at load time!");
}

// =========================================
// ADMIN LOGIN
// =========================================
export const AdminLoginFun = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const emailRegex = new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i");

        const admin = await Admins.findOne({
            $or: [
                { AdminEmail: emailRegex },
                { "Managers.ManagerEmail": emailRegex }
            ]
        });

        if (!admin) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        /* =====================================================
           â­ ADMIN LOGIN
        ===================================================== */

        if (admin.AdminEmail?.toLowerCase() === normalizedEmail) {

            let valid = false;
            try {
                valid = await argon2.verify(admin.AdminPassword, password);
            } catch (e) {
                // If hash is malformed or plain text, try plain comparison
                valid = admin.AdminPassword === password;
            }

            // If plain text matched, upgrade to argon2 hash for future logins
            if (!valid && admin.AdminPassword === password) {
                const newHash = await argon2.hash(password);
                await Admins.updateOne({ _id: admin._id }, { $set: { AdminPassword: newHash } });
                valid = true;
            }

            if (!valid) {
                return res.json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            // Strict check for sector if passed, or default to EDUCATION
            const preferredSector = req.body.sector?.toString().trim().toUpperCase() || "EDUCATION";
            const matchedService = admin.Services?.find(s => {
                const sSector = s.Sector || getSectorFromType(s.ServiceType);
                return sSector === preferredSector;
            });

            if (!matchedService) {
                return res.json({ success: false, message: "Invalid email or password" });
            }

            const sector = matchedService.Sector || getSectorFromType(matchedService.ServiceType);

            // Check if institute is active
            const InstituteColl = selectCollection(req, matchedService.ServiceType);
            const institute = await InstituteColl.findOne({ _id: new ObjectId(matchedService.ServiceId) });

            if (institute && institute.isActive === false) {
                return res.json({
                    success: false,
                    message: "Your institute account has been disabled. Please contact support."
                });
            }

            const token = JWT.sign(
                {
                    role: "admin",
                    AdminId: admin._id,
                    AdminEmail: admin.AdminEmail,
                    ServiceId: matchedService.ServiceId,
                    ServiceName: matchedService.ServiceName,
                    ServiceType: matchedService.ServiceType,
                    sector: sector,
                    verified: admin.Verified
                },
                process.env.JWT_KEY,
                { expiresIn: "1d" }
            );

            res.cookie("adm_token", token, {
                httpOnly: true,        // Prevents XSS attacks
                secure: true,          // MUST be true for SameSite: None
                sameSite: "None",      // Allows cross-site cookies between Railway and Vercel
                maxAge: 24 * 60 * 60 * 1000, 
                path: "/",
            });

            return res.json({
                success: true,
                role: "admin",
                ServiceType: matchedService.ServiceType,
                sector: sector,
                ShowSwitchTab: admin.Services.length > 1
            });
        }

        /* =====================================================
           â­ MANAGER LOGIN (FIXED â­)
        ===================================================== */

        const matchedManager = admin.Managers?.find(
            m => m.ManagerEmail?.toLowerCase() === normalizedEmail
        );

        if (!matchedManager) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if institute is active
        const InstituteColl = selectCollection(req, matchedManager.ServiceType);
        const institute = await InstituteColl.findOne({ _id: new ObjectId(matchedManager.ServiceId) });

        if (institute && institute.isActive === false) {
            return res.json({
                success: false,
                message: "Your institute account has been disabled. Please contact support."
            });
        }

        const validManager = await argon2.verify(
            matchedManager.password,
            password
        );

        if (!validManager) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const sector = getSectorFromType(matchedManager.ServiceType);

        const token = JWT.sign(
            {
                role: "manager",
                AdminId: admin._id,
                AdminEmail: admin.AdminEmail,
                ServiceId: matchedManager.ServiceId,
                ServiceName: matchedManager.ServiceName,
                ServiceType: matchedManager.ServiceType,
                sector: sector,
                verified: admin.Verified
            },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("adm_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            role: "manager",
            ServiceType: matchedManager.ServiceType,
            sector: sector,
            ShowSwitchTab: false
        });

    } catch (error) {

        console.error("AdminLoginFun error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// =========================================
// ADD MANAGER  
// =========================================
export const AddManager = async (req, res) => {
    try {

        const AdminEmail = req.token.AdminEmail;
        const { ManagerEmail, password, ServiceName, ServiceType } = req.body;

        /* =====================================================
           Basic Validation
        ===================================================== */

        if (!ManagerEmail || !password || !ServiceName || !ServiceType) {
            return res.json({
                success: false,
                message: "All fields required"
            });
        }

        const admin = await Admins.findOne({ AdminEmail });

        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found."
            });
        }

        if (!admin.Verified) {
            return res.json({
                success: false,
                message: "Admin not verified."
            });
        }

        /* =====================================================
           ðŸ”¹ Check Service Exists Under Admin
        ===================================================== */

        const selectedService = admin.Services.find(
            s =>
                s.ServiceName === ServiceName &&
                s.ServiceType === ServiceType
        );

        if (!selectedService) {
            return res.json({
                success: false,
                message: "Service not registered."
            });
        }

        /* =====================================================
           ðŸ”¹ Prevent Duplicate Manager Email
        ===================================================== */

        const emailExists = admin.Managers?.some(
            m => m.ManagerEmail === ManagerEmail
        );

        if (emailExists) {
            return res.json({
                success: false,
                message: "Manager email already exists."
            });
        }

        /* =====================================================
           ðŸ”¹ Prevent Multiple Managers for Same Service (Optional Rule)
        ===================================================== */

        const serviceManagerExists = admin.Managers?.some(
            m =>
                m.ServiceId.toString() ===
                selectedService.ServiceId.toString()
        );

        if (serviceManagerExists) {
            return res.json({
                success: false,
                message: "Manager already assigned to this service."
            });
        }

        /* =====================================================
           ðŸ”¹ Create Manager
        ===================================================== */

        const hashedPassword = await argon2.hash(password);

        const managerObj = {
            ManagerEmail,
            password: hashedPassword,
            ServiceId: selectedService.ServiceId,
            ServiceName,
            ServiceType,
            createdAt: new Date()
        };

        await Admins.updateOne(
            { _id: admin._id },
            { $push: { Managers: managerObj } }
        );

        return res.json({
            success: true,
            message: "Manager created successfully."
        });

    } catch (error) {
        console.error("AddManager error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};

// ===============================================
// Getting the Institute data according to admin
// ===============================================
export const RetriveTheDashboardDta = async (req, res) => {
    try {

        const { ServiceId, role, AdminEmail, ServiceType } = req.token;

        if (!ServiceId || !role || !AdminEmail || !ServiceType) {
            return res.json({
                success: false,
                message: "Invalid token data."
            });
        }

        /* =====================================================
           Get Admin
        ===================================================== */

        const admin = await Admins.findOne(
            { AdminEmail },
            { Services: 1, Verified: 1 }
        );

        if (!admin) {
            return res.json({
                success: false,
                message: "Unauthorized."
            });
        }

        /* =====================================================
           Validate Active Service Under Admin
        ===================================================== */

        const activeService = admin.Services?.find(
            s => s.ServiceId.toString() === ServiceId.toString()
        );

        if (!activeService) {
            return res.json({
                success: false,
                message: "Service not found."
            });
        }

        /* =====================================================
           Resolve Correct Service Model / Collection
        ===================================================== */

        const { model: ServiceCollection, isFoodService } = await resolveServiceResource(req);

        if (!ServiceCollection) {
            return res.json({
                success: false,
                message: "Invalid service type."
            });
        }
        /* =====================================================
        Fetch Service Data
        ===================================================== */

        const ServiceDta = isFoodService
            ? await ServiceCollection.findOne({ _id: new ObjectId(ServiceId) })
            : await ServiceCollection.findById(ServiceId);
        if (!ServiceDta) {
            return res.json({
                success: false,
                message: "Service data not found."
            });
        }

        /* =====================================================
        Admin Role
        ===================================================== */
        if (role === "admin") {

            const isActive = isFoodService
                ? ServiceDta?.ServiceStatus !== false && ServiceDta?.Status !== false
                : ServiceDta.Status;

            if (!admin.Verified || !isActive) {
                return res.json({
                    success: false,
                    message: "Service is not active."
                });
            }

            const OtherServices =
                admin.Services?.filter(
                    s => s.ServiceId.toString() !== ServiceId.toString()
                ) || [];

            // Merge Admin Plan Info into Service Data for Frontend Compatibility
            const dashboardPayload = {
                ...(isFoodService ? ServiceDta : ServiceDta.toObject()),
                PaymentPlan: admin.PaymentPlan || ServiceDta.PaymentPlan || "FREE",
                PlanExpiry: admin.PlanExpiry || ServiceDta.PlanExpiry,
                SubscriptionStatus: admin.SubscriptionStatus || ServiceDta.SubscriptionStatus || "Active",
                trialEndDate: admin.trialEndDate || ServiceDta.trialEndDate,
                Managers: (admin.Managers || []).filter(manager => {
                    const managerSector = getSectorFromType(manager.ServiceType);
                    return managerSector === getSectorFromType(ServiceType);
                })
            };

            return res.json({
                success: true,
                role: "admin",
                data: dashboardPayload,
                OtherServices: OtherServices.length > 0 ? OtherServices : undefined
            });
        }

        /* =====================================================
        Manager Role
        ===================================================== */
        if (role === "manager") {
            return res.json({
                success: true,
                role: "manager",
                data: ServiceDta
            });
        }

        return res.json({
            success: false,
            message: "Invalid role."
        });

    } catch (error) {
        console.error("RetriveTheDashboardDta error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};



/* =========================================================
  Update Basic Info 
========================================================= */

export const UpdateBasicInfoToDb = async (req, res) => {
    try {

        const { model: Model, isFoodService } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        const { tagline, about, bannerUrl, aboutImgUrl, location, phone, email, facilities, timing, type } = req.body;

        const bannerFile = req.files?.bannerUrl?.[0];
        const aboutImgFile = req.files?.aboutImgUrl?.[0] || req.files?.aboutImage?.[0] || req.files?.coverImage?.[0];

        if (!Model) {
            return res.json({ success: false, message: "Invalid service type." });
        }

        // Get existing document
        const Inst = isFoodService
            ? await Model.findOne({ _id: new ObjectId(ServiceId) })
            : await Model.findById(ServiceId).select("basicInfo tagline about quickInfo contact facilities Type");

        if (!Inst) {
            return res.json({
                success: false,
                message: "Institute not found."
            });
        }

        const updateData = {
            tagline: tagline || (isFoodService ? Inst.tagline : Inst.basicInfo?.tagline) || "",
            about: about || (isFoodService ? Inst.about : Inst.basicInfo?.about) || ""
        };

        /* =====================================================
           File Size Validation
        ===================================================== */
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (bannerFile && bannerFile.size > MAX_FILE_SIZE) {
            return res.status(400).json({ success: false, message: "Banner image too large (max 5MB)" });
        }
        if (aboutImgFile && aboutImgFile.size > MAX_FILE_SIZE) {
            return res.status(400).json({ success: false, message: "About image too large (max 5MB)" });
        }

        /* =====================================================
           Image Processing (Sequential) 
        ===================================================== */

        // 1. Banner Processing
        if (bannerFile) {
            try {
                console.log("Uploading banner...");
                const oldBannerUrl = isFoodService ? Inst.bannerUrl : Inst.basicInfo?.bannerUrl;
                if (oldBannerUrl) {
                    await deleteImage(oldBannerUrl);
                }
                const bannerRes = await uploadToCloudinary(bannerFile, "Insts/banners");
                updateData.bannerUrl = bannerRes.secure_url;
                console.log("Banner upload successful.");
            } catch (err) {
                console.error("Banner upload failed:", err);
                return res.status(500).json({ success: false, message: "Banner upload failed: " + err.message });
            }
        } else if (bannerUrl) {
            updateData.bannerUrl = bannerUrl;
        } else {
            updateData.bannerUrl = (isFoodService ? Inst.bannerUrl : Inst.basicInfo?.bannerUrl) || "";
        }

        // 2. About Image Processing
        if (aboutImgFile) {
            try {
                console.log("Uploading about image...");
                const oldAboutUrl = isFoodService ? (Inst.coverImage || Inst.aboutImgUrl || Inst.aboutImage) : Inst.basicInfo?.aboutImgUrl;
                if (oldAboutUrl) {
                    await deleteImage(oldAboutUrl);
                }
                const aboutRes = await uploadToCloudinary(aboutImgFile, "Insts/about-images");
                updateData.aboutImgUrl = aboutRes.secure_url;
                console.log("About image upload successful.");
            } catch (err) {
                console.error("About image upload failed:", err);
                return res.status(500).json({ success: false, message: "About image upload failed: " + err.message });
            }
        } else if (aboutImgUrl) {
            updateData.aboutImgUrl = aboutImgUrl;
        } else {
            updateData.aboutImgUrl = (isFoodService ? (Inst.coverImage || Inst.aboutImgUrl || Inst.aboutImage) : Inst.basicInfo?.aboutImgUrl) || "";
        }

        /* =====================================================
           ðŸ”¥ Database Update
        ===================================================== */

        if (isFoodService) {
            const facilitiesArr = facilities
                ? facilities.split(",").map(f => f.trim()).filter(Boolean)
                : Inst.facilities;

            const quickInfo = {
                basicProfile: {
                    ...(Inst.quickInfo?.basicProfile || {}),
                    location: location || Inst.quickInfo?.basicProfile?.location,
                    type: type || Inst.Type || Inst.quickInfo?.basicProfile?.type
                },
                timings: timing ? { opening: timing } : (Inst.quickInfo?.timings || {}),
                facilities: facilitiesArr || Inst.quickInfo?.facilities
            };

            const contact = {
                ...(Inst.contact || {}),
                phone: phone || Inst.contact?.phone,
                email: email || Inst.contact?.email
            };

            await Model.updateOne(
                { _id: new ObjectId(ServiceId) },
                {
                    $set: {
                        ...updateData,
                        coverImage: isFoodService ? (updateData.aboutImgUrl || Inst.coverImage) : undefined,
                        aboutImage: isFoodService ? (updateData.aboutImgUrl || Inst.aboutImage) : undefined,
                        quickInfo,
                        contact,
                        facilities: facilitiesArr || Inst.facilities
                    }
                }
            );
        } else {
            await Model.findByIdAndUpdate(
                ServiceId,
                {
                    $set: {
                        basicInfo: updateData
                    }
                },
                {
                    new: true,
                    runValidators: false
                }
            );
        }

        res.status(200).json({
            success: true,
            message: "Basic Info updated."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Upload failed"
        });
    }
};

/* =========================================================
   Update Administration 
========================================================= */

export const UpdateAdministrationToDb = async (req, res) => {
    try {

        const { model: Model, isFoodService } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        if (isFoodService) {
            await Model.updateOne(
                { _id: new ObjectId(ServiceId) },
                { $set: { administration: req.body.administration } }
            );
        } else {
            await Model.findByIdAndUpdate(
                ServiceId,
                { $set: { administration: req.body.administration } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Administration updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================================================
   Update Timings 
========================================================= */

export const UpdateTimingsToDb = async (req, res) => {
    try {

        const { model: Model, isFoodService } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        if (isFoodService) {
            await Model.updateOne(
                { _id: new ObjectId(ServiceId) },
                { $set: { timings: req.body.timings } }
            );
        } else {
            await Model.findByIdAndUpdate(
                ServiceId,
                { $set: { timings: req.body.timings } },
                { new: true, runValidators: false }
            );
        }

        res.status(200).json({
            success: true,
            message: "Timings updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================================================
   Update Facilities 
========================================================= */

export const UpdateFacilitiesToDb = async (req, res) => {
    try {
        const { model: Model, isFoodService } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        if (isFoodService) {
            await Model.updateOne(
                { _id: new ObjectId(ServiceId) },
                { $set: { facilities: req.body.facilities } }
            );
        } else {
            await Model.findByIdAndUpdate(
                ServiceId,
                { $set: { facilities: req.body.facilities } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Facilities updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================================================
   Update Fees 
========================================================= */

export const UpdateFeesToDb = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;


        await Model.findByIdAndUpdate(
            ServiceId,
            { $set: { feeData: req.body.feeData } },
            { new: true, runValidators: false }
        );

        res.status(200).json({
            success: true,
            message: "Fees updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================================================
   Update Reviews 
========================================================= */

export const UpdateReviewsToDb = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        await Model.findByIdAndUpdate(
            ServiceId,
            { $set: { Reviews: req.body.Reviews || [] } },
            { new: true, runValidators: false }
        );

        res.status(200).json({
            success: true,
            message: "Reviews updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================================================
   Update Payment Gateways 
========================================================= */

export const UpdatePaymentGatewaysToDb = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        await Model.findByIdAndUpdate(
            ServiceId,
            { $set: { paymentGateways: req.body.paymentGateways } },
            { new: true, runValidators: false }
        );

        res.status(200).json({
            success: true,
            message: "Payment gateways updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================================
// UPDATE STAFF DATA
// =========================================
export const UpdateStaffData = async (req, res) => {
    try {


        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        if (!ServiceId) {
            return res.status(400).json({
                success: false,
                message: "ServiceId missing in token"
            });
        }


        /* =====================================================
           Validate Request Staff Array
        ===================================================== */

        const staffFromReq = [];

        Object.keys(req.body).forEach(key => {
            if (!isNaN(key)) {
                staffFromReq.push(req.body[key]);
            }
        });

        if (!Array.isArray(staffFromReq) || staffFromReq.length === 0) {
            return res.status(400).json({
                success: false,
                message: "staff data missing"
            });
        }

        const Inst = await Model.findById(ServiceId).select("staff AdminId");
        const admin = await Admins.findById(Inst?.AdminId).select("PaymentPlan PlanExpiry Status");

        const oldStaff = Inst?.staff || [];

        /* =====================================================
           Plan Feature & Limit Validation ⭐
        ===================================================== */
        const featureCheck = validatePlanFeature(admin || Inst, "Staff Data");
        if (!featureCheck.allowed) {
            return res.json({
                success: false,
                message: featureCheck.message
            });
        }

        const limitCheck = checkPlanLimit(admin || Inst, 'staff', oldStaff.length);
        if (!limitCheck.allowed && staffFromReq.length > oldStaff.length) {
            return res.json({
                success: false,
                message: limitCheck.message
            });
        }

        /* =====================================================
           Process Staff Members (Sequential) ⚡
        ===================================================== */

        const finalStaff = [];
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        for (let i = 0; i < staffFromReq.length; i++) {
            const member = staffFromReq[i];
            let imageUrl = member.image || "";
            let oldImageUrl = oldStaff[i]?.image || "";

            /* ---------------- Image Upload ---------------- */
            const file = req.files?.find(
                f => f.fieldname.startsWith(`${i}[image]`)
            );

            if (file) {
                // File Size Validation
                if (file.size > MAX_FILE_SIZE) {
                    imageUrl = oldImageUrl || member.image || "";
                } else {
                    try {
                        const uploadResult = await uploadToCloudinary(file, "staff");
                        imageUrl = uploadResult.secure_url;
                    } catch (uploadError) {
                        console.error("Staff image upload failed:", uploadError);
                        return res.status(500).json({ success: false, message: "Staff image upload failed: " + uploadError.message });
                    }
                }
            }

            finalStaff.push({
                name: member.name || "",
                description: member.description || "",
                image: imageUrl
            });
        }

        /* =====================================================
           Update Database ⭐
        ===================================================== */

        await Model.updateOne(
            { _id: new ObjectId(ServiceId) },
            {
                $set: {
                    staff: finalStaff
                }
            }
        );

        /* =====================================================
           Image Cleanup (Remove orphaned staff images) ⭐
        ===================================================== */
        const oldImages = oldStaff.map(s => s.image).filter(Boolean);
        const newImages = finalStaff.map(s => s.image).filter(Boolean);
        const imagesToDelete = oldImages.filter(img => !newImages.includes(img));

        if (imagesToDelete.length > 0) {
            await deleteMultipleImages(imagesToDelete);
        }

        return res.status(200).json({
            success: true,
            message: "Staff updated successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update staff"
        });
    }
};

// =========================================
// UPDATE GALLERY
// =========================================
export const UpdateGallery = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        const Inst = await Model.findById(ServiceId)
            .select("gallery AdminId");
        const admin = await Admins.findById(Inst?.AdminId).select("PaymentPlan PlanExpiry Status");

        const oldGallery = Inst?.gallery || [];

        /* ---------------- Existing Images ---------------- */

        let existingImages = [];

        if (req.body.existingImages) {
            existingImages = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : [req.body.existingImages];
        }

        /* ---------------- Delete Removed Images (Sequential) ---------------- */

        const deletedImages = oldGallery.filter(
            img => !existingImages.includes(img)
        );

        await deleteMultipleImages(deletedImages);

        /* ---------------- Upload New Images (Sequential) ---------------- */

        let uploadedUrls = [];
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                if (file.size > MAX_FILE_SIZE) {
                    continue;
                }
                try {
                    const result = await uploadToCloudinary(file, "Gallery");
                    uploadedUrls.push(result.secure_url);
                } catch (uploadError) {
                    console.error("Gallery image upload failed:", uploadError);
                    return res.status(500).json({ success: false, message: "Gallery image upload failed: " + uploadError.message });
                }
            }
        }

        const finalGalleryImages = [
            ...existingImages,
            ...uploadedUrls
        ];

        /* =====================================================
           Plan Feature & Limit Validation â­
        ===================================================== */
        const featureCheck = validatePlanFeature(admin || Inst, "Gallery Images");
        if (!featureCheck.allowed) {
            return res.json({
                success: false,
                message: featureCheck.message
            });
        }

        const limitCheck = checkPlanLimit(admin || Inst, 'galleryImages', oldGallery.length);
        if (!limitCheck.allowed && finalGalleryImages.length > oldGallery.length) {
            return res.json({
                success: false,
                message: limitCheck.message
            });
        }

        /* ---------------- Database Update ---------------- */

        await Model.findByIdAndUpdate(
            ServiceId,
            {
                $set: {
                    gallery: finalGalleryImages
                }
            },
            {
                new: true,
                runValidators: false
            }
        );

        res.status(200).json({
            success: true,
            message: "Gallery updated successfully"
        });

    } catch (error) {

        console.error("Gallery upload error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update gallery"
        });
    }
};

// =========================================
// ADD STAFF AND STUDENT DATA
// =========================================
export const AddStaffAndStudentDataToDb = async (req, res) => {
    try {

        const { ServiceId } = req.token;
        const { staffAndStudnt } = req.body;

        /* ===============================
           Basic Validation
        =============================== */

        if (!ServiceId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. ServiceId missing."
            });
        }

        if (!staffAndStudnt || typeof staffAndStudnt !== "object") {
            return res.status(400).json({
                success: false,
                message: "staffAndStudnt must be an object."
            });
        }

        /* ===============================
           Decide Collection (Dynamic)
        =============================== */

        const collection = selectCollection(req, req.token.ServiceType);

        /* ===============================
           Update Document
        =============================== */

        const result = await collection.updateOne(
            { _id: new ObjectId(ServiceId) },
            {
                $set: {
                    StaffAndStudent: {
                        Total_Students: staffAndStudnt.Total_Students,
                        Total_Teachers: staffAndStudnt.Total_Teachers,
                        Qualification: staffAndStudnt.Qualification,
                        Ratio: staffAndStudnt.Ratio,
                        Medium: staffAndStudnt.Medium,
                        others: Array.isArray(staffAndStudnt.others)
                            ? staffAndStudnt.others
                            : []
                    }
                }
            }
        );

        /* ===============================
           Success Response
        =============================== */

        return res.status(200).json({
            success: true,
            message: "StaffAndStudent data saved successfully ðŸ‘",
        });

    } catch (error) {

        console.log("Native Mongo Error =", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================================
// ADD RESULT AND PERFORMANCE DATA
// =========================================
export const AddResAndPrfumncDataToDb = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        console.log(req.body.ResAndPrfrmnc);

        await Model.findByIdAndUpdate(
            ServiceId,
            { $set: { ResultAndPerformance: req.body.ResAndPrfrmnc } },
            { new: true, runValidators: false }
        );

        res.status(200).json({
            success: true,
            message: "Data updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================================
// DELETE THE EVENT FROM DB
// =========================================
export const deleteTheEventFrmDb = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        const { title } = req.body;

        const Inst = await Model.findById(ServiceId);

        const updatedDta = (Inst.eventData || []).filter(
            v => v.title !== title
        );

        await Model.findByIdAndUpdate(
            ServiceId,
            {
                $set: {
                    eventData: updatedDta
                }
            },
            {
                new: true
            }
        );

        res.json({
            success: true,
            message: "Event Deleted successfully âœ…"
        });

    } catch {
        res.json({
            success: false,
            message: "Something went wrong."
        });
    }
};

// =========================================
// ADD NEW EVENT TO DB
// =========================================
export const AddNewEventToDb = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);
        const { ServiceId } = req.token;

        let Data = await Model.findById(
            ServiceId
        );

        let OldEventData = Data.eventData;
        let newEventData = [...OldEventData, req.body.eventData];

        await Model.findByIdAndUpdate(
            ServiceId,
            { $set: { eventData: newEventData } },
            { new: true, runValidators: false }
        );

        res.status(200).json({
            success: true,
            message: "Data updated."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================================
// UPDATE EXTRA ACTIVITIES TO DB
// =========================================
export const UpdateExtraActivitiesToDb = async (req, res) => {
    try {

        const { model: Model } = await resolveServiceResource(req);

        const { ServiceId } = req.token;

        if (!ServiceId) {
            return res.status(400).json({
                success: false,
                message: "ServiceId missing in token"
            });
        }

        /* ===============================
           Validation
        =============================== */

        const activities = req.body.extraActivities;

        if (!Array.isArray(activities)) {
            return res.status(400).json({
                success: false,
                message: "extraActivities must be an array of titles"
            });
        }

        /* ===============================
           Update Document
        =============================== */

        const result = await Model.updateOne(
            {
                _id: new ObjectId(ServiceId)
            },
            {
                $set: {
                    extraActivities: activities
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Data updated."
        });

    } catch (error) {

        console.log("UpdateExtraActivitiesToDb Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================================
// GET INSTITUTE ADMISSIONS
// =========================================
export const GetInstituteAdmissions = async (req, res) => {
    try {

        const { instituteId } = req.body;

        /* =====================================================
           Authorization Validation
        ===================================================== */

        if (!instituteId || String(instituteId) !== String(req.token.ServiceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Institute ID"
            });
        }

        /* =====================================================
           Collections
        ===================================================== */

        const AdmissionsRecord = selectCollection(req, "AdmissionsRecord");
        const NewAdmission = selectCollection(req, "NewAdmission");

        /* =====================================================
           Approved Admissions
        ===================================================== */

        const approvedAdmissions = await AdmissionsRecord.find(
            { instituteId: new ObjectId(instituteId) },
            {
                projection: {
                    studentName: 1,
                    fatherName: 1,
                    phone: 1,
                    email: 1,
                    targetClass: 1,
                    paymentScreenshot: 1,
                    status: 1,
                    createdAt: 1
                }
            }
        ).toArray();

        /* =====================================================
           Pending Admissions
        ===================================================== */

        const pendingAdmissions = await NewAdmission.find(
            { InstId: instituteId },
            {
                projection: {
                    studentName: 1,
                    fatherName: 1,
                    phone: 1,
                    email: 1,
                    targetClass: 1,
                    paymentScreenshot: 1,
                    status: 1,
                    createdAt: 1
                }
            }
        ).toArray();

        /* =====================================================
           Response Structure
        ===================================================== */

        return res.status(200).json({
            success: true,
            data: {
                ApprovedAdmissionscount: approvedAdmissions.length,
                ApprovedAdmissionsdata: approvedAdmissions,

                PendingAdmissionscount: pendingAdmissions.length,
                PendingAdmissionsdata: pendingAdmissions
            }
        });

    } catch (error) {

        console.error("Error in GetInstituteAdmissions:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// =========================================
// SWITCHING DASHBOARDS
// =========================================
export const switchDashBoard = async (req, res) => {
    try {

        const { ServiceId } = req.body;

        const { AdminEmail, role } = req.token;

        if (role !== "admin") {
            return res.json({
                success: false,
                message: "Unauthorized."
            });
        }

        if (!ServiceId) {
            return res.json({
                success: false,
                message: "ServiceId required."
            });
        }

        /* =====================================================
           ðŸ”¥ Find Admin
        ===================================================== */

        const admin = await Admins.findOne({
            AdminEmail: AdminEmail
        }).lean();

        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found."
            });
        }

        /* =====================================================
           ðŸ”¥ Find Selected Service
        ===================================================== */

        const selectedService = admin.Services?.find(
            s => s.ServiceId.toString() === ServiceId.toString()
        );

        if (!selectedService) {
            return res.json({
                success: false,
                message: "Invalid service selection."
            });
        }

        /* =====================================================
           ðŸ”¥ Dynamic Service Model Selection
        ===================================================== */

        const ServiceModel = await getServiceModel(
            selectedService.ServiceType
        );

        if (!ServiceModel) {
            return res.json({
                success: false,
                message: "Unsupported service type."
            });
        }

        const ServiceDta = await ServiceModel.findById(ServiceId).lean();

        if (!ServiceDta) {
            return res.json({
                success: false,
                message: "Service not found."
            });
        }

        /* =====================================================
           ðŸ”¥ Generate New Token
        ===================================================== */

        const token = JWT.sign(
            {
                role: "admin",
                AdminEmail,
                ServiceId: selectedService.ServiceId,
                ServiceType: selectedService.ServiceType,
                ServiceName: selectedService.ServiceName,
                verified: true
            },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("adm_token", token, {
            httpOnly: true,        // Prevents XSS attacks
            secure: true,          // MUST be true for SameSite: None
            sameSite: "None",      // Allows cross-site cookies between Railway and Vercel
            maxAge: 24 * 60 * 60 * 1000, 
            path: "/",
        });

        /* =====================================================
           ðŸ”¥ Other Services List
        ===================================================== */

        const OtherServices = admin.Services.filter(
            s => s.ServiceId.toString() !== ServiceId.toString()
        );

        return res.json({
            success: true,
            role: "admin",
            ServiceType: selectedService.ServiceType,
            ServiceDta,
            OtherServices
        });


    } catch (error) {

        console.error("switchDashBoard error:", error);

        return res.json({
            success: false,
            message: "Something went wrong."
        });
    }
};

// =========================================
// LOGOUT
// =========================================
export const Logout = (req, res) => {
    res.clearCookie("adm_token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });
res.json({ success: true, message: "Logged out successfully." });
};
