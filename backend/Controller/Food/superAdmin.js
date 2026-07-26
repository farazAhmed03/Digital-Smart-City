import { ObjectId } from "mongodb";
import argon2 from "argon2";
import { getCollections, selectCollection } from "../../HelperFun/helperFun.js";
import { deleteImage, cleanupFoodServiceImages } from "../../utils/cloudinaryCleanup.js";
import { sendEmail } from "../../utils/emailSender.js";
import { serviceProviderApprovalTemplate } from "../../templates/serviceProviderApprovalTemplate.js";

/* =========================================================
   CREATE FOOD ADMIN
========================================================= */

export const CreateFoodCataAdmin = async (req, res) => {
    try {
        if (req.token.role === "SUPER_ADMIN" || (req.token.role === "SAManager" && req.token.AccessTo === "Food")) {

            const {
                AdminName,
                AdminEmail,
                AdminIDCard,
                ServiceName,
                ServiceLocation,
                ServiceType, // Assuming "RESTAURANT" or similar
                PaymentPlan,
                reqId
            } = req.body;

            if (!AdminName || !AdminEmail || !ServiceName || !ServiceType || !PaymentPlan) {
                return res.json({ success: false, message: "All fields required" });
            }

            const { ADMINS, NRs } = getCollections(req);
            const FOODS = selectCollection(req, "Food");

            // Unified Account Search
            let admin = await ADMINS.findOne({
                $or: [{ AdminEmail: AdminEmail }, { email: AdminEmail }]
            });

            const now = new Date();
            const expiry = new Date(now);
            expiry.setDate(expiry.getDate() + 30);

            let adminId;
            let responseMessage = "";
            let isNewAdmin = false;

            // Handle existing admin/user or create new ID
            if (admin) {
                adminId = admin._id;
                if (admin.role === "admin") {
                    const exists = admin.Services?.some(
                        s => s.ServiceName === ServiceName && s.ServiceType === ServiceType
                    );
                    if (exists) {
                        return res.json({ success: false, message: "Service already exists for this admin" });
                    }
                    responseMessage = "Service added to existing admin";
                } else {
                    responseMessage = "User account upgraded to Food Admin successfully";
                }
            } else {
                adminId = new ObjectId();
                isNewAdmin = true;
                responseMessage = "Food Admin and Service created successfully";
            }

            // Insert into FOODS collection with full schema
            const serviceResult = await FOODS.insertOne({
                ServiceName,
                ServiceType,
                Address: ServiceLocation,
                AdminId: adminId,
                Status: true,
                isActive: true,
                ServiceStatus: true,
                Verified: true,
                PaymentPlan,
                PlanStartDate: now,
                PlanExpiry: expiry,
                createdAt: now,
                categorizedMenu: [],
                lastUpdated: now,
                menu: [],
                menuItems: [],
                about: "best food of kohat",
                contact: { email: "", phone: "", website: "" },
                quickInfo: { basicProfile: { location: "", type: ServiceType } },
                tagline: "har kala rasha ",
                timings: { opening: "" },
                promotions: [],
                aboutImage: "",
                aboutImgUrl: "",
                img: ""
            });

            const serviceObj = {
                ServiceId: serviceResult.insertedId,
                ServiceName,
                ServiceType,
                Sector: "FOOD",
                ServiceStatus: true,
                PaymentPlan
            };

            // Fetch request data from NRs if reqId is provided
            let reqData = null;
            if (reqId) {
                reqData = await NRs.findOne({
                    _id: new ObjectId(reqId),
                    email: AdminEmail
                });
            }

            if (isNewAdmin) {
                // Scenario: Entirely new admin
                const adminObj = {
                    _id: adminId,
                    AdminName,
                    AdminEmail,
                    location: ServiceLocation,
                    whatsappnumber: reqData?.whatsappnumber || "",
                    phonenumber: reqData?.phonenumber || "",
                    IDCard: AdminIDCard,
                    Status: true,
                    AdminPassword: reqData?.AdminPassword,
                    role: "admin",
                    Verified: true,
                    Services: [serviceObj],
                    Managers: [],
                    createdAt: now,
                    updatedAt: now
                };
                await ADMINS.insertOne(adminObj);
            } else {
                // Scenario: Upgrade user OR update existing admin
                const updateQuery = {
                    $set: {
                        role: "admin",
                        AdminName,
                        AdminEmail,
                        location: ServiceLocation,
                        whatsappnumber: reqData?.whatsappnumber || admin.whatsappnumber || "",
                        phonenumber: reqData?.phonenumber || admin.phonenumber || admin.phone || "",
                        IDCard: AdminIDCard,
                        Status: true,
                        AdminPassword: admin.AdminPassword || admin.password || reqData?.AdminPassword,
                        Verified: true,
                        updatedAt: now
                    }
                };

                if (admin.role === "user") {
                    // Reset services for upgraded user
                    updateQuery.$set.Services = [serviceObj];
                } else {
                    // Append service for existing admin
                    updateQuery.$push = { Services: serviceObj };
                }

                await ADMINS.updateOne({ _id: adminId }, updateQuery);
            }

            // Send confirmation email
            const emailHtml = serviceProviderApprovalTemplate(AdminName, ServiceName, "FOOD");
            await sendEmail({
                to: AdminEmail,
                subject: "Your Service Provider Request has been Approved! - Digital Kohat",
                html: emailHtml
            });

            // Cleanup NR request
            if (reqId) {
                await NRs.deleteOne({ _id: new ObjectId(reqId) });
            } else if (reqData) {
                await NRs.deleteOne({ _id: reqData._id });
            }

            const updatedData = await getUpdatedFoodData(req);

            return res.json({
                success: true,
                message: responseMessage,
                ResponseData: updatedData
            });
        } else {
            return res.json({ success: false, message: "Not authorized." });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

/* =========================================================
   DASHBOARD DATA HELPERS
========================================================= */

const getUpdatedFoodData = async (req) => {
    const { FOODS } = getCollections(req);
    if (!FOODS) {
        // Fallback if FOODS is not in getCollections yet
        const db = req.app.locals.db;
        const FOOD_COLL = selectCollection(req, "Food");

        console.log("Fetching Food Data for SP Dashboard via aggregation...");
        const foodServices = await FOOD_COLL.aggregate([
            {
                $addFields: {
                    adminObjectId: { $toObjectId: "$AdminId" }
                }
            },
            {
                $lookup: {
                    from: "Accounts",
                    localField: "adminObjectId",
                    foreignField: "_id",
                    as: "adminInfo"
                }
            },
            {
                $unwind: {
                    path: "$adminInfo",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray();

        return foodServices.map(service => {
            const admin = service.adminInfo || {};
            return {
                adminId: admin._id || service.AdminId,
                adminName: admin.AdminName || admin.fullName || "Unknown Admin",
                InstId: service._id,
                ServiceName: service.ServiceName,
                ServiceType: service.ServiceType,
                PaymentPlan: admin.PaymentPlan || service.PaymentPlan || "FREE",
                planExpiry: admin.PlanExpiry || service.PlanExpiry || null,
                location: admin.location || service.Address || "Kohat",
                email: admin.AdminEmail || admin.email || "",
                whatsapp: admin.whatsappnumber || admin.phone || "",
                phonenumber: admin.phonenumber || "",
                IDCard: admin.IDCard || "",
                status: admin.Status ?? service.Status,
                verified: admin.Verified || false
            };
        });
    }

    // This part runs if FOODS is available in getCollections
    const foodServices = await FOODS.aggregate([
        {
            $addFields: {
                adminObjectId: { $toObjectId: "$AdminId" }
            }
        },
        {
            $lookup: {
                from: "Accounts",
                localField: "adminObjectId",
                foreignField: "_id",
                as: "adminInfo"
            }
        },
        {
            $unwind: {
                path: "$adminInfo",
                preserveNullAndEmptyArrays: true
            }
        }
    ]).toArray();

    return foodServices.map(service => {
        const admin = service.adminInfo || {};
        return {
            adminId: admin._id || service.AdminId,
            adminName: admin.AdminName || admin.fullName || "Unknown Admin",
            InstId: service._id,
            ServiceName: service.ServiceName,
            ServiceType: service.ServiceType,
            PaymentPlan: admin.PaymentPlan || service.PaymentPlan || "FREE",
            planExpiry: admin.PlanExpiry || service.PlanExpiry || null,
            location: admin.location || service.Address || "Kohat",
            email: admin.AdminEmail || admin.email || "",
            whatsapp: admin.whatsappnumber || admin.phone || "",
            phonenumber: admin.phonenumber || "",
            IDCard: admin.IDCard || "",
            status: admin.Status ?? service.Status,
            verified: admin.Verified || false
        };
    });
};


/* =========================================================
   DASHBOARD DATA FOR FOOD
========================================================= */

export const RetriveNewFoodReqs = async (req, res) => {
    try {
        if (req.token.role === "SUPER_ADMIN" || (req.token.role === "SAManager" && req.token.AccessTo === "Food")) {
            const { NRs } = getCollections(req);

            // Fetch requests for Food category
            const requests = await NRs.find(
                { catagory: { $regex: /^food$/i } }, // Case-insensitive filter
                {
                    projection: {
                        fullname: 1,
                        email: 1,
                        whatsappnumber: 1,
                        location: 1,
                        address: 1,
                        IDCard: 1,
                        type: 1,
                        PaymentPlan: 1,
                        phonenumber: 1,
                        status: 1,
                        newServiceDetails: 1,
                        source: 1,
                        existingSectors: 1,
                        createdAt: 1
                    }
                }
            ).toArray();

            // Map for frontend compatibility
            const data = requests.map(r => ({
                ...r,
                address: r.location || r.address || ""
            }));

            res.json({ success: true, ResponseData: data });
        } else {
            return res.json({ success: false, message: "Not authorized." });
        }

    } catch (err) {
        console.error("RetriveNewFoodReqs error:", err);
        res.json({ success: false, ResponseData: [] });
    }
};

export const RetriveFoodDataForSP = async (req, res) => {
    try {
        if (req.token.role === "SUPER_ADMIN" || (req.token.role === "SAManager" && req.token.AccessTo === "Food")) {
            const { ADMINS } = getCollections(req);

            const formattedData = await getUpdatedFoodData(req);

            return res.json({
                success: true,
                ResponseData: formattedData
            });

        } else {
            return res.json({ success: false, message: "Not authorized." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

/* =========================================================
   STATE & DELETE ACTIONS FOR FOOD
========================================================= */

export const ChangeFoodAdminVerificationState = async (req, res) => {
    try {
        if (req.token.role === "SUPER_ADMIN" || (req.token.role === "SAManager" && req.token.AccessTo === "Food")) {
            const { ADMINS } = getCollections(req);
            const { adminId } = req.body;

            const admin = await ADMINS.findOne({ _id: new ObjectId(adminId) });
            if (!admin) return res.json({ success: false });

            await ADMINS.updateOne(
                { _id: admin._id },
                { $set: { Verified: !admin.Verified } }
            );

            const formattedData = await getUpdatedFoodData(req);
            res.json({ success: true, ResponseData: formattedData });
        } else {
            res.json({ success: false, message: "Not authorized." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// =========================================================
//   UPGRADE REQUESTS (FOOD)
// =========================================================

export const GetFoodUpgradeRequests = async (req, res) => {
    try {
        const { ADMINS } = getCollections(req);
        const Food = selectCollection(req, "Food");

        const services = await Food.find({ supportTickets: { $exists: true, $ne: [] } }).project({ supportTickets: 1, ServiceName: 1, Type: 1 }).toArray();

        const requests = [];
        for (const svc of services) {
            const tickets = (svc.supportTickets || []).filter(t => {
                const subj = (t.subject || "").toLowerCase();
                return subj.includes("upgrade") || subj.includes("service_request");
            });
            if (tickets.length) {
                const admin = await ADMINS.findOne({ "Services.ServiceId": svc._id }, { projection: { AdminName: 1, AdminEmail: 1, Services: 1 } });
                tickets.forEach(t => {
                    let parsed = {};
                    try { parsed = JSON.parse(t.message || "{}"); } catch { parsed = {}; }
                    requests.push({
                        requestId: t.id || t._id,
                        serviceId: svc._id,
                        serviceName: svc.ServiceName,
                        serviceType: svc.Type,
                        adminName: admin?.AdminName,
                        adminEmail: admin?.AdminEmail,
                        adminId: parsed.adminId || (admin ? admin._id.toString() : null),
                        requestedPlan: t.message?.match(/upgrade to (\w+)/i)?.[1] || parsed.plan || "",
                        requestType: (t.subject || "").toLowerCase().includes("service_request") ? "service_request" : "upgrade",
                        newService: {
                            name: parsed.serviceName,
                            type: parsed.serviceType,
                            location: parsed.location
                        },
                        subject: t.subject,
                        message: t.message,
                        timestamp: t.timestamp,
                        status: t.status || "Pending"
                    });
                });
            }
        }

        res.json({ success: true, requests });
    } catch (err) {
        console.error("GetFoodUpgradeRequests", err);
        res.json({ success: false, message: "Failed to fetch upgrade requests" });
    }
};

export const ApproveFoodUpgrade = async (req, res) => {
    try {
        const { serviceId, requestId, plan, requestType, newService, adminId } = req.body;
        if (requestType === "service_request") {
            const { ADMINS } = getCollections(req);
            const Food = selectCollection(req, "Food");

            let admin;
            if (adminId) {
                admin = await ADMINS.findOne({ _id: new ObjectId(adminId) });
            } else if (serviceId) {
                admin = await ADMINS.findOne({ "Services.ServiceId": new ObjectId(serviceId) });
            }

            if (!admin || !newService?.name || !newService?.type) {
                return res.json({ success: false, message: "Missing data for service creation. The admin or service details were missing." });
            }

            const oldService = await Food.findOne({ _id: new ObjectId(serviceId) });

            const insertRes = await Food.insertOne({
                ServiceName: newService.name,
                Type: newService.type,
                location: newService.location || oldService?.location || "",
                Banner: oldService?.Banner || "",
                Logo: oldService?.Logo || "",
                Status: true,
                PaymentPlan: plan || "Premium",
                createdAt: new Date()
            });

            const serviceObj = {
                ServiceId: insertRes.insertedId,
                ServiceName: newService.name,
                ServiceType: newService.type,
                Sector: "FOOD",
                ServiceStatus: true,
                PaymentPlan: plan || "Premium"
            };

            await ADMINS.updateOne(
                { _id: admin._id },
                {
                    $push: { Services: serviceObj },
                    $set: {
                        PaymentPlan: plan || "Premium",
                        PlanExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                }
            );

            await Food.updateOne(
                { _id: new ObjectId(serviceId) },
                { $pull: { supportTickets: { $or: [{ id: new ObjectId(requestId) }, { _id: new ObjectId(requestId) }, { subject: /service_request/i }] } } }
            );

            const formattedData = await getUpdatedFoodData(req);
            return res.json({
                success: true,
                message: "Service created and approved successfully ✅",
                ResponseData: formattedData
            });
        }

        if (!serviceId || !plan) return res.json({ success: false, message: "serviceId and plan are required" });

        const { ADMINS } = getCollections(req);
        const Food = selectCollection(req, "Food");

        await Food.updateOne(
            { _id: new ObjectId(serviceId) },
            {
                $set: { PaymentPlan: plan, plan: plan, planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
                $pull: { supportTickets: { $or: [{ id: new ObjectId(requestId) }, { _id: new ObjectId(requestId) }, { subject: /upgrade/i }] } }
            }
        );

        await ADMINS.updateOne(
            { "Services.ServiceId": new ObjectId(serviceId) },
            {
                $set: {
                    "Services.$.PaymentPlan": plan,
                    PaymentPlan: plan,
                    PlanExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            }
        );

        const formattedData = await getUpdatedFoodData(req);
        res.json({ success: true, message: "Plan upgraded", ResponseData: formattedData });
    } catch (err) {
        console.error("ApproveFoodUpgrade", err);
        res.json({ success: false, message: "Failed to approve upgrade" });
    }
};

export const ChangeFoodInstState = async (req, res) => {
    try {
        if (req.token.role === "SUPER_ADMIN" || (req.token.role === "SAManager" && req.token.AccessTo === "Food")) {
            const { ADMINS } = getCollections(req);
            const FOODS = selectCollection(req, "Food");
            const { adminId, InstId } = req.body;

            const admin = await ADMINS.findOne({ _id: new ObjectId(adminId) });
            if (!admin) return res.json({ success: false, message: "Admin not found", ResponseData: [] });

            const newState = !admin.Status;

            await FOODS.updateOne(
                { _id: new ObjectId(InstId) },
                { $set: { Status: newState } }
            );

            await ADMINS.updateOne(
                { _id: admin._id },
                { $set: { Status: newState } }
            );

            const formattedData = await getUpdatedFoodData(req);
            res.json({ success: true, message: `Food service ${newState ? "Activated" : "Deactivated"} successfully ✅`, ResponseData: formattedData });
        } else {
            res.json({ success: false, message: "Not authorized." });
        }
    } catch (error) {
        console.error("ChangeFoodInstState error:", error);
        res.status(500).json({ success: false, message: "Internal server error", ResponseData: [] });
    }
};

export const ChangeFoodAdminPaymentData = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Food")) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { adminId, InstId, newPlan } = req.body;

        if (!adminId || !InstId || !newPlan) {
            return res.status(400).json({
                success: false,
                message: "adminId, InstId, and newPlan are required"
            });
        }

        const { ADMINS } = getCollections(req);
        const FOODS = selectCollection(req, "Food");

        const now = new Date();
        let newExpiryDate = null;

        switch (newPlan) {
            case "FREE":
                newExpiryDate = new Date(new Date().setDate(now.getDate() + 30));
                break;
            case "Premium":
            case "PREMIUM":
                newExpiryDate = new Date(new Date().setFullYear(now.getFullYear() + 1));
                break;
            case "Enterprise":
            case "ENTERPRISE":
                newExpiryDate = null;
                break;
            case "Basic":
            case "BASIC":
                newExpiryDate = new Date(new Date().setFullYear(now.getFullYear() + 1));
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment plan"
                });
        }

        const foodUpdate = await FOODS.updateOne(
            { _id: new ObjectId(InstId) },
            {
                $set: {
                    PaymentPlan: newPlan,
                    plan: newPlan,
                    SubscriptionStatus: "Active",
                    PlanExpiry: newExpiryDate,
                }
            }
        );

        if (foodUpdate.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Food service not found"
            });
        }

        await ADMINS.updateOne(
            { _id: new ObjectId(adminId) },
            {
                $set: {
                    PaymentPlan: newPlan,
                    PlanExpiry: newExpiryDate,
                    PlanStartDate: new Date()
                }
            }
        );

        const formattedData = await getUpdatedFoodData(req);

        return res.status(200).json({
            success: true,
            newPlan,
            newExpiryDate,
            message: `Payment plan changed to ${newPlan} successfully ✅`,
            ResponseData: formattedData
        });

    } catch (error) {
        console.error("ChangeFoodAdminPaymentData Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            ResponseData: []
        });
    }
};

export const DeleteTheFoodInst = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Food")) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { adminId, InstId } = req.body;
        if (!adminId || !InstId) {
            return res.status(400).json({
                success: false,
                message: "adminId and InstId are required"
            });
        }

        const { ADMINS, ORDERS, RESERVATIONS, NRs } = getCollections(req);
        const FOODS = selectCollection(req, "Food");

        const admin = await ADMINS.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const foodService = await FOODS.findOne({ _id: new ObjectId(InstId) });
        if (!foodService) {
            return res.status(404).json({
                success: false,
                message: "Food service not found"
            });
        }

        // Cleanup images
        await cleanupFoodServiceImages(foodService);

        // --- CASCADING CLEANUP ---
        // 1. Delete Service itself
        await FOODS.deleteOne({ _id: new ObjectId(InstId) });

        // 2. Cleanup related records
        await ORDERS.deleteMany({ serviceId: new ObjectId(InstId) });
        await RESERVATIONS.deleteMany({ serviceId: new ObjectId(InstId) });

        // 3. Cleanup New Service Requests for this admin in this sector
        if (admin.AdminEmail) {
            await NRs.deleteMany({ 
                email: admin.AdminEmail, 
                catagory: { $regex: /^food$/i } 
            });
        }

        // --- CASCADING ADMIN CLEANUP ---
        const remainingServices = (admin.Services || []).filter(
            (s) => s.ServiceId.toString() !== InstId.toString()
        );

        if (remainingServices.length === 0) {
            // Delete admin if no services left
            if (admin.IDCard) {
                await deleteImage(admin.IDCard);
            }
            await ADMINS.deleteOne({ _id: admin._id });
        } else {
            // Update admin if other services remain
            await ADMINS.updateOne(
                { _id: admin._id },
                {
                    $set: { Services: remainingServices }
                }
            );
        }

        const formattedData = await getUpdatedFoodData(req);

        return res.status(200).json({
            success: true,
            message: "Operation completed successfully ✅",
            ResponseData: formattedData
        });

    } catch (error) {
        console.error("DeleteTheFoodInst Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const DeleteFoodRequest = async (req, res) => {
    try {
        if (req.token.role === "SUPER_ADMIN" || (req.token.role === "SAManager" && req.token.AccessTo === "Food")) {
            const { NRs } = getCollections(req);
            const { reqId, id } = req.body;
            const targetId = reqId || id;
            await NRs.deleteOne({ _id: new ObjectId(targetId) });

            // Fetch updated requests list
            const requests = await NRs.find(
                { catagory: { $regex: /^food$/i } },
                { projection: { fullname: 1, email: 1, whatsappnumber: 1, location: 1, address: 1, IDCard: 1, type: 1, PaymentPlan: 1, phonenumber: 1, status: 1, newServiceDetails: 1, source: 1, existingSectors: 1, createdAt: 1 } }
            ).toArray();

            const data = requests.map(r => ({ ...r, address: r.location || r.address || "" }));

            res.json({ success: true, message: "Request deleted successfully ✅", ResponseData: data });
        } else {
            res.json({ success: false, message: "Not authorized." });
        }
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const GetFoodNotificationCounts = async (req, res) => {
    try {
        const { NRs } = getCollections(req);
        const requestsCount = await NRs.countDocuments({ catagory: "Food" });
        res.json({ success: true, requestsCount });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
