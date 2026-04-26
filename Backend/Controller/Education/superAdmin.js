import { ObjectId } from "mongodb";
import cloudinary from "../../Config/cloudinary.js";
import { checkPlanLimit, validatePlanFeature } from "../../utils/planValidation.js";
import { getPublicIdFromUrl, selectCollection, getServiceModel } from "../../HelperFun/helperFun.js";
import { Admins } from "../../Models/Admins.js";
import { NewServiceRequest } from "../../Models/NewServiceRequest.js";
import { sendEmail } from "../../utils/emailSender.js";
import { serviceProviderApprovalTemplate } from "../../templates/serviceProviderApprovalTemplate.js";
import { admissionApprovalTemplate } from "../../templates/admissionApprovalTemplate.js";
import planLimits from "../../Config/planLimits.js";
import { deleteImage, cleanupInstituteImages, cleanupAdmissionImages, cleanupAdmissionRecordImages } from "../../utils/cloudinaryCleanup.js";

/* =========================================================
   CREATE EDUCATION ADMIN
========================================================= */

export const CreateEduCataAdmin = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        const isAuth = role === "SUPER_ADMIN" ||
            (role === "SAManager" && (accessTo === "Education"));

        if (!isAuth) {
            return res.json({
                success: false,
                message: "Not authorized."
            });
        }

        const {
            AdminName,
            AdminEmail,
            ServiceName,
            ServiceLocation,
            ServiceType,
            PaymentPlan,
            reqId
        } = req.body;

        if (
            !AdminName ||
            !AdminEmail ||
            !ServiceName ||
            !ServiceType ||
            !PaymentPlan ||
            !reqId
        ) {
            return res.json({
                success: false,
                message: "All fields required"
            });
        }

        const planStartDate = new Date();
        const planEndDate = new Date();
        planEndDate.setDate(planEndDate.getDate() + 30);

        let reqData;
        try {
            reqData = await NewServiceRequest.findById(new ObjectId(reqId));
        } catch (err) {
            console.error("Invalid reqId format:", reqId);
            return res.json({ success: false, message: "Invalid Request ID format" });
        }

        if (!reqData) {
            console.error("NewServiceRequest not found for ID:", reqId);
            return res.json({
                success: false,
                message: "Request not found"
            });
        }

        const ServiceCollection = await getServiceModel(ServiceType);
        if (!ServiceCollection) {
            return res.json({
                success: false,
                message: "Invalid Service Type selected"
            });
        }

        // Optimized unified account search
        let admin = await Admins.findOne({
            $or: [{ AdminEmail: AdminEmail }, { email: AdminEmail }]
        });


        // ROLE UPGRADE LOGIC: Transform user to admin if needed
        let wasUser = false;
        if ((admin && admin.role?.toLowerCase() === "user") || (admin && admin.role === undefined)) {
            wasUser = true;
            await Admins.deleteOne({ _id: admin._id });
            admin = null; // Set to null so that a fresh admin is created below
        }

        if (admin) {
            const featureCheck = validatePlanFeature(admin, admin.Services?.length > 0 ? "Multiple Institutes" : "Online Admission");
            if (!featureCheck.allowed) {
                return res.json({
                    success: false,
                    message: featureCheck.message
                });
            }

            const plan = admin.PaymentPlan || "FREE";
            const limits = planLimits[plan];
            const currentServicesCount = admin.Services?.length || 0;

            if (limits && currentServicesCount >= limits.institutes) {
                return res.json({
                    success: false,
                    message: `Limit reached: ${plan} plan only allows up to ${limits.institutes} institute(s).`
                });
            }
        }

        // Dates defined at top of function

        if (!admin) {
            admin = await Admins.create({
                AdminName,
                AdminEmail: AdminEmail,
                AdminPassword: reqData.AdminPassword,
                role: "ADMIN",
                Status: true,
                Verified: true,
                location: reqData.location || "",
                phonenumber: reqData.phonenumber || "",
                whatsappnumber: reqData.whatsappnumber || "",
                IDCard: reqData.IDCard || "",
                PaymentPlan: PaymentPlan,
                PlanStartDate: planStartDate,
                PlanExpiry: planEndDate,
                pastRole: wasUser ? "user" : null
            });
        }

        const serviceDoc = await ServiceCollection.create({
            ServiceName,
            ServiceType,
            Address: ServiceLocation,
            AdminId: admin._id,
            Status: true,
            isActive: true,
            PaymentPlan,
            PlanStartDate: planStartDate,
            PlanExpiry: planEndDate
        });

        const serviceSnapshot = {
            ServiceId: serviceDoc._id,
            ServiceName,
            ServiceType,
            Sector: "EDUCATION",
            ServiceStatus: true,
        };

        await Admins.findByIdAndUpdate(
            admin._id,
            {
                $push: { Services: serviceSnapshot }
            }
        );


        // Send confirmation email
        const credentialsInstruction = wasUser ? "Use the credentials you provided during service registration to login." : null;
        const emailHtml = serviceProviderApprovalTemplate(AdminName, ServiceName, "EDUCATION", credentialsInstruction);
        await sendEmail({
            to: AdminEmail,
            subject: "Your Service Provider Request has been Approved! - Digital Kohat",
            html: emailHtml
        });

        await NewServiceRequest.deleteOne({ _id: reqData._id });

        return res.json({
            success: true,
            message: "Admin and Service created successfully"
        });

    } catch (err) {
        console.error("CreateEduCataAdmin error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

/* =========================================================
   DASHBOARD DATA HELPERS
========================================================= */

const getUpdatedEduData = async (req, dataOf) => {
    const InstituteModel = await getServiceModel(dataOf);
    if (!InstituteModel) return [];

    const institutions = await InstituteModel.aggregate([
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
    ]);

    return institutions.map(inst => {
        const admin = inst.adminInfo || {};
        return {
            adminId: admin._id || inst.AdminId,
            adminName: admin.AdminName || admin.fullName || "Unknown Admin",
            InstId: inst._id,
            institutionName: inst.ServiceName,
            ServiceType: inst.ServiceType,
            instituteStatus: inst.Status,
            PaymentPlan: admin.PaymentPlan || "FREE",
            subscriptionStatus: inst.SubscriptionStatus || "Active",
            planExpiry: admin.PlanExpiry || inst.PlanExpiry || inst.trialEndDate || null,
            trialEndDate: inst.trialEndDate,
            location: admin.location || inst.Address || "No location info",
            email: admin.AdminEmail || "",
            whatsapp: admin.whatsappnumber || "",
            phonenumber: admin.phonenumber || "",
            IDCard: admin.IDCard || "",
            verified: admin.Verified || false
        };
    });
};

/* =========================================================
   DASHBOARD DATA
========================================================= */

export const RetriveEduTabDataForSP = async (req, res) => {
    try {

        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.json({
                success: false,
                message: "Not authorized."
            });
        }

        const { dataOf } = req.body;

        if (!dataOf) {
            return res.json({
                success: false,
                message: "Service type is required"
            });
        }

        const formattedData = await getUpdatedEduData(req, dataOf);

        return res.json({
            success: true,
            ResponseData: formattedData
        });

    } catch (error) {
        console.error("RetriveEduTabDataForSP Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const RetriveNewAdmissionsForSP = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.json({
                success: false,
                message: "Not authorized."
            });
        }

        if (req.body.dataOf !== "NEW_ADMISSIONS") {
            return res.json({
                success: false,
                message: "Invalid data type"
            });
        }

        const NewAdmissionColl = selectCollection(req, "NewAdmission");
        const SchoolColl = selectCollection(req, "SCHOOL");
        const CollegeColl = selectCollection(req, "COLLEGE");
        const AdminColl = selectCollection(req, "Admins");

        const admissions = await NewAdmissionColl.find(
            { status: "pending" },
            {
                projection: {
                    studentName: 1,
                    fatherName: 1,
                    InstId: 1,
                    email: 1,
                    phone: 1,
                    WhatsAppNum: 1,
                    targetClass: 1,
                    paymentScreenshot: 1,
                    previousSchool: 1,
                    address: 1,
                    instituteSnapshot: 1,
                    adminSnapshot: 1
                }
            }
        ).toArray();

        if (!admissions.length) {
            return res.json({
                success: true,
                ResponseData: []
            });
        }

        const instituteIds = [
            ...new Set(
                admissions.map(a => new ObjectId(a.InstId))
            )
        ];

        const schools = await SchoolColl.find(
            { _id: { $in: instituteIds } },
            {
                projection: {
                    ServiceName: 1,
                    Status: 1,
                    ServiceType: 1
                }
            }
        ).toArray();

        const colleges = await CollegeColl.find(
            { _id: { $in: instituteIds } },
            {
                projection: {
                    ServiceName: 1,
                    Status: 1,
                    ServiceType: 1
                }
            }
        ).toArray();

        const instituteMap = new Map();
        [...schools, ...colleges].forEach(inst => {
            instituteMap.set(String(inst._id), inst);
        });

        const admins = await AdminColl.find(
            { "Services.ServiceId": { $in: instituteIds } },
            {
                projection: {
                    AdminName: 1,
                    AdminEmail: 1,
                    location: 1,
                    whatsappnumber: 1,
                    phonenumber: 1,
                    IDCard: 1,
                    Verified: 1,
                    Services: 1
                }
            }
        ).toArray();

        const adminMap = new Map();
        admins.forEach(admin => {
            admin.Services?.forEach(service => {
                adminMap.set(String(service.ServiceId), admin);
            });
        });

        const ResponseData = admissions.map(admission => {
            const institute = instituteMap.get(String(admission.InstId));
            const admin = adminMap.get(String(admission.InstId));

            return {
                admissionId: admission._id,
                studentName: admission.studentName,
                fatherName: admission.fatherName,
                email: admission.email,
                phone: admission.phone,
                WhatsAppNum: admission.WhatsAppNum,
                targetClass: admission.targetClass,
                previousSchool: admission.previousSchool,
                address: admission.address,
                paymentScreenshot: admission.paymentScreenshot,
                instituteId: admission.InstId,
                instituteName: institute?.ServiceName || "Unknown Institute",
                instituteStatus: institute?.Status ?? null,
                serviceType: institute?.ServiceType ?? null,
                adminId: admin?._id || null,
                adminName: admin?.AdminName || null,
                adminEmail: admin?.AdminEmail || null,
                adminWhatsapp: admin?.whatsappnumber || null,
                adminPhone: admin?.phonenumber || null,
                adminLocation: admin?.location || null,
                adminIDCard: admin?.IDCard || null,
                adminVerified: admin?.Verified ?? null
            };
        });

        return res.json({
            success: true,
            ResponseData
        });

    } catch (error) {
        console.error("RetriveNewAdmissionsForSP error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const getUpdatedNewAdmissionsData = async (req) => {
    const NewAdmissionColl = selectCollection(req, "NewAdmission");
    const SchoolColl = selectCollection(req, "SCHOOL");
    const CollegeColl = selectCollection(req, "COLLEGE");
    const AdminColl = selectCollection(req, "Admins");

    const admissions = await NewAdmissionColl.find({ status: "pending" }).toArray();
    if (!admissions.length) return [];

    const instituteIds = [...new Set(admissions.map(a => new ObjectId(a.InstId)))];
    const institutes = await Promise.all([
        SchoolColl.find({ _id: { $in: instituteIds } }).toArray(),
        CollegeColl.find({ _id: { $in: instituteIds } }).toArray()
    ]);
    const allInsts = institutes.flat();
    const instituteMap = new Map(allInsts.map(i => [String(i._id), i]));

    const admins = await AdminColl.find({ "Services.ServiceId": { $in: instituteIds } }).toArray();
    const adminMap = new Map();
    admins.forEach(admin => {
        admin.Services?.forEach(s => adminMap.set(String(s.ServiceId), admin));
    });

    return admissions.map(admission => {
        const inst = instituteMap.get(String(admission.InstId));
        const admin = adminMap.get(String(admission.InstId));
        return {
            admissionId: admission._id,
            studentName: admission.studentName,
            fatherName: admission.fatherName,
            email: admission.email,
            phone: admission.phone,
            WhatsAppNum: admission.WhatsAppNum,
            targetClass: admission.targetClass,
            previousSchool: admission.previousSchool,
            address: admission.address,
            paymentScreenshot: admission.paymentScreenshot,
            instituteId: admission.InstId,
            instituteName: inst?.ServiceName || "Unknown Institute",
            instituteStatus: inst?.Status ?? null,
            serviceType: inst?.ServiceType ?? null,
            adminId: admin?._id || null,
            adminName: admin?.AdminName || null,
            adminEmail: admin?.AdminEmail || null,
            adminWhatsapp: admin?.whatsappnumber || null,
            adminPhone: admin?.phonenumber || null,
            adminLocation: admin?.location || null,
            adminIDCard: admin?.IDCard || null,
            adminVerified: admin?.Verified ?? null
        };
    });
};

export const CreateSAManager = async (req, res) => {
    try {
        const role = req.token.role;
        if (role !== "SUPER_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { name, email, password, accessTo } = req.body;

        if (!name || !email || !password || !accessTo) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const AdminColl = selectCollection(req, "Admins");
        const admin = await AdminColl.findOne({ _id: new ObjectId(req.token.id) });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const managerObj = {
            Name: name,
            Email: email,
            Password: password,
            AccessTo: accessTo,
            Role: "SAManager",
            createdAt: new Date()
        };

        await AdminColl.updateOne(
            { _id: admin._id },
            {
                $push: { SAManagers: managerObj }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Manager created successfully"
        });

    } catch (error) {
        console.error("CreateSAManager Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const RetriveNewReqs = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const ReqColl = selectCollection(req, "New Service Request");
        const AdminColl = selectCollection(req, "Admins");

        if (!ReqColl) {
            return res.status(500).json({
                success: false,
                message: "New Service Request collection not found"
            });
        }

        const requests = await ReqColl.find(
            { catagory: "Education" },
            {
                projection: {
                    fullname: 1,
                    email: 1,
                    whatsappnumber: 1,
                    location: 1,
                    IDCard: 1,
                    type: 1,
                    language: 1,
                    phonenumber: 1,
                    status: 1,
                    catagory: 1,
                    newServiceDetails: 1,
                    source: 1,
                    existingSectors: 1,
                    createdAt: 1
                }
            }
        ).toArray();

        const data = await Promise.all(
            requests.map(async (reqItem) => {
                const baseData = {
                    ...reqItem,
                    address: reqItem.location || ""
                };

                if (!AdminColl || !reqItem.email) return baseData;
                const admin = await AdminColl.findOne(
                    { $or: [{ AdminEmail: reqItem.email }, { email: reqItem.email }] },
                    {
                        projection: {
                            PaymentPlan: 1,
                            SubscriptionStatus: 1,
                            PlanStartDate: 1,
                            PlanExpiry: 1,
                            trialStartDate: 1,
                            trialEndDate: 1
                        }
                    }
                );

                if (!admin) return baseData;

                return {
                    ...baseData,
                    PaymentPlan: admin.PaymentPlan || "FREE",
                    SubscriptionStatus: admin.SubscriptionStatus || "Active",
                    PlanStartDate: admin.PlanStartDate,
                    PlanExpiry: admin.PlanExpiry,
                    trialStartDate: admin.trialStartDate,
                    trialEndDate: admin.trialEndDate
                };
            })
        );

        return res.status(200).json({
            success: true,
            ResponseData: data
        });

    } catch (error) {
        console.error("RetriveNewReqs Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

/* =========================================================
   STATE & DELETE ACTIONS
========================================================= */

export const ChangeAdminVerificationState = async (req, res) => {
    try {
        if (
            req.token.role !== "SUPER_ADMIN" &&
            !(req.token.role === "SAManager" && req.token.AccessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { adminId } = req.body;
        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "Admin ID is required"
            });
        }

        const AdminColl = selectCollection(req, "Admins");
        const admin = await AdminColl.findOne({
            _id: new ObjectId(adminId)
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const newState = !admin.Verified;
        await AdminColl.updateOne(
            { _id: admin._id },
            {
                $set: {
                    Verified: newState
                }
            }
        );

        // We need the ServiceType to refresh data!
        // For Education sector, we'll try to guess if it's SCHOOL or COLLEGE based on context or just return empty
        // Actually, the frontend calls this for various things.
        // Let's check which sector this is usually used for.
        // If we don't know ServiceType, we might have to return a simple success.
        // But the frontend EductionSection always wants ResponseData.

        // Wait, for verification state, we don't necessarily have a single ServiceType.
        // However, EductionSection calls this.
        // I'll try to find any service for this admin to determine the type.
        let serviceType = "SCHOOL";
        if (admin.Services && admin.Services.length > 0) {
            serviceType = admin.Services[0].ServiceType;
        }

        const formattedData = await getUpdatedEduData(req, serviceType);

        return res.status(200).json({
            success: true,
            newState,
            ResponseData: formattedData
        });

    } catch (error) {
        console.error("ChangeAdminVerificationState Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const ChangeInstState = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { adminId, InstId, ServiceType } = req.body;

        if (!adminId || !InstId || !ServiceType) {
            return res.status(400).json({
                success: false,
                message: "adminId, InstId and ServiceType are required"
            });
        }

        const InstituteColl = selectCollection(req, ServiceType);
        const AdminColl = selectCollection(req, "Admins");

        const institute = await InstituteColl.findOne({
            _id: new ObjectId(InstId)
        });

        if (!institute) {
            return res.status(404).json({
                success: false,
                message: "Institute not found"
            });
        }

        const newInstituteStatus = !institute.Status;
        const newIsActive = newInstituteStatus;

        await InstituteColl.updateOne(
            { _id: new ObjectId(InstId) },
            { $set: { Status: newInstituteStatus, isActive: newIsActive } }
        );

        await AdminColl.updateOne(
            {
                _id: new ObjectId(adminId),
                "Services.ServiceId": new ObjectId(InstId)
            },
            {
                $set: {
                    "Services.$[elem].ServiceStatus": newInstituteStatus,
                }
            },
            {
                arrayFilters: [
                    {
                        "elem.ServiceId": new ObjectId(InstId)
                    }
                ]
            }
        );

        const formattedData = await getUpdatedEduData(req, ServiceType);

        return res.status(200).json({
            success: true,
            message: `Institute ${newIsActive ? "Activated" : "Disabled"} successfully`,
            instituteStatus: newInstituteStatus,
            ResponseData: formattedData
        });

    } catch (error) {
        console.error("ChangeInstState Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const DeleteTheInst = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
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

        const AdminColl = selectCollection(req, "Admins");
        const SchoolColl = selectCollection(req, "SCHOOL");
        const CollegeColl = selectCollection(req, "COLLEGE");

        let admin = await AdminColl.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
            admin = await AdminColl.findOne({ _id: adminId });
        }

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        let institute = await SchoolColl.findOne({ _id: new ObjectId(InstId) });
        let ServiceColl = SchoolColl;

        if (!institute) {
            institute = await CollegeColl.findOne({ _id: new ObjectId(InstId) });
            ServiceColl = CollegeColl;
        }

        if (!institute) {
            return res.status(404).json({
                success: false,
                message: "Institute not found"
            });
        }

        await cleanupInstituteImages(institute);

        await ServiceColl.deleteOne({ _id: new ObjectId(InstId) });

        // --- CASCADING CLEANUP ---
        const NewAdmissionColl = selectCollection(req, "NewAdmission");
        const AdmissionsRecordColl = selectCollection(req, "AdmissionsRecord");
        const NewServiceRequestColl = selectCollection(req, "New Service Request");

        // 1. Cleanup NEWADMISSION_COLL
        const pendingAdmissions = await NewAdmissionColl.find({ InstId: new ObjectId(InstId) }).toArray();
        if (pendingAdmissions.length > 0) {
            await cleanupAdmissionRecordImages(pendingAdmissions);
            await NewAdmissionColl.deleteMany({ InstId: new ObjectId(InstId) });
        }

        // 2. Cleanup ADMISSION_RECORD (Approved)
        const approvedAdmissions = await AdmissionsRecordColl.find({ instituteId: new ObjectId(InstId) }).toArray();
        if (approvedAdmissions.length > 0) {
            await cleanupAdmissionRecordImages(approvedAdmissions);
            await AdmissionsRecordColl.deleteMany({ instituteId: new ObjectId(InstId) });
        }

        // 3. Cleanup New Service Requests
        if (admin.AdminEmail) {
            const serviceRequests = await NewServiceRequestColl.find({
                email: admin.AdminEmail,
                catagory: "Education"
            }).toArray();

            for (const request of serviceRequests) {
                if (request.IDCard) {
                    console.log(`Cleaning up service request IDCard for ${request.email}`);
                    await deleteImage(request.IDCard);
                }
            }
            await NewServiceRequestColl.deleteMany({ email: admin.AdminEmail, catagory: "Education" });
        }

        const remainingServices = (admin.Services || []).filter(
            (s) => s.ServiceId.toString() !== InstId.toString()
        );

        let finalMessage = "Institute and its associated records deleted ✅";

        if (remainingServices.length === 0) {
            if (admin.IDCard) {
                console.log(`Cleaning up Admin IDCard for ${admin.AdminEmail}`);
                await deleteImage(admin.IDCard);
            }
            await AdminColl.deleteOne({ _id: admin._id });
            finalMessage = "Institute, related records, and admin account permanently deleted ✅";
        } else {
            await AdminColl.updateOne(
                { _id: admin._id },
                {
                    $set: { Services: remainingServices }
                }
            );
        }

        const formattedData = await getUpdatedEduData(req, ServiceColl === SchoolColl ? "SCHOOL" : "COLLEGE");

        return res.status(200).json({
            success: true,
            message: finalMessage,
            ResponseData: formattedData
        });

    } catch (error) {
        console.error("DeleteTheInst Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const UpdateServiceProviderRequestStatus = async (req, res) => {
    try {
        const { reqId, status } = req.body;
        if (!reqId || !status) {
            return res.status(400).json({
                success: false,
                message: "Request ID and status are required."
            });
        }

        const ReqColl = selectCollection(req, "New Service Request");
        const result = await ReqColl.updateOne(
            { _id: new ObjectId(reqId) },
            { $set: { status: status } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        if (status === "rejected") {
            const request = await ReqColl.findOne({ _id: new ObjectId(reqId) });
            if (request && request.IDCard) {
                await deleteImage(request.IDCard);
            }
            await ReqColl.deleteOne({ _id: new ObjectId(reqId) });
        }

        return res.status(200).json({
            success: true,
            message: `Request status updated to ${status} successfully`
        });

    } catch (error) {
        console.error("UpdateServiceProviderRequestStatus Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const DeleteRequest = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { reqId, id } = req.body;
        const targetId = reqId || id;

        if (!targetId) {
            return res.status(400).json({
                success: false,
                message: "Request ID required."
            });
        }

        const Coll = selectCollection(req, "New Service Request");
        const result = await Coll.findOne({ _id: new ObjectId(targetId) });
        if (result && result.IDCard) {
            await deleteImage(result.IDCard);
        }
        const delResult = await Coll.deleteOne({ _id: new ObjectId(targetId) });

        if (delResult.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Request deleted successfully"
        });

    } catch (error) {
        console.error("DeleteRequest Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const ChangePaymentPlan = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { adminId, InstId, newPlan, ServiceType } = req.body;

        if (!adminId || !InstId || !newPlan || !ServiceType) {
            return res.status(400).json({
                success: false,
                message: "adminId, InstId, newPlan and ServiceType are required"
            });
        }

        const ServiceColl = selectCollection(req, ServiceType);
        const AdminColl = selectCollection(req, "Admins");

        const now = new Date();
        let newExpiryDate = null;

        switch (newPlan) {
            case "FREE":
                newExpiryDate = new Date(now.setDate(now.getDate() + 30));
                break;
            case "Premium":
            case "PREMIUM":
                newExpiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
                break;
            case "Enterprise":
            case "ENTERPRISE":
                newExpiryDate = null;
                break;
            case "Basic":
            case "BASIC":
                newExpiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment plan"
                });
        }

        const instituteUpdate = await ServiceColl.updateOne(
            { _id: new ObjectId(InstId) },
            {
                $set: {
                    PaymentPlan: newPlan,
                    plan: newPlan,
                    SubscriptionStatus: "Active",
                    PlanExpiry: newExpiryDate
                }
            }
        );

        if (instituteUpdate.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Institute not found"
            });
        }

        await AdminColl.updateOne(
            { _id: new ObjectId(adminId) },
            {
                $set: {
                    PaymentPlan: newPlan,
                    PlanExpiry: newExpiryDate,
                    PlanStartDate: new Date()
                }
            }
        );

        const formattedData = await getUpdatedEduData(req, ServiceType);

        return res.status(200).json({
            success: true,
            newPlan,
            newExpiryDate,
            ResponseData: formattedData
        });

    } catch (error) {
        console.error("ChangePaymentPlan Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const ApproveAdmissionAndForward = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { admissionId } = req.body;

        if (!admissionId || !ObjectId.isValid(admissionId)) {
            return res.status(400).json({
                success: false,
                message: "Valid admissionId is required."
            });
        }

        const NEW_ADMISSIONS = selectCollection(req, "NewAdmission");
        const ADMINS = selectCollection(req, "Admins");
        const SCHOOLS = selectCollection(req, "SCHOOL");
        const COLLEGES = selectCollection(req, "COLLEGE");
        const ADMISSIONS_RECORD = selectCollection(req, "AdmissionsRecord");

        const admission = await NEW_ADMISSIONS.findOne({
            _id: new ObjectId(admissionId)
        });

        if (!admission) {
            return res.status(404).json({
                success: false,
                message: "Admission request not found"
            });
        }

        if (admission.status !== "pending") {
            return res.json({
                success: false,
                message: `Admission request is already ${admission.status}`
            });
        }

        if (!admission.paymentScreenshot) {
            return res.json({
                success: false,
                message: "Payment screenshot is missing"
            });
        }

        let institute = await SCHOOLS.findOne({ _id: new ObjectId(admission.InstId) });
        let serviceType = "SCHOOL";

        if (!institute) {
            institute = await COLLEGES.findOne({ _id: new ObjectId(admission.InstId) });
            serviceType = "COLLEGE";
        }

        if (!institute) {
            return res.json({
                success: false,
                message: "Institute not found"
            });
        }

        const admin = await ADMINS.findOne({
            $or: [
                { "Services.ServiceId": new ObjectId(admission.InstId) },
                { AdminEmail: admission.email },
                { email: admission.email }
            ]
        }, {
            projection: {
                AdminName: 1,
                AdminEmail: 1,
                Verified: 1,
                Status: 1
            }
        });

        if (!admin) {
            return res.json({
                success: false,
                message: "Institute owner admin not found"
            });
        }

        const forwardObj = {
            admissionId: admission._id,
            studentName: admission.studentName,
            fatherName: admission.fatherName,
            email: admission.email,
            phone: admission.phone,
            WhatsAppNum: admission.WhatsAppNum,
            targetClass: admission.targetClass,
            previousSchool: admission.previousSchool || "",
            address: admission.address || "",
            paymentScreenshot: admission.paymentScreenshot,
            status: "approved",
            approvedBy: role,
            approvedAt: new Date(),
            createdAt: admission.createdAt || new Date(),
            instituteId: institute._id,
            instituteName: institute.ServiceName,
            serviceType,
            adminId: admin._id
        };

        await ADMISSIONS_RECORD.insertOne(forwardObj);
        await NEW_ADMISSIONS.deleteOne({ _id: new ObjectId(admissionId) });

        const updatedData = await getUpdatedNewAdmissionsData(req);

        // Send confirmation email
        const emailHtml = admissionApprovalTemplate(admission.studentName, institute.ServiceName, admission.targetClass);
        await sendEmail({
            to: admission.email,
            subject: "Congratulations! Your Admission has been Approved - Digital Kohat",
            html: emailHtml
        });

        return res.json({
            success: true,
            message: "Admission approved and forwarded successfully.",
            ResponseData: updatedData
        });

    } catch (error) {
        console.error("ApproveAdmissionAndForward error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

export const getInstituteRecords = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { adminId, InstId } = req.body;
        if (!adminId || !InstId) {
            return res.status(400).json({
                success: false,
                message: "Missing admin or institution ID."
            });
        }

        if (!ObjectId.isValid(adminId) || !ObjectId.isValid(InstId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format."
            });
        }

        const Coll = selectCollection(req, "AdmissionsRecord");

        let query = {};
        if (ObjectId.isValid(InstId)) {
            query = {
                $or: [
                    { instituteId: new ObjectId(InstId) },
                    { instituteId: String(InstId) }
                ]
            };
        } else {
            query = { instituteId: String(InstId) };
        }

        const records = await Coll.find(query).sort({ approvedAt: -1 }).toArray();

        return res.status(200).json({
            success: true,
            count: records.length,
            ResponseData: records
        });

    } catch (error) {
        console.error("getInstituteRecords Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

export const deleteAdmissionRequest = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { requestId } = req.body;
        if (!requestId || !ObjectId.isValid(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Valid request ID is required."
            });
        }

        const Coll = selectCollection(req, "NewAdmission");
        const request = await Coll.findOne({ _id: new ObjectId(requestId) });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        if (request.paymentScreenshot) {
            await deleteImage(request.paymentScreenshot);
        }

        const deleted = await Coll.deleteOne({ _id: new ObjectId(requestId) });

        if (deleted.deletedCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Request deletion failed."
            });
        }

        const updatedData = await getUpdatedNewAdmissionsData(req);

        return res.status(200).json({
            success: true,
            message: "Admission request deleted successfully.",
            ResponseData: updatedData
        });

    } catch (error) {
        console.error("deleteAdmissionRequest error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

export const deleteAdmissionRecord = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { admissionId } = req.body;
        if (!admissionId || !ObjectId.isValid(admissionId)) {
            return res.status(400).json({
                success: false,
                message: "Valid admission ID is required."
            });
        }

        const Coll = selectCollection(req, "AdmissionsRecord");
        const record = await Coll.findOne({ admissionId: new ObjectId(admissionId) });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Admission record not found."
            });
        }

        if (record.paymentScreenshot) {
            await deleteImage(record.paymentScreenshot);
        }

        const deleted = await Coll.deleteOne({ admissionId: new ObjectId(admissionId) });

        if (deleted.deletedCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Admission record deletion failed."
            });
        }

        const { adminId, InstId } = req.body;
        const updatedRecords = await Coll.find({
            $and: [
                {
                    $or: [
                        { instituteId: new ObjectId(InstId) },
                        { instituteId: String(InstId) }
                    ]
                },
                {
                    $or: [
                        { adminId: new ObjectId(adminId) },
                        { adminId: String(adminId) }
                    ]
                }
            ]
        }).sort({ approvedAt: -1 }).toArray();

        return res.status(200).json({
            success: true,
            message: "Admission record deleted successfully.",
            ResponseData: updatedRecords
        });

    } catch (error) {
        console.error("deleteAdmissionRecord error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

export const GetEducationNotificationCounts = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        if (
            role !== "SUPER_ADMIN" &&
            !(role === "SAManager" && accessTo === "Education")
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const NewAdmissionColl = selectCollection(req, "NewAdmission");
        const NewServiceRequestColl = selectCollection(req, "New Service Request");

        const admissionsCount = await NewAdmissionColl.countDocuments({ status: "pending" });
        const requestsCount = await NewServiceRequestColl.countDocuments({ catagory: "Education" });

        return res.status(200).json({
            success: true,
            admissionsCount,
            requestsCount
        });

    } catch (error) {
        console.error("GetEducationNotificationCounts Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};