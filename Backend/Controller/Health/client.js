import { Specialists, Pharmacies } from "../../Models/HealthModels.js";
import { Appointments } from "../../Models/Appointment.js";
import { Admins } from "../../Models/Admins.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";
import { ObjectId } from "mongodb";
import { appointmentTemplate } from "../../templates/appointmentTemplate.js";
import { sendWhatsAppNotification } from "../../utils/whatsAppSender.js";
import { getPublicIdFromUrl, selectCollection, getServiceModel, getServiceDoc, resolveServiceResource } from "../../HelperFun/helperFun.js";
import JWT from "jsonwebtoken";
import argon2 from "argon2";
import { getCollections } from "../../HelperFun/helperFun.js";




// Public Booking (Specialist)
export const BookAppointmentInternal = async (req, res) => {
    try {
        const { id } = req.params; // Specialist ID
        const { patientName, email, phone, date, time, message, consultationType } = req.body;

        const specialist = await Specialists.findById(id);
        if (!specialist) return res.json({ success: false, message: "Specialist not found" });

        // Backend Validation for Online Consultation Status
        if (consultationType === "ONLINE") {
            const onlineService = specialist.Services?.find(s => s.serviceKey === "ONLINE_CONSULTATION");
            
            // If the service exists and is INACTIVE, reject the booking
            if (onlineService && onlineService.status === "INACTIVE") {
                return res.json({ 
                    success: false, 
                    message: "Online consultation is currently unavailable." 
                });
            }
        }

        const updated = await Specialists.findByIdAndUpdate(
            id,
            {
                $push: {
                    Appointments: { patientName, email, phone, date, time, message, consultationType }
                }
            },
            { new: true }
        );

        return res.json({ success: true, message: "Appointment request sent successfully!" });
    } catch (error) {
        console.error("BookAppointmentInternal error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const AddReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, comment, rating, serviceType } = req.body;
        const { userId } = req.token;

        const Model = serviceType === "Pharmacy" ? Pharmacies : Specialists;

        const provider = await Model.findById(id);
        if (!provider) return res.json({ success: false, message: "Provider not found" });

        // Duplicate Check ⭐
        if (provider.ratingData?.userRatings?.get(userId)) {
            return res.json({ success: false, message: "You have already reviewed this service." });
        }

        // Calculate new rating
        const oldTotal = provider.ratingData?.totalReviews || 0;
        const oldAvg = provider.ratingData?.average || 0;
        const newTotal = oldTotal + 1;
        const newAvg = ((oldAvg * oldTotal) + Number(rating)) / newTotal;

        const updated = await Model.findByIdAndUpdate(
            id,
            {
                $push: { detailedReviews: { user, userId, comment, rating: Number(rating), date: new Date() } },
                $set: {
                    "ratingData.average": newAvg,
                    "ratingData.totalReviews": newTotal,
                    [`ratingData.userRatings.${userId}`]: Number(rating),
                    "basicInfo.ratingData": { average: newAvg, totalReviews: newTotal }
                }
            },
            { new: true }
        );

        return res.json({ 
            success: true, 
            message: "Review added successfully", 
            reviews: updated.detailedReviews, 
            ratingData: updated.ratingData 
        });
    } catch (error) {
        console.error("AddReview error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Public Order (Pharmacy)
export const PlaceOrderInternal = async (req, res) => {
    try {
        const { id } = req.params; // Pharmacy ID
        const { customerName, email, phone, whatsappNumber, message } = req.body;
        const prescriptionFile = req.file;

        // Validation for required fields
        if (!customerName || !phone || !whatsappNumber) {
            return res.json({ success: false, message: "Name, Phone and WhatsApp Number are required" });
        }

        let prescriptionUrl = null;
        if (prescriptionFile) {
            const uploadResult = await uploadToCloudinary(prescriptionFile, "pharmacies/prescriptions");
            prescriptionUrl = uploadResult?.secure_url;
        }

        // Verify Pharmacy exists
        const pharmacy = await Pharmacies.findById(id);
        if (!pharmacy) return res.json({ success: false, message: "Pharmacy not found" });

        const updated = await Pharmacies.findByIdAndUpdate(
            id,
            {
                $push: {
                    Orders: {
                        customerName,
                        email,
                        phone,
                        whatsappNumber,
                        message,
                        prescriptionFile: prescriptionUrl,
                        status: "Pending"
                    }
                }
            },
            { new: true }
        );

        // Send Automated WhatsApp Confirmation to Patient
        const pharmacyName = pharmacy.basicInfo?.pharmacyName || "the Pharmacy";
        const waMessage = `Hello ${customerName}, your medicine order request has been successfully received by ${pharmacyName}. We will review it and update you shortly. Thank you for choosing Digital Kohat Health!`;

        try {
            await sendWhatsAppNotification(whatsappNumber, waMessage);
        } catch (waError) {
            console.error("WhatsApp notification failed for pharmacy order:", waError);
            // Don't fail the whole request just because notification failed
        }

        return res.json({ success: true, message: "Order placed successfully!" });
    } catch (error) {
        console.error("PlaceOrderInternal error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const GetHealthLandingData = async (req, res) => {
    try {
        const { serviceType } = req.body;
        const Model = await getServiceModel(serviceType);
        if (!Model) {
            return res.json({ success: false, message: "Invalid service type" });
        }
        const data = await Model.find({ Status: true }).select("-appointments -orders -patients");
        return res.json({ success: true, data });
    } catch (error) {
        console.error("GetHealthLandingData error:", error);
        return res.json({ success: false, message: "Something went wrong" });
    }
};

export const GetHealthListings = async (req, res) => {
    try {
        const { serviceType } = req.body;
        const Model = await getServiceModel(serviceType);
        if (!Model) {
            return res.json({ success: false, message: "Invalid service type" });
        }
        const data = await Model.find({ Status: true }).select("-appointments -orders -patients");
        return res.json({ success: true, data });
    } catch (error) {
        console.error("GetHealthListings error:", error);
        return res.json({ success: false, message: "Something went wrong" });
    }
};


export const GetHealthDetails = async (req, res) => {
    try {
        const { id, serviceType } = req.body;
        const Model = await getServiceModel(serviceType);
        if (!Model) {
            return res.json({ success: false, message: "Invalid service type" });
        }
        if (!id) {
            return res.json({ success: false, message: "Missing service ID" });
        }
        const data = await Model.findById(id).select("-appointments -orders -patients");
        return res.json({ success: true, data });
    } catch (error) {
        console.error("GetHealthDetails error:", error);
        return res.json({ success: false, message: "Something went wrong" });
    }
};


export const GetPatientAppointments = async (req, res) => {
    try {
        const { userId } = req.token;
        const [pharmacies, specialists] = await Promise.all([
            Pharmacies.find({ "appointments.patientId": userId }, { appointments: 1, ServiceName: 1, ServiceType: 1 }),
            Specialists.find({ "appointments.patientId": userId }, { appointments: 1, ServiceName: 1, ServiceType: 1 })
        ]);

        const allAppointments = [...pharmacies, ...specialists].flatMap(service =>
            service.appointments.filter(app => app.patientId?.toString() === userId.toString())
                .map(app => ({ ...app.toObject(), serviceName: service.ServiceName, serviceType: service.ServiceType }))
        );

        res.json({ success: true, appointments: allAppointments });
    } catch (error) {
        console.error("GetPatientAppointments error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const ReportServiceLanding = async (req, res) => {
    try {
        const { id, reason, details, reporterName } = req.body;
        const ip = (req.socket?.remoteAddress || req.ip).replace("::ffff:", "");

        const report = {
            id: new ObjectId(),
            reporterName: reporterName || "Anonymous",
            reason,
            details,
            ip,
            timestamp: new Date(),
            status: "Pending"
        };
        const foodColl = getCollections(req).FOODS;

        let food = await foodColl.findOne({ _id: new ObjectId(id) });
        if (food) {
            await foodColl.updateOne(
                { _id: new ObjectId(id) },
                {
                    $push: { reports: report },
                    $inc: { reportCount: 1 }
                }
            );
            return res.json({ success: true, message: "Report submitted successfully. We will investigate." });
        }
        return res.json({ success: false, message: "Service not found." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const PlaceOrder = async (req, res) => {
    try {
        const { ORDERS } = getCollections(req);
        const orderData = req.body;

        if (!orderData.serviceId) {
            return res.json({ success: false, message: "Service ID is required." });
        }

        const newOrder = {
            ...orderData,
            serviceId: new ObjectId(orderData.serviceId),
            createdAt: new Date(),
            status: "Pending"
        };

        const result = await ORDERS.insertOne(newOrder);
        res.json({ success: true, message: "Order placed successfully!", orderId: result.insertedId });
    } catch (error) {
        console.error("PlaceOrder error:", error);
        res.json({ success: false, message: "Failed to place order." });
    }
};


