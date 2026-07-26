import { Specialists, Pharmacies } from "../../Models/HealthModels.js";
import { Appointments } from "../../Models/Appointment.js";
import { Admins } from "../../Models/Admins.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { deleteImage } from "../../utils/cloudinaryCleanup.js";
import { appointmentTemplate } from "../../templates/appointmentTemplate.js";
import { sendEmail } from "../../utils/emailSender.js";
import { sendWhatsAppNotification } from "../../utils/whatsAppSender.js";
import { getSectorFromType, getServiceModel } from "../../HelperFun/helperFun.js";
import JWT from "jsonwebtoken";
import argon2 from "argon2";

/**
 * HEALTH ADMIN AUTH & DASHBOARD
 */

export const HealthAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password required" });
        }

        const admin = await Admins.findOne({
            $or: [
                { AdminEmail: email },
                { "Managers.ManagerEmail": email }
            ]
        });

        if (!admin) return res.json({ success: false, message: "Invalid email or password" });

        // ADMIN LOGIN
        if (admin.AdminEmail === email) {
            const valid = await argon2.verify(admin.AdminPassword, password);
            if (!valid) return res.json({ success: false, message: "Invalid email or password" });

            const preferredSector = req.body.sector?.toString().trim().toUpperCase() || "HEALTH";
            const matchedService = admin.Services?.find(s => {
                const sSector = s.Sector || getSectorFromType(s.ServiceType);
                return sSector === preferredSector;
            });

            if (!matchedService) {
                return res.json({ success: false, message: "Invalid email or password" });
            }

            const sector = matchedService.Sector || getSectorFromType(matchedService.ServiceType);

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

        // MANAGER LOGIN
        const matchedManager = admin.Managers?.find(m => m.ManagerEmail === email);
        if (!matchedManager) return res.json({ success: false, message: "Invalid email or password" });

        const validManager = await argon2.verify(matchedManager.password, password);
        if (!validManager) return res.json({ success: false, message: "Invalid email or password" });

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
            httpOnly: true,        // Prevents XSS attacks
            secure: true,          // MUST be true for SameSite: None 
            sameSite: "None",      // Allows cross-site cookies between Railway and Vercel
            maxAge: 24 * 60 * 60 * 1000, 
            path: "/",
        });

        return res.json({
            success: true,
            role: "manager",
            ServiceType: matchedManager.ServiceType,
            sector: sector,
            ShowSwitchTab: false
        });
    } catch (error) {
        console.error("HealthAdminLogin error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export const HealthAdminLogout = (req, res) => {
    res.clearCookie("adm_token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });
    return res.json({ success: true, message: "Logged out" });
};

export const UpdateProfile = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const updateData = {};

        // Handle basicInfo and about if sent as strings (via FormData)
        let basicInfo = req.body.basicInfo;
        let about = req.body.about;

        if (typeof basicInfo === "string") basicInfo = JSON.parse(basicInfo);
        if (typeof about === "string") about = JSON.parse(about);

        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;
        const currentData = await Model.findById(ServiceId).select("basicInfo");

        if (!currentData) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // Handle Logo Upload if present
        if (req.file) {
            // File Size Validation
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (req.file.size > MAX_FILE_SIZE) {
                return res.status(400).json({ success: false, message: "Image too large (max 5MB)" });
            }

            const oldImageUrl = currentData?.basicInfo?.img;
            if (oldImageUrl) {
                await deleteImage(oldImageUrl);
            }

            // Upload new image
            try {
                const uploadResult = await uploadToCloudinary(req.file, "specialists/photos");
                if (uploadResult && uploadResult.secure_url) {
                    if (!basicInfo) basicInfo = {};
                    basicInfo.img = uploadResult.secure_url;
                    console.log("Profile image upload successful.");
                }
            } catch (uploadError) {
                console.error("Profile image upload failed:", uploadError);
            }
        } else if (basicInfo?.img && currentData?.basicInfo?.img && basicInfo.img !== currentData.basicInfo.img) {
            await deleteImage(currentData.basicInfo.img);
        }

        if (basicInfo) {
            for (let key in basicInfo) {
                updateData[`basicInfo.${key}`] = basicInfo[key];
            }
        }
        if (about) {
            if (typeof about === "string") {
                updateData.About = about;
            } else {
                for (let key in about) {
                    updateData[`about.${key}`] = about[key];
                }
            }
        }

        const updated = await Model.findByIdAndUpdate(
            ServiceId,
            { $set: updateData },
            { new: true }
        );

        return res.json({ success: true, message: "Profile updated", data: updated });
    } catch (error) {
        console.error("UpdateProfile error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const GetHealthDashboardData = async (req, res) => {
    try {
        const { ServiceId, AdminEmail, ServiceType, role } = req.token; 

        const admin = await Admins.findOne({ AdminEmail }, { Services: 1, Verified: 1, PaymentPlan: 1, PlanExpiry: 1, SubscriptionStatus: 1 });

        if (!admin) return res.json({ success: false, message: "Admin not found" });

        const Model = await getServiceModel(ServiceType?.toUpperCase());
        if (!Model) return res.json({ success: false, message: "Invalid service type" });

        let serviceData = await Model.findById(ServiceId);

        if (!serviceData) return res.json({ success: false, message: "Service data not found" });

        // Ensure Default "Online Consultation" for Specialists
        if (ServiceType === "SPECIALIST") {
            const hasDefault = serviceData.Services?.some(s => s.serviceKey === "ONLINE_CONSULTATION");
            if (!hasDefault) {
                const defaultService = {
                    title: "Online Consultation",
                    serviceKey: "ONLINE_CONSULTATION",
                    description: "Virtual medical consultation via video or audio call.",
                    price: 1000,
                    duration: "30 mins",
                    isDefault: true,
                    status: "ACTIVE"
                };
                serviceData = await Model.findByIdAndUpdate(
                    ServiceId,
                    { $push: { Services: { $each: [defaultService], $position: 0 } } }, // Add to top
                    { new: true }
                );
            }
        }

        // Filter services for non-admin roles (Managers)
        const filteredServices = role === "admin" ? admin.Services : [];

        return res.json({
            success: true,
            role: role || "admin",
            OtherServices: filteredServices,
            data: {
                ...serviceData.toObject(),
                PaymentPlan: admin.PaymentPlan,
                PlanExpiry: admin.PlanExpiry,
                SubscriptionStatus: admin.SubscriptionStatus
            }
        });
    } catch (error) {
        console.error("GetHealthDashboardData error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const GetServices = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const specialist = await Specialists.findById(ServiceId).select("Services");

        if (!specialist) return res.json({ success: false, message: "Specialist not found" });

        let services = specialist.Services || [];

        // Automatically create Online Consultation service if it doesn't exist (for Specialists)
        if (ServiceType === "SPECIALIST") {
            const hasOnlineConsultation = services.some(s => s.serviceKey === "ONLINE_CONSULTATION");
            if (!hasOnlineConsultation) {
                const defaultService = {
                    title: "Online Consultation",
                    serviceKey: "ONLINE_CONSULTATION",
                    description: "Virtual medical consultation via video or audio call.",
                    price: 1000,
                    duration: "30 mins",
                    isDefault: true,
                    status: "ACTIVE"
                };
                
                const updated = await Specialists.findByIdAndUpdate(
                    ServiceId,
                    { $push: { Services: defaultService } },
                    { new: true }
                ).select("Services");
                
                services = updated.Services;
            }
        }

        return res.json({
            success: true,
            services: services
        });
    } catch (error) {
        console.error("GetServices error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const AddService = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const { title, description, price, duration, icon } = req.body;

        if (!title) return res.json({ success: false, message: "Title is required" });

        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;
        const field = ServiceType === "SPECIALIST" ? "Services" : "services";

        const updated = await Model.findByIdAndUpdate(
            ServiceId,
            {
                $push: {
                    [field]: { title, description, price, duration, icon }
                }
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Service added",
            services: updated[field]
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdateService = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const { id } = req.params;
        const { title, description, price, duration, icon, status } = req.body;

        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;
        const field = ServiceType === "SPECIALIST" ? "Services" : "services";
        const queryField = `${field}._id`;
        const setField = `${field}.$.`;

        // Check if it's a default service to protect the title
        const specialist = await Model.findById(ServiceId).select(field);
        const serviceToUpdate = specialist?.[field]?.find(s => s._id.toString() === id);

        const updateData = {
            [`${setField}description`]: description,
            [`${setField}price`]: price,
            [`${setField}duration`]: duration,
            [`${setField}icon`]: icon,
        };

        if (status) {
            updateData[`${setField}status`] = status;
        }

        // Only update title if NOT a default service
        if (!serviceToUpdate?.isDefault) {
            updateData[`${setField}title`] = title;
        }

        const updated = await Model.findOneAndUpdate(
            { _id: ServiceId, [queryField]: id },
            { $set: updateData },
            { new: true }
        );

        if (!updated) return res.json({ success: false, message: "Service not found" });

        return res.json({ success: true, message: "Service updated", services: updated[field] });
    } catch (error) {
        console.error("UpdateService error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const DeleteService = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const { id } = req.params;

        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;
        const field = ServiceType === "SPECIALIST" ? "Services" : "services";

        // Prevent deletion of default services
        const specialist = await Model.findById(ServiceId).select(field);
        const serviceToDelete = specialist?.[field]?.find(s => s._id.toString() === id);
        
        if (serviceToDelete?.isDefault) {
            return res.json({ success: false, message: "Default services cannot be deleted" });
        }

        const updated = await Model.findByIdAndUpdate(
            ServiceId,
            { $pull: { [field]: { _id: id } } },
            { new: true }
        );

        return res.json({ success: true, message: "Service deleted", services: updated[field] });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const AddEducation = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { degree, institution, year } = req.body;

        const updated = await Specialists.findByIdAndUpdate(
            ServiceId,
            { $push: { education: { degree, institution, year } } },
            { new: true }
        );

        return res.json({ success: true, message: "Education added", education: updated.education });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdateEducation = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;
        const { degree, institution, year } = req.body;

        const updated = await Specialists.findOneAndUpdate(
            { _id: ServiceId, "education._id": id },
            {
                $set: {
                    "education.$.degree": degree,
                    "education.$.institution": institution,
                    "education.$.year": year
                }
            },
            { new: true }
        );

        return res.json({ success: true, message: "Education updated", education: updated.education });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const DeleteEducation = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;

        const updated = await Specialists.findByIdAndUpdate(
            ServiceId,
            { $pull: { education: { _id: id } } },
            { new: true }
        );

        return res.json({ success: true, message: "Education deleted", education: updated.education });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdateTimings = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const { timings } = req.body;

        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;

        const updated = await Model.findByIdAndUpdate(
            ServiceId,
            { $set: { Timings: timings } },
            { new: true }
        );

        return res.json({ success: true, message: "Timings updated", timings: updated.Timings });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const GetAppointments = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const appointments = await Appointments.find({ ServiceId: ServiceId }).sort({ AppointmentDate: -1 });

        return res.json({
            success: true,
            appointments
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdateAppointmentStatus = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;
        const { status, appointmentNumber, appointmentTime, meetingLink } = req.body;

        const updateFields = { "Appointments.$.status": status };
        if (appointmentNumber) updateFields["Appointments.$.appointmentNumber"] = appointmentNumber;
        if (appointmentTime) updateFields["Appointments.$.time"] = appointmentTime;
        if (meetingLink) updateFields["Appointments.$.meetingLink"] = meetingLink;

        const updated = await Specialists.findOneAndUpdate(
            { _id: ServiceId, "Appointments._id": id },
            { $set: updateFields },
            { new: true }
        );

        if (status === "Confirmed") {
            const appointment = updated.Appointments.find(app => app._id.toString() === id);
            if (appointment) {
                const patientName = appointment.patientName;
                const patientEmail = appointment.email;
                const patientPhone = appointment.phone;
                const doctorName = updated.basicInfo?.adminName || "Specialist";
                const date = appointment.date;
                const finalTime = appointmentTime || appointment.time;
                const finalAppNum = appointmentNumber || "N/A";
                const consType = appointment.consultationType || "IN-CLINIC";
                const mLink = meetingLink || appointment.meetingLink;

                // Send Email
                const emailHtml = appointmentTemplate(patientName, doctorName, date, finalTime, finalAppNum, consType, mLink);
                await sendEmail({
                    to: patientEmail,
                    subject: "Appointment Confirmation - Digital Kohat Health",
                    html: emailHtml
                });

                // Send WhatsApp Notification
                let waMessage = `Hello ${patientName}, your appointment with Dr. ${doctorName} is confirmed for ${date} at ${finalTime}. Your appointment number is ${finalAppNum}. Type: ${consType}.`;
                if (consType === "ONLINE" && mLink) {
                    waMessage += ` Join Meeting: ${mLink}`;
                }
                waMessage += ` Thank you!`;

                await sendWhatsAppNotification(patientPhone, waMessage);
            }
        }

        return res.json({ success: true, message: "Appointment status updated", appointments: updated.Appointments });
    } catch (error) {
        console.error("UpdateAppointmentStatus error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const DeleteAppointmentInternal = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;

        const updated = await Specialists.findByIdAndUpdate(
            ServiceId,
            { $pull: { Appointments: { _id: id } } },
            { new: true }
        );

        return res.json({ success: true, message: "Appointment deleted", appointments: updated.Appointments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const DeleteReview = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const { id } = req.params;

        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;

        const updated = await Model.findByIdAndUpdate(
            ServiceId,
            { $pull: { Reviews: { _id: id } } },
            { new: true }
        );

        if (!updated) return res.json({ success: false, message: "Provider not found" });

        return res.json({ success: true, message: "Review deleted", reviews: updated.Reviews });
    } catch (error) {
        console.error("DeleteReview error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdatePharmacyProfile = async (req, res) => {
    try {
        const { ServiceId } = req.token;

        // When using FormData, objects are often sent as JSON strings
        let basicInfo = req.body.basicInfo;
        let about = req.body.about;

        if (typeof basicInfo === "string") basicInfo = JSON.parse(basicInfo);
        if (typeof about === "string") about = JSON.parse(about);

        const updateData = {};
        const currentData = await Pharmacies.findById(ServiceId).select("basicInfo");

        if (!currentData) {
            return res.status(404).json({ success: false, message: "Pharmacy not found" });
        }

        // Handle Logo Upload if present
        if (req.file) {
            // File Size Validation
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (req.file.size > MAX_FILE_SIZE) {
                return res.status(400).json({ success: false, message: "Logo too large (max 5MB)" });
            }

            const folder = req.file.fieldname === "doctorLogo" ? "specialists/photos" : "pharmacies/logos";
            
            // Delete old logo if it exists (sequential)
            const oldLogoUrl = currentData?.basicInfo?.img;
            if (oldLogoUrl) {
                await deleteImage(oldLogoUrl);
            }

            // Upload new logo
            try {
                const uploadResult = await uploadToCloudinary(req.file, folder);
                if (uploadResult && uploadResult.secure_url) {
                    if (!basicInfo) basicInfo = {};
                    basicInfo.img = uploadResult.secure_url;
                    console.log("Pharmacy logo upload successful.");
                }
            } catch (uploadError) {
                console.error("Pharmacy logo upload failed:", uploadError);
            }
        } else if (basicInfo?.img && currentData?.basicInfo?.img && basicInfo.img !== currentData.basicInfo.img) {
            await deleteImage(currentData.basicInfo.img);
        }

        if (basicInfo) {
            for (let key in basicInfo) {
                updateData[`basicInfo.${key}`] = basicInfo[key];
            }
        }
        if (about) {
            for (let key in about) {
                updateData[`about.${key}`] = about[key];
            }
        }

        const updated = await Pharmacies.findByIdAndUpdate(
            ServiceId,
            { $set: updateData },
            { new: true }
        );

        return res.json({ success: true, message: "Profile updated", data: updated });
    } catch (error) {
        console.error("UpdatePharmacyProfile error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const GetMedicines = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const pharmacy = await Pharmacies.findById(ServiceId).select("Medicines");

        if (!pharmacy) return res.json({ success: false, message: "Pharmacy not found" });

        return res.json({
            success: true,
            medicines: pharmacy.Medicines || []
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const AddMedicine = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { name, category, price, stock } = req.body;

        if (!name || !price) return res.json({ success: false, message: "Name and Price are required" });

        const pharmacy = await Pharmacies.findByIdAndUpdate(
            ServiceId,
            { $push: { Medicines: { name, category, price, stock } } },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Medicine added",
            medicines: pharmacy.Medicines
        });
    } catch (error) {
        console.error("AddMedicine error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdateMedicine = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;
        const { name, category, price, stock } = req.body;

        const updated = await Pharmacies.findOneAndUpdate(
            { _id: ServiceId, "Medicines._id": id },
            {
                $set: {
                    "Medicines.$.name": name,
                    "Medicines.$.category": category,
                    "Medicines.$.price": price,
                    "Medicines.$.stock": stock
                }
            },
            { new: true }
        );

        if (!updated) return res.json({ success: false, message: "Medicine not found" });
        return res.json({ success: true, message: "Medicine updated", medicines: updated.Medicines });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const DeleteMedicine = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;

        const updated = await Pharmacies.findByIdAndUpdate(
            ServiceId,
            { $pull: { Medicines: { _id: id } } },
            { new: true }
        );

        if (!updated) return res.json({ success: false, message: "Pharmacy not found" });
        return res.json({ success: true, message: "Medicine deleted", medicines: updated.Medicines });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdateOrderStatus = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Pharmacies.findOneAndUpdate(
            { _id: ServiceId, "Orders._id": id },
            { $set: { "Orders.$.status": status } },
            { new: true }
        );

        if (!updated) return res.json({ success: false, message: "Order not found" });

        return res.json({ success: true, message: "Order status updated", orders: updated.Orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const DeleteOrder = async (req, res) => {
    try {
        const { ServiceId } = req.token;
        const { id } = req.params;

        const pharmacy = await Pharmacies.findById(ServiceId).select("Orders");
        const order = pharmacy?.Orders?.find(o => o._id.toString() === id.toString());
        if (order && order.prescriptionFile) {
            await deleteImage(order.prescriptionFile);
        }

        const updated = await Pharmacies.findByIdAndUpdate(
            ServiceId,
            { $pull: { Orders: { _id: id } } },
            { new: true }
        );

        return res.json({ success: true, message: "Order deleted", orders: updated.Orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const UpdateStaff = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const { staff } = req.body;
        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;

        const currentData = await Model.findById(ServiceId).select("staff");
        const oldStaff = currentData?.staff || [];
        const newStaff = JSON.parse(staff);

        await Model.findByIdAndUpdate(ServiceId, { $set: { staff: newStaff } });

        /* =====================================================
           Image Cleanup (Remove orphaned staff images) ⭐
        ===================================================== */
        const oldImages = oldStaff.map(s => s.image || s.img).filter(Boolean);
        const newImages = newStaff.map(s => s.image || s.img).filter(Boolean);
        const imagesToDelete = oldImages.filter(img => !newImages.includes(img));

        if (imagesToDelete.length > 0) {
            console.log(`Cleaning up ${imagesToDelete.length} orphaned health staff images...`);
            await deleteMultipleImages(imagesToDelete);
        }

        res.json({ success: true, message: "Staff updated" });
    } catch (error) {
        console.error("UpdateStaff Error:", error);
        res.status(500).json({ success: false });
    }
};

export const UpdateGallery = async (req, res) => {
    try {
        const { ServiceId, ServiceType } = req.token;
        const Model = ServiceType === "SPECIALIST" ? Specialists : Pharmacies;
        const files = req.files || [];
        const imageUrls = [];
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                console.log(`Gallery image ${file.originalname} too large, skipping.`);
                continue;
            }
            try {
                console.log(`Uploading gallery image: ${file.originalname}...`);
                const result = await uploadToCloudinary(file, "Health/gallery");
                if (result && result.secure_url) {
                    imageUrls.push(result.secure_url);
                    console.log("Gallery image upload successful.");
                }
            } catch (uploadError) {
                console.error("Gallery image upload failed:", uploadError);
            }
        }

        if (imageUrls.length > 0) {
            await Model.findByIdAndUpdate(ServiceId, { $push: { Gallery: { $each: imageUrls } } });
        }
        res.json({ success: true, message: "Gallery updated" });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};