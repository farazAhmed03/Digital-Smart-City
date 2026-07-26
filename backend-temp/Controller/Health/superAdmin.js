import { ObjectId } from "mongodb";
import { validatePlanFeature } from "../../utils/planValidation.js";
import { Admins } from "../../Models/Admins.js";
import { NewServiceRequest } from "../../Models/NewServiceRequest.js";
import { Schools, Colleges } from "../../Models/Schl&ClgSchemeas.js";
import { Specialists, Pharmacies, Emergencies } from "../../Models/HealthModels.js";
import { Appointments } from "../../Models/Appointment.js";
import planLimits from "../../Config/planLimits.js";
import { cleanupHealthServiceImages, deleteImage, deleteMultipleImages } from "../../utils/cloudinaryCleanup.js";
import { sendEmail } from "../../utils/emailSender.js";
import { serviceProviderApprovalTemplate } from "../../templates/serviceProviderApprovalTemplate.js";

export const getServiceModel = (type) => {
    const map = {
        SCHOOL: Schools,
        COLLEGE: Colleges,
        SPECIALIST: Specialists,
        PHARMACY: Pharmacies,
        EMERGENCY: Emergencies
    };

    return map[type] || null;
};

const getHealthModel = (type) => {
    const map = {
        PHARMACY: Pharmacies,
        SPECIALIST: Specialists
    };
    return map[type] || null;
};

export const CreateHealthCataAdmin = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;
        const isAuth = role === "SUPER_ADMIN" || (role === "SAManager" && (accessTo === "Health" || accessTo === "All"));

        if (!isAuth) return res.json({ success: false, message: "Not authorized." });

        const { AdminName, AdminEmail, ServiceName, ServiceLocation, ServiceType, PaymentPlan, reqId } = req.body;
        if (!AdminName || !AdminEmail || !ServiceName || !ServiceType || !PaymentPlan || !reqId) {
            return res.json({ success: false, message: "All fields required" });
        }

        const planStartDate = new Date();
        const planEndDate = new Date();
        planEndDate.setDate(planEndDate.getDate() + 30);

        const reqData = await NewServiceRequest.findById(reqId);
        if (!reqData) return res.json({ success: false, message: "Request not found" });

        const HealthModel = getHealthModel(ServiceType);
        if (!HealthModel) return res.json({ success: false, message: "Invalid Health Service Type" });

        let admin = await Admins.findOne({
            $or: [{ AdminEmail: AdminEmail }, { email: AdminEmail }]
        });

        // ROLE UPGRADE LOGIC: Transform user to admin if needed
        if ((admin && admin.role?.toLowerCase() === "user") || (admin && admin.role === undefined)) {
            await Admins.updateOne(
                { _id: admin._id },
                {
                    $set: {
                        role: "admin",
                        AdminName: AdminName,
                        AdminEmail: AdminEmail,
                        AdminPassword: admin.password || admin.AdminPassword,
                        location: admin.address || "",
                        phonenumber: reqData.phonenumber || admin.phone || "",
                        whatsappnumber: reqData.whatsappnumber || "",
                        Verified: true,
                        Status: true,
                        PaymentPlan: PaymentPlan,
                        PlanStartDate: planStartDate,
                        PlanExpiry: planEndDate,
                        Services: [],
                        Managers: []
                    }
                }
            );
            // Refresh admin object
            admin = await Admins.findById(admin._id);
        }
        if (admin) {
            const featureCheck = validatePlanFeature(admin, admin.Services?.length > 0 ? "Multiple Institutes" : "Management System");
            if (!featureCheck.allowed) return res.json({ success: false, message: featureCheck.message });

            const plan = admin.PaymentPlan || "FREE";
            const limits = planLimits[plan];
            if (limits && (admin.Services?.length || 0) >= limits.institutes) {
                return res.json({ success: false, message: `Limit reached for ${plan} plan.` });
            }
        }

        // Dates defined at top of function

        if (!admin) {
            admin = await Admins.create({
                AdminName,
                AdminEmail,
                AdminPassword: reqData.AdminPassword,
                role: "ADMIN",
                Status: true,
                Verified: true,
                phonenumber: reqData.phonenumber,
                whatsappnumber: reqData.whatsappnumber,
                PaymentPlan,
                PlanStartDate: planStartDate,
                PlanExpiry: planEndDate,
            });
        }

        const serviceDoc = await HealthModel.create({
            AdminId: admin._id,
            ServiceType,
            basicInfo: {
                adminName: AdminName,
                serviceName: ServiceName,
                specialization: req.body?.Specialization || "",
                address: ServiceLocation,
            },
            Status: true,
            PaymentPlan,
            PlanStartDate: planStartDate,
            PlanExpiry: planEndDate
        });

        await Admins.findByIdAndUpdate(admin._id, {
            $set: {
                phonenumber: admin.phonenumber || reqData.phonenumber || admin.phone || "",
                whatsappnumber: admin.whatsappnumber || reqData.whatsappnumber || ""
            },
            $push: {
                Services: {
                    ServiceId: serviceDoc._id,
                    ServiceName,
                    ServiceType,
                    Sector: "HEALTH",
                    ServiceStatus: true
                }
            }
        });

        // Send confirmation email
        const emailHtml = serviceProviderApprovalTemplate(AdminName, ServiceName, "HEALTH");
        await sendEmail({
            to: AdminEmail,
            subject: "Your Service Provider Request has been Approved! - Digital Kohat",
            html: emailHtml
        });

        await NewServiceRequest.deleteOne({ _id: reqData._id });

        return res.json({ success: true, message: "Health Admin and Service created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const RetriveHealthRequests = async (req, res) => {
    try {
        if (req.token.role !== "SUPER_ADMIN" && req.token.AccessTo !== "Health") {
            return res.json({ success: false, message: "Not authorized." });
        }
        const data = await NewServiceRequest.aggregate([
            { $match: { catagory: "Health" } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "email",
                    foreignField: "AdminEmail",
                    as: "adminInfo"
                }
            },
            {
                $addFields: {
                    PaymentPlan: { $arrayElemAt: ["$adminInfo.PaymentPlan", 0] },
                    address: { $ifNull: ["$location", "$address", ""] } // Standardize address field
                }
            },
            {
                $project: {
                    adminInfo: 0
                }
            }
        ]);
        res.json({ success: true, ResponseData: data });
    } catch (error) {
        console.error("RetriveHealthRequests error:", error);
        res.json({ success: false, ResponseData: [] });
    }
};

export const RetriveHealthTabDataForSP = async (req, res) => {
    try {
        const { dataOf } = req.body;
        const Model = getHealthModel(dataOf);
        if (!Model) return res.json({ success: false });

        const formattedData = await getUpdatedHealthData(req, dataOf);
        res.json({ success: true, ResponseData: formattedData });
    } catch (error) {
        console.error("RetriveHealthTabDataForSP Error:", error);
        res.status(500).json({ success: false, ResponseData: [] });
    }
};

export const getUpdatedHealthData = async (req, type) => {
    const Model = getHealthModel(type);
    if (!Model) return [];

    const services = await Model.aggregate([
        { $addFields: { adminObjectId: { $toObjectId: "$AdminId" } } },
        { $lookup: { from: "Accounts", localField: "adminObjectId", foreignField: "_id", as: "adminInfo" } },
        { $unwind: { path: "$adminInfo", preserveNullAndEmptyArrays: true } }
    ]);

    return services.map(srv => ({
        adminId: srv.AdminId,
        adminName: srv.adminInfo?.AdminName || srv.adminInfo?.fullName || srv.basicInfo?.adminName || "Unknown",
        serviceId: srv._id,
        serviceName: srv?.basicInfo?.serviceName || srv.basicInfo?.pharmacyName || srv.ServiceType,
        serviceType: srv.ServiceType,
        serviceStatus: srv.Status,
        PaymentPlan: srv.adminInfo?.PaymentPlan || srv.PaymentPlan || "FREE",
        specialization: srv.basicInfo?.specialization,
        subscriptionStatus: srv.SubscriptionStatus,
        experience: srv.basicInfo?.experience,
        planExpiry: srv.adminInfo?.PlanExpiry || srv.PlanExpiry,
        location: srv?.basicInfo?.address || srv?.basicInfo?.location || srv.adminInfo?.location || srv.adminInfo?.address || "",
        rating: srv.ratingData?.average || 0,
        whatsapp: srv.adminInfo?.whatsappnumber || srv.adminInfo?.whatsapp || srv.basicInfo?.whatsapp || "",
        phonenumber: srv.adminInfo?.phonenumber || srv.adminInfo?.phone || srv.basicInfo?.phonenumber || "",
        email: srv.adminInfo?.AdminEmail || srv.adminInfo?.email || "",
        verified: srv.adminInfo?.Verified || srv.verified || false
    }));
};

export const GetHealthNotificationCounts = async (req, res) => {
    try {
        const requestsCount = await NewServiceRequest.countDocuments({ catagory: "Health" });
        res.json({ success: true, requestsCount });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const ChangeHealthAdminVerificationState = async (req, res) => {
    try {
        const { adminId, serviceType } = req.body;
        let admin = await Admins.findById(adminId);
        if (!admin) {
            admin = await Admins.findOne({ _id: adminId });
        }
        if (!admin) return res.json({ success: false, message: "Admin not found." });

        await Admins.updateOne({ _id: adminId }, { $set: { Verified: !admin.Verified } });

        let typeToRefresh = serviceType;
        if (!typeToRefresh && admin.Services?.length > 0) {
            const healthSvc = admin.Services.find(s => s.Sector === "HEALTH");
            if (healthSvc) typeToRefresh = healthSvc.ServiceType;
        }

        if (typeToRefresh) {
            const updatedData = await getUpdatedHealthData(req, typeToRefresh);
            return res.json({ success: true, message: "Admin verification status updated ✅", ResponseData: updatedData });
        }

        res.json({ success: true, message: "Admin verification status updated ✅", ResponseData: [] });
    } catch (error) {
        console.error("ChangeHealthAdminVerificationState error:", error);
        res.status(500).json({ success: false, message: "Failed to update verification status", ResponseData: [] });
    }
};

export const ChangeHealthServiceState = async (req, res) => {
    try {
        const { adminId, serviceId, serviceType } = req.body;
        const Model = getHealthModel(serviceType);
        const service = await Model.findById(serviceId);
        if (!service) return res.json({ success: false, message: "Service not found." });
        const newState = !service.Status;
        await Model.updateOne({ _id: serviceId }, { $set: { Status: newState } });
        await Admins.updateOne(
            { _id: adminId, "Services.ServiceId": new ObjectId(serviceId) },
            { $set: { "Services.$.ServiceStatus": newState } }
        );
        const updatedData = await getUpdatedHealthData(req, serviceType);
        res.json({ success: true, message: "Service status updated ✅", ResponseData: updatedData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update service status", ResponseData: [] });
    }
};

export const DeleteTheHealthService = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (role !== "SUPER_ADMIN" && accessTo !== "Health" && accessTo !== "All") {
            return res.json({ success: false, message: "Not authorized." });
        }

        const { adminId, serviceType, serviceId } = req.body;
        const Model = getHealthModel(serviceType);

        if (!Model) {
            return res.json({ success: false, message: "Invalid service type." });
        }

        // Robust admin lookup: try findById first, then try findOne by ID string
        let AdminData = await Admins.findById(adminId);
        if (!AdminData) {
            AdminData = await Admins.findOne({ _id: adminId });
        }

        if (!AdminData) {
            return res.json({ success: false, message: "Admin not found." });
        }

        const service = await Model.findById(serviceId);
        if (service) {
            await cleanupHealthServiceImages(service, serviceType);
        }

        const remainingServices = AdminData.Services.filter(
            (v) => v.ServiceId.toString() !== serviceId.toString()
        );

        await Model.deleteOne({ _id: serviceId });

        const db = req.app.locals.db;
        const OrdersColl = db.collection(process.env.ORDERS_C || "Orders");

        // 1. Cleanup Appointments
        await Appointments.deleteMany({ ServiceId: new ObjectId(serviceId) });

        // 2. Cleanup Orders
        const healthOrders = await OrdersColl.find({ serviceId: new ObjectId(serviceId) }).toArray();
        for (const order of healthOrders) {
            if (order.prescriptionFile) {
                await deleteImage(order.prescriptionFile);
            }
        }
        await OrdersColl.deleteMany({ serviceId: new ObjectId(serviceId) });

        // 3. Cleanup Service Requests
        const serviceRequests = await NewServiceRequest.find({
            email: AdminData.AdminEmail,
            catagory: "Health"
        });

        for (const request of serviceRequests) {
            if (request.IDCard) {
                await deleteImage(request.IDCard);
            }
        }
        await NewServiceRequest.deleteMany({ email: AdminData.AdminEmail, catagory: "Health" });

        const updatedData = await getUpdatedHealthData(req, serviceType);
        if (remainingServices.length > 0) {
            await Admins.updateOne(
                { _id: AdminData._id },
                { $set: { Services: remainingServices } }
            );
            res.json({ success: true, message: "Service and its associated records deleted ✅", ResponseData: updatedData });
        } else {
            if (AdminData.IDCard) {
                await deleteImage(AdminData.IDCard);
            }
            await Admins.deleteOne({ _id: AdminData._id });
            res.json({ success: true, message: "Service, related records, and admin account permanently deleted ✅", ResponseData: updatedData });
        }
    } catch (error) {
        console.error("DeleteTheHealthService error:", error);
        res.status(500).json({ success: false, message: "Internal server error", ResponseData: [] });
    }
};

export const UpdateHealthServicePlan = async (req, res) => {
    try {
        const { adminId, serviceId, newPlan, serviceType } = req.body;
        const Model = getHealthModel(serviceType);

        let admin = await Admins.findById(adminId);
        if (!admin) {
            admin = await Admins.findOne({ _id: adminId });
        }
        if (!admin) return res.json({ success: false, message: "Admin not found." });

        const now = new Date();
        let expiry = null;
        if (newPlan === "FREE") expiry = new Date(now.setDate(now.getDate() + 30));
        else if (newPlan === "BASIC" || newPlan === "PREMIUM") expiry = new Date(now.setFullYear(now.getFullYear() + 1));

        await Model.updateOne({ _id: serviceId }, { $set: { PaymentPlan: newPlan, PlanExpiry: expiry, PlanStartDate: Date.now() } });
        await Admins.updateOne(
            { _id: adminId, "Services.ServiceId": new ObjectId(serviceId) },
            {
                $set: {
                    "Services.$.PaymentPlan": newPlan,
                    "Services.$.PlanExpiry": expiry,
                    "Services.$.PlanStartDate": now,
                    PaymentPlan: newPlan,
                    PlanExpiry: expiry,
                    PlanStartDate: now
                }
            }
        );
        const updatedData = await getUpdatedHealthData(req, serviceType);
        res.json({ success: true, message: "Plan updated", ResponseData: updatedData });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const DeleteHealthRequest = async (req, res) => {
    try {
        const { reqId } = req.body;
        if (!reqId) {
            return res.status(400).json({
                success: false,
                message: "Request ID is required."
            });
        }

        const request = await NewServiceRequest.findById(reqId);
        if (request && request.IDCard) {
            await deleteImage(request.IDCard);
        }
        await NewServiceRequest.deleteOne({ _id: new ObjectId(reqId) });

        // Return updated list
        const updatedData = await NewServiceRequest.aggregate([
            { $match: { catagory: "Health" } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "email",
                    foreignField: "AdminEmail",
                    as: "adminInfo"
                }
            },
            {
                $addFields: {
                    PaymentPlan: { $arrayElemAt: ["$adminInfo.PaymentPlan", 0] },
                    address: { $ifNull: ["$location", "$address", ""] }
                }
            },
            { $project: { adminInfo: 0 } }
        ]).toArray();

        return res.status(200).json({
            success: true,
            message: "Request deleted successfully ✅",
            ResponseData: updatedData
        });

    } catch (error) {
        console.error("DeleteHealthRequest Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            ResponseData: []
        });
    }
};