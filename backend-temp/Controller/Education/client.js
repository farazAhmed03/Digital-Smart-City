import { io } from "../../index.js";
import { ObjectId } from "mongodb";
import { selectCollection } from "../../HelperFun/helperFun.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { checkPlanLimit, validatePlanFeature } from "../../utils/planValidation.js";

export const NewInstAdmssnReqFun = async (req, res) => {
    try {

        const {
            studentName,
            fatherName,
            email,
            phone,
            WhatsAppNum,
            targetClass,
            previousSchool,
            address,
            id,
            Coll
        } = req.body;

        /* =====================================================
           Validation
        ===================================================== */

        if (!studentName || !fatherName || !email || !id) {
            return res.json({
                success: false,
                message: "Required fields are missing"
            });
        }

        if (!req.files || !req.files[0]) {
            return res.json({
                success: false,
                message: "Payment screenshot is required"
            });
        }

        const NewAdmissionColl = selectCollection(req, "NewAdmission");
        const InstituteColl = selectCollection(req, Coll);
        const AdminColl = selectCollection(req, "Admins");

        /* =====================================================
           Duplicate Admission Check
        ===================================================== */

        const admissionExist = await NewAdmissionColl.findOne({
            studentName,
            fatherName,
            InstId: id,
            email
        });

        if (admissionExist) {
            return res.json({
                success: false,
                message: "Request already exists."
            });
        }

        /* =====================================================
           Upload Screenshot
        ===================================================== */

        let uploadResult;

        try {
            uploadResult = await uploadToCloudinary(
                req.files[0],
                "admissions"
            );
        } catch (uploadError) {
            return res.json({
                success: false,
                message: "Screenshot upload failed, Check your internet connection"
            });
        }

        /* =====================================================
           Fetch Institute Data Snapshot
        ===================================================== */

        const institute = await InstituteColl.findOne({
            _id: new ObjectId(id)
        });

        /* =====================================================
           Fetch Admin Data Snapshot
        ===================================================== */

        let admin = null;

        if (institute?.AdminId) {
            admin = await AdminColl.findOne({
                _id: new ObjectId(institute.AdminId)
            })
        }

        /* =====================================================
           Plan Feature & Limit Validation (Using Admin Plan) ⭐
        ===================================================== */
        const featureCheck = validatePlanFeature(admin || institute, "Online Admission");
        if (!featureCheck.allowed) {
            return res.json({
                success: false,
                message: featureCheck.message
            });
        }

        const currentAdmissionsCount = await NewAdmissionColl.countDocuments({ InstId: id });
        const limitCheck = checkPlanLimit(admin || institute, 'onlineAdmissions', currentAdmissionsCount);

        if (!limitCheck.allowed) {
            return res.json({
                success: false,
                message: limitCheck.message
            });
        }

        /* =====================================================
           Admission Document (Combined Snapshot)
        ===================================================== */

        const admissionObj = {
            studentName,
            fatherName,
            email,
            phone,
            WhatsAppNum,
            targetClass,
            previousSchool: previousSchool || "",
            address: address || "",
            InstId: id,

            paymentScreenshot: uploadResult.secure_url,
            status: "pending",

            /* ---------- Institute Snapshot ---------- */

            instituteSnapshot: {
                instituteId: institute?._id || null,
                instituteName: institute?.ServiceName || "Unknown Institute",
                instituteStatus: institute?.Status ?? null,
                serviceType: institute?.ServiceType ?? null
            },

            /* ---------- Admin Snapshot ---------- */

            adminSnapshot: {
                adminName: admin?.AdminName || null,
                adminEmail: admin?.AdminEmail || null,
                adminWhatsapp: admin?.whatsappnumber || null,
                adminPhone: admin?.phonenumber || null,
                adminLocation: admin?.location || null,
                adminIDCard: admin?.IDCard || null,
                adminVerified: admin?.Verified ?? null
            },

            createdAt: new Date()
        };

        /* =====================================================
           Insert Admission Record
        ===================================================== */

        await NewAdmissionColl.insertOne(admissionObj);

        /* =====================================================
   Real-time Notification ⭐
===================================================== */

        if (io) {
            io.to("superadmin").emit("new_notification", {
                type: "NEW_ADMISSION_REQUEST",
                message: `New ADMISSION request from ${studentName}`,
                createdAt: new Date(),
                data: {
                    email,
                    studentName,
                    WhatsAppNum,
                    targetClass,
                    phone
                }
            });

            io.emit("education_admission_request_created", {
                studentName,
                email
            });
        }

        return res.json({
            success: true,
            message: "Admission request submitted successfully"
        });

    } catch (error) {

        console.error("ApplyAdmission error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};