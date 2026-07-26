import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { sendOtpEmail } from "../../utils/sendOtpEmail.js";
import { io } from "../../index.js";
import { NewServiceRequest } from "../../Models/NewServiceRequest.js";
import { Users } from "../../Models/User.js";
import { Admins } from "../../Models/Admins.js";
import { PendingServiceRequest } from "../../Models/PendingServiceRequest.js";
import { selectCollection } from "../../HelperFun/helperFun.js";


export const ServiceProviderRegistrationController = async (req, res) => {
    try {
        const {
            email,
            fullname,
            phonenumber,
            whatsappnumber,
            IDCard,
            password,
            language,
            address,
            category,
            type
        } = req.body;

        if (!email || !fullname || !phonenumber || !IDCard || !password || !whatsappnumber || !address || !category || !type) {
            return res.json({ success: false, message: "Required fields are missing." });
        }

        /* =====================================================
           🔥 Unified Account Check & Restriction Layer
        ===================================================== */
        const emailTrim = email.toLowerCase().trim();
        // Search in the unified Accounts collection for ANY account with this email
        const existingAccount = await Users.findOne({
            $or: [{ email: emailTrim }, { AdminEmail: emailTrim }]
        });

        // RESTRICTION RULE: Privileged accounts cannot use public SPRegForm
        if (existingAccount && (existingAccount.role?.toLowerCase() === "admin" || existingAccount.role === "SUPER_ADMIN")) {
            return res.json({
                success: false,
                message: "Registered service providers must submit requests via the dashboard to ensure secure processing."
            });
        }

        // DUPLICATE CHECK: Email, Category, and Type (in NRs/PSRs)
        const reqExists = await NewServiceRequest.findOne({
            email: emailTrim,
            catagory: category,
            type: type
        });
        const pendingReqExists = await PendingServiceRequest.findOne({
            email: emailTrim,
            category: category,
            type: type
        });

        if (reqExists || pendingReqExists) {
            return res.json({ success: false, message: "Request for this service already exists." });
        }

        if (existingAccount) {
            // Existing USER - Auto-verify and submit request
            const hashpassword = await argon2.hash(password);
            const requestObj = {
                email,
                fullname,
                phonenumber,
                whatsappnumber,
                location: address,
                IDCard,
                language,
                AdminPassword: hashpassword,
                status: 'pending',
                isEmailVerified: true,
                catagory: category,
                type: type,
                source: "PUBLIC",
                createdAt: new Date()
            };

            await NewServiceRequest.create(requestObj);

            const io = req.app.get("socketio");
            if (io) {
                io.to("superadmin").emit("new_notification", {
                    type: "NEW_SERVICE_REQUEST",
                    message: `New ${category} service request from ${fullname} (Auto-verified)`,
                    createdAt: new Date(),
                    data: { email, fullname, phonenumber, IDCard, category, type }
                });
            }

            return res.json({
                success: true,
                message: "Request submitted successfully (Email auto-verified) ✅."
            });

        } else {
            // Email NOT found - Verification Required
            const otpSize = 6;
            const otp = Math.floor(Math.pow(10, otpSize - 1) + Math.random() * (Math.pow(10, otpSize) - Math.pow(10, otpSize - 1) - 1)).toString();
            const otpHash = await argon2.hash(otp);

            // Temporarily store in PendingServiceRequests
            await PendingServiceRequest.deleteOne({ email: email.toLowerCase().trim() }); // Clear old requests
            await PendingServiceRequest.create({
                email: email.toLowerCase().trim(),
                fullname,
                phonenumber,
                whatsappnumber,
                location: address,
                IDCard,
                language,
                AdminPassword: password,
                category,
                type,
                otpHash,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            });

            // Send OTP
            const emailSent = await sendOtpEmail(email, otp);
            if (!emailSent) {
                return res.json({ success: false, message: "Failed to send verification email." });
            }

            return res.json({
                success: true,
                verificationRequired: true,
                message: "A verification code has been sent to your email. 📩"
            });
        }

    } catch (error) {
        console.log("ServiceProviderRegistrationController Error:", error);
        return res.json({ success: false, message: "Something went wrong." });
    }
};

export const AuthenticatedServiceProviderRequest = async (req, res) => {
    try {
        console.log("Line 142 in commonCont.js in AuthenticatedServiceProviderRequest req.body = ", req.body);
        console.log("Line 142 in commonCont.js in AuthenticatedServiceProviderRequest req.token = ", req.token);
        const { category, type, serviceName, serviceLocation, message } = req.body;
        const { AdminEmail, id, AdminId, userId } = req.token;
        const accountId = id || AdminId || userId;

        if (!category || !type) {
            return res.json({ success: false, message: "Category and Type are required." });
        }

        /* =====================================================
           Fetch Full Admin Data from Unified Accounts (Native Driver)
        ===================================================== */
        const AccountColl = req.app.locals.db.collection("Accounts");
        const account = await AccountColl.findOne({
            $or: [
                { _id: accountId ? new ObjectId(accountId) : null },
                { email: AdminEmail },
                { AdminEmail: AdminEmail }
            ].filter(query => Object.values(query)[0] !== null)
        });

        if (!account) {
            console.error("Account not found for request:", { accountId, AdminEmail });
            return res.json({ success: false, message: "Account not found." });
        }

        // Check if request already exists for this email/cat/type
        const reqExists = await NewServiceRequest.findOne({
            email: account.AdminEmail || account.email,
            catagory: category,
            type: type
        });

        if (reqExists) {
            return res.json({ success: false, message: "A request for this service is already pending." });
        }

        if (account.PaymentPlan === "BASIC" || (account.PaymentPlan === "PREMIUM" && account.Services.length === 3)) {
            return res.json({ success: false, message: "This plan is does not support the feaure." });
        }

        console.log("Account = ", account);
        /* =====================================================
           Create Service Request using Existing Identity
        ===================================================== */
        const requestObj = {
            email: account.AdminEmail || account.email || "",
            fullname: account.fullName || account.AdminName || "Admin",
            phonenumber: account.phone || account.phonenumber || "",
            whatsappnumber: account.whatsappnumber || account.phone || account.phonenumber || "",
            location: account.location || account.address || "Kohat",
            IDCard: account.IDCard || account.idCard || null,
            language: account.language || "Pashto",
            AdminPassword: account.AdminPassword || account.password,
            status: 'pending',
            PaymentPlan: account.PaymentPlan || "FREE",
            existingSectors: [...new Set((account.Services || []).map(s => s.Sector).filter(Boolean))],
            isEmailVerified: true,
            catagory: category,
            type: type,
            newServiceDetails: {
                name: serviceName || "",
                location: serviceLocation || "",
                message: message || ""
            },
            source: "AUTHENTICATED_ADMIN",
            createdAt: new Date()
        };

        await NewServiceRequest.create(requestObj);

        // Notify Super Admin
        const io = req.app.get("socketio");
        if (io) {
            io.to("superadmin").emit("new_notification", {
                type: "NEW_SERVICE_REQUEST",
                message: `New ${category} service request from ${requestObj.fullname} (Authenticated)`,
                createdAt: new Date(),
                data: { email: requestObj.email, fullname: requestObj.fullname, category, type }
            });
        }

        return res.json({
            success: true,
            message: "Service request submitted successfully! Our team will review it shortly. ✅"
        });

    } catch (error) {
        console.error("AuthenticatedServiceProviderRequest Error:", error);
        return res.json({ success: false, message: "Server error while processing request." });
    }
};

export const VerifyServiceProviderOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required." });
        }

        const pendingReq = await PendingServiceRequest.findOne({ email: email.toLowerCase().trim() });

        if (!pendingReq) {
            return res.json({ success: false, message: "Verification session expired. Please register again." });
        }

        const isValid = await argon2.verify(pendingReq.otpHash, otp);

        if (!isValid) {
            return res.json({ success: false, message: "Invalid OTP code." });
        }

        // Move to NewServiceRequest
        const hashpassword = await argon2.hash(pendingReq.AdminPassword);
        const requestObj = {
            email: pendingReq.email,
            fullname: pendingReq.fullname,
            phonenumber: pendingReq.phonenumber,
            whatsappnumber: pendingReq.whatsappnumber,
            location: pendingReq.location,
            IDCard: pendingReq.IDCard,
            language: pendingReq.language,
            AdminPassword: hashpassword,
            status: 'pending',
            isEmailVerified: true,
            catagory: pendingReq.category,
            type: pendingReq.type,
            createdAt: new Date()
        };

        await NewServiceRequest.create(requestObj);
        await PendingServiceRequest.deleteOne({ _id: pendingReq._id });

        // Notify superadmin
        if (io) {
            io.to("superadmin").emit("new_notification", {
                type: "NEW_SERVICE_REQUEST",
                    message: `New ${pendingReq.category} service request from ${pendingReq.fullname} (Email verified)`,
                    createdAt: new Date(),
                    data: { email: pendingReq.email, fullname: pendingReq.fullname, category: pendingReq.category, type: pendingReq.type }
                });
        }

        return res.json({
            success: true,
            message: "Email verified and request submitted successfully! ✅"
        });

    } catch (error) {
        console.error("VerifyServiceProviderOtp Error:", error);
        return res.json({ success: false, message: "Something went wrong." });
    }
};


export const ChangeRatingData = async (req, res) => {
    try {

        const { rating, id, coll, name, comment } = req.body;
        const userId = req.token.userId;

        /* =====================================================
           Validation
        ===================================================== */

        if (!rating || !id || !userId) {
            return res.json({
                success: false,
                message: "Invalid data or not logged in"
            });
        }

        const ratingNumber = Number(rating);

        if (ratingNumber < 1 || ratingNumber > 5) {
            return res.json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        /* =====================================================
           Collection Protection Layer ⭐
           Prevent client-controlled collection access
        ===================================================== */

        const ServiceColl = selectCollection(req, coll);

        /* =====================================================
           ObjectId Validation
        ===================================================== */

        if (!ObjectId.isValid(id)) {
            return res.json({
                success: false,
                message: "Invalid institute id"
            });
        }

        /* =====================================================
           Check Institute Exists
        ===================================================== */

        const institute = await ServiceColl.findOne(
            { _id: new ObjectId(id) },
            {
                projection: {
                    ratingData: 1
                }
            }
        );

        if (!institute) {
            return res.json({
                success: false,
                message: "Institute not found"
            });
        }

        /* =====================================================
           Duplicate Rating Protection ⭐
        ===================================================== */

        if (institute.ratingData?.userRatings?.[userId]) {
            return res.json({
                success: false,
                message: "You have already rated this institute"
            });
        }

        /* =====================================================
           Initialize ratingData if NULL ⭐
        ===================================================== */

        await ServiceColl.updateOne(
            {
                _id: new ObjectId(id),
                ratingData: null
            },
            {
                $set: {
                    ratingData: {
                        totalStars: 0,
                        totalReviews: 0,
                        average: 0,
                        userRatings: {}
                    },
                    detailedReviews: []
                }
            }
        );

        /* =====================================================
           Now Safe Atomic Rating Update ⭐
        ===================================================== */

        const reviewObj = {
            id: new ObjectId(),
            userId,
            name: name || "Verified User",
            rating: ratingNumber,
            comment: comment || "",
            date: new Date()
        };

        const updateResult = await ServiceColl.updateOne(
            { _id: new ObjectId(id) },
            {
                $inc: {
                    "ratingData.totalStars": ratingNumber,
                    "ratingData.totalReviews": 1
                },
                $set: {
                    [`ratingData.userRatings.${userId}`]: ratingNumber
                },
                $push: {
                    detailedReviews: reviewObj
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return res.json({
                success: false,
                message: "Rating update failed"
            });
        }

        /* =====================================================
           Recalculate Average ⭐
        ===================================================== */

        const updatedInstitute = await ServiceColl.findOne(
            { _id: new ObjectId(id) },
            {
                projection: {
                    ratingData: 1
                }
            }
        );

        if (updatedInstitute?.ratingData) {

            const rd = updatedInstitute.ratingData;

            if (rd.totalReviews > 0) {
                rd.average = rd.totalStars / rd.totalReviews;

                await ServiceColl.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            ratingData: rd
                        }
                    }
                );
            }
        }

        return res.json({
            success: true,
            ratingData: updatedInstitute.ratingData,
            detailedReviews: updatedInstitute.detailedReviews || []
        });

    } catch (error) {

        console.error("ChangeRatingData error:", error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

export const GettingServiceCardsData = async (req, res) => {
    try {

        const { coll } = req.body;

        /* =====================================================
           Collection Security Layer ⭐
        ===================================================== */

        const allowedCollections = {
            SCHOOL: process.env.S_C,
            COLLEGE: process.env.C_C,
            SPECIALIST: process.env.SP_C,
            PHARMACY: process.env.PH_C,
            EMERGENCY: process.env.EM_C
        };

        const ServiceColl = selectCollection(req, coll);
        const AdminColl = selectCollection(req, "Admins");

        /* =====================================================
           Fetch Active Services ⭐
        ===================================================== */

        const services = await ServiceColl.find({
            Status: true
        }).toArray();

        if (!services.length) {
            return res.json({
                success: true,
                serviceCards: []
            });
        }

        /* =====================================================
           Batch Fetch Approved Admins ⭐ (Performance Boost)
        ===================================================== */

        const serviceIds = services.map(s =>
            new ObjectId(s._id)
        );

        const admins = await AdminColl.find({
            Verified: true,
            "Services.ServiceId": {
                $in: serviceIds
            }
        }).project({
            Services: 1
        }).toArray();

        /* =====================================================
           Build Lookup Map ⭐ (Fast Matching)
        ===================================================== */

        const approvedServiceSet = new Set();

        admins.forEach(admin => {
            admin.Services?.forEach(service => {
                approvedServiceSet.add(
                    String(service.ServiceId)
                );
            });
        });

        /* =====================================================
           Filter Approved Services ⭐
        ===================================================== */

        const serviceCards = services
            .filter(service =>
                approvedServiceSet.has(String(service._id))
            )
            .map(service => ({
                img: service.basicInfo?.bannerUrl || service.basicInfo?.img || service.basicInfo?.pharmacyLogo || service.aboutImage || "/placeholder.jpg",
                serviceName: service.ServiceName || service.serviceName || service.basicInfo?.serviceName || service.basicInfo?.pharmacyName || "Unnamed Service",
                serviceType: service.ServiceType || service.type || coll,
                Desc: service.basicInfo?.about || service.about || service.Desc || service.About || "No description available",
                ratingData: service.ratingData || [],
                id: service._id
            }));
        return res.json({
            success: true,
            serviceCards
        });

    } catch (error) {

        console.error("GettingInstCrdDta error:", error);

        return res.json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

export const GettingServiceWholeData = async (req, res) => {
    try {
        let { coll, InstId } = req.body;

        if (coll === "schools") {
            coll = "SCHOOL";
        }

        /* =====================================================
           Collection Security Layer ⭐
        ===================================================== */

        const ServiceColl = selectCollection(req, coll);
        const AdminColl = selectCollection(req, "Admins");

        /* =====================================================
           ObjectId Validation
        ===================================================== */

        if (!ObjectId.isValid(InstId)) {
            return res.json({
                success: false,
                message: "Invalid institute id"
            });
        }

        /* =====================================================
           Admin Verification Check ⭐
        ===================================================== */

        const adminVerified = await AdminColl.findOne(
            {
                "Services.ServiceId": new ObjectId(InstId)
            },
            {
                projection: {
                    Verified: 1,
                    role: 1
                }
            }
        );


        if (!((adminVerified?.role?.toLowerCase() === "admin" || adminVerified?.role === "SUPER_ADMIN") && adminVerified?.Verified)) {
            return res.json({
                success: false,
                serviceData: null,
                message: "Service is under process"
            });
        }

        /* =====================================================
           Fetch Service Data ⭐
        ===================================================== */

        const serviceData = await ServiceColl.findOne(
            { _id: new ObjectId(InstId) }
        );


        if (!serviceData) {
            return res.json({
                success: false,
                serviceData: null,
                message: "Service data not found"
            });
        }

        /* =====================================================
           Response Mapping (Frontend Compatible) ⭐
        ===================================================== */

        return res.json({
            success: true,
            serviceData
        });

    } catch (error) {

        console.error("GettingServiceWholeData error:", error);

        return res.json({
            success: false,
            message: error.message || "Server error"
        });
    }
};