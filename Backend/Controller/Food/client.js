// import JWT from "jsonwebtoken";
// import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { selectCollection, getCollections, resolveServiceResource, getServiceDoc } from "../../HelperFun/helperFun.js";



export const GettingFoodCrdDta = async (req, res) => {
    try {
        const foodColl = selectCollection(req, "FOOD");
        // Some older services may not have Status field set; treat missing Status as active
        const services = await foodColl.find(
            { $or: [{ Status: true }, { Status: { $exists: false } }] },
            {
                projection: {
                    ServiceName: 1,
                    Type: 1,
                    ServiceType: 1,
                    aboutImage: 1,
                    ratingData: 1,
                    about: 1,
                    cuisine: 1,
                    priceRange: 1,
                    deliveryAvailable: 1,
                    PaymentPlan: 1
                }
            }
        ).toArray();
        const approvedServices = [];

        const AdminColl = selectCollection(req, "Admins");

        for (const service of services) {
            const approvedAdmin = await AdminColl.findOne(
                {
                    Verified: true,
                    "Services.ServiceId": new ObjectId(service._id)
                },
                {
                    projection: { _id: 1 }
                }
            );

            if (approvedAdmin) {
                approvedServices.push(service);
            }
        }

        const serviceCards = approvedServices.map(service => ({
            img: service.aboutImage || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
            InstName: service.ServiceName,
            serviceType: service.ServiceType || service.Type || "Restaurant",
            Desc: service.about,
            rating: service.ratingData && service.ratingData.length
                ? Number((service.ratingData.reduce((a, b) => a + b, 0) / service.ratingData.length).toFixed(1))
                : 0,
            id: service._id,
            cuisine: service.cuisine || "Multi-cuisine",
            priceRange: service.priceRange || "$$",
            deliveryAvailable: service.deliveryAvailable || true
        }));

        res.json({
            success: true,
            serviceCards,
            message: "Alhumdulilah, Food Data Fetched ......"
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const GettingFoodWholeData = async (req, res) => {
    try {
        const { FoodId } = req.body;
        if (!FoodId || FoodId.length !== 24) {
            return res.json({ success: false, message: "Invalid Food ID provided." });
        }

        const AdminColl = selectCollection(req, "Admins");

        const adminVerified = await AdminColl.findOne(
            { "Services.ServiceId": new ObjectId(FoodId) },
            { projection: { Verified: 1, role: 1 } }
        );

        if ((adminVerified?.role?.toLowerCase() === "admin" || adminVerified?.role === "SUPER_ADMIN") && adminVerified?.Verified) {
            const { collection: foodColl } = await resolveServiceResource(req, "FOOD");
            const serviceData = await foodColl.findOne({ _id: new ObjectId(FoodId), Status: true });


            if (serviceData) {
                res.json({
                    success: true,
                    serviceData: {
                        id: serviceData._id,
                        bannerUrl: serviceData.bannerUrl || serviceData.aboutImage,
                        type: serviceData.ServiceType || serviceData.Type,
                        name: serviceData.ServiceName || serviceData.name,
                        tagline: serviceData.tagline || "Fresh & Delicious",
                        about: serviceData.about,
                        aboutImage: serviceData.aboutImage,
                        menu: serviceData.menu || [],
                        categorizedMenu: serviceData.categorizedMenu || [],
                        quickInfo: {
                            basicProfile: {
                                name: serviceData.ServiceName || serviceData.name,
                                location: serviceData.quickInfo?.basicProfile?.location || serviceData.location || "Kohat, KPK",
                                type: serviceData.ServiceType || serviceData.Type || "Restaurant"
                            },
                            timings: serviceData.timings || serviceData.quickInfo?.timings || { opening: "10:00 AM - 11:00 PM" },
                            facilities: serviceData.quickInfo?.facilities || serviceData.facilities || ["Dine-in", "Takeaway", "Delivery"]
                        },
                        contact: serviceData.contact || { phone: "N/A", email: "N/A" },
                        deliveryAvailability: serviceData.deliveryAvailability || "Available",
                        ratingData: serviceData.ratingData || [],
                        detailedReviews: serviceData.detailedReviews || [],
                        promotions: serviceData.promotions || [],
                        reportCount: serviceData.reportCount || 0,
                        reportStatus: serviceData.reportStatus || "Active",
                        reports: serviceData.reports || [],
                    },
                    message: "Alhumdulilah Food Data Fetched ......"
                });
            } else {
                res.json({
                    success: false,
                    serviceData: null,
                    message: "Food service data not found"
                });
            }
        } else {
            res.json({
                success: false,
                serviceData: null,
                message: "Service is under process"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const ReportServiceLanding = async (req, res) => {
    try {
        const { id, reason, details, reporterName } = req.body;

        if (!id || !reason || !details) {
            return res.json({ success: false, message: "Service ID, reason, and details are required." });
        }

        const ip = (req.socket?.remoteAddress || req.ip || "0.0.0.0").replace("::ffff:", "");

        const report = {
            id: new ObjectId(),
            _id: new ObjectId(), // Ensure both exist for compatibility
            reporterName: reporterName || "Anonymous",
            reason,
            details,
            ip,
            timestamp: new Date(),
            status: "Pending",
            adminResponse: ""
        };

        const { collection: foodColl } = await resolveServiceResource(req, "FOOD");

        if (!foodColl) {
            return res.json({ success: false, message: "Food collection not found." });
        }

        const food = await foodColl.findOne({ _id: new ObjectId(id) });
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
        console.error("ReportServiceLanding error:", error);
        res.json({ success: false, message: "An error occurred while submitting the report." });
    }
};

export const ChangeFoodRating = async (req, res) => {
    try {
        const { id, rating, comment, name } = req.body;
        if (!id || !rating) {
            return res.json({ success: false, message: "id and rating are required" });
        }

        const foodColl = selectCollection(req, "FOOD");
        const numericRating = Number(rating);
        const review = {
            id: new ObjectId(),
            rating: numericRating,
            comment: comment || "",
            name: name || "Verified Customer",
            date: new Date()
        };

        const update = {
            $push: {
                ratingData: numericRating,
                detailedReviews: review
            }
        };

        await foodColl.updateOne({ _id: new ObjectId(id) }, update);

        const updated = await foodColl.findOne(
            { _id: new ObjectId(id) },
            { projection: { ratingData: 1, detailedReviews: 1 } }
        );

        return res.json({
            success: true,
            message: "Your rating is submitted Successfully",
            reviews: updated.detailedReviews || [],
            ratingData: updated.ratingData || []
        });
    } catch (error) {
        console.error("ChangeFoodRating error:", error);
        return res.json({ success: false, message: "Failed to submit rating" });
    }
};

const isCurrentlyOpen = (timingStr) => {
    if (!timingStr || typeof timingStr !== 'string') return false;
    const lowerStr = timingStr.toLowerCase().trim();
    if (lowerStr.includes("24 hours") || lowerStr.includes("always open") || lowerStr.includes("24/7")) return true;
    if (lowerStr.includes("closed") || lowerStr === "n/a") return false;
    if (lowerStr === "contact for timings") return true;

    const separators = ["-", "–", "—", " to "];
    let parts = [];
    for (const sep of separators) {
        if (timingStr.includes(sep)) {
            parts = timingStr.split(sep).map(p => p.trim());
            break;
        }
    }
    if (parts.length < 2) return true;

    const parseTime = (timeStr) => {
        const match = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
        if (!match) return null;
        let hours = parseInt(match[1]);
        let minutes = parseInt(match[2] || "0");
        const ampm = match[3].toUpperCase();
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const start = parseTime(parts[0]);
    const end = parseTime(parts[1]);
    if (start === null || end === null) return true;

    const now = new Date();
    // Adjusted for local time if necessary, but server time is usually fine for local business
    const current = now.getHours() * 60 + now.getMinutes();

    if (start < end) return current >= start && current <= end;
    return current >= start || current <= end;
};

export const PlaceOrder = async (req, res) => {
    try {
        const { ORDERS } = getCollections(req);
        const orderData = req.body;

        if (!orderData.serviceId) {
            return res.json({ success: false, message: "Service ID is required." });
        }

        const foodColl = selectCollection(req, "FOOD");
        const service = await foodColl.findOne({ _id: new ObjectId(orderData.serviceId) });

        if (!service) {
            return res.json({ success: false, message: "Service not found or inactive." });
        }

        // Timing Validation
        const timingStr = service.timings?.opening || service.quickInfo?.timings?.opening || service.quickInfo?.timings?.timing || "";
        if (!isCurrentlyOpen(timingStr)) {
            return res.json({ success: false, message: `Sorry, ${service.ServiceName || "this restaurant"} is currently closed and not accepting orders.` });
        }

        // Flatten all menu items (from both flat menu and categorized menu)
        const allMenuItems = [];
        if (Array.isArray(service.menu)) {
            allMenuItems.push(...service.menu);
        }
        if (Array.isArray(service.categorizedMenu)) {
            service.categorizedMenu.forEach(cat => {
                if (Array.isArray(cat.items)) {
                    allMenuItems.push(...cat.items);
                }
            });
        }

        // Validate each ordered item
        for (const orderedItem of orderData.items) {
            const menuItem = allMenuItems.find(m => m.name === orderedItem.name);
            if (!menuItem) {
                return res.json({ success: false, message: `Item "${orderedItem.name}" is no longer on the menu.` });
            }
            // Explicit check for isAvailable === false
            if (menuItem.isAvailable === false) {
                return res.json({ success: false, message: `Sorry, "${orderedItem.name}" is currently out of stock and cannot be ordered.` });
            }
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

export const GetOrdersByService = async (req, res) => {
    try {
        const { ORDERS } = getCollections(req);
        const db = req.app.locals.db;
        const RESERVATIONS = db.collection(process.env.RESERVATIONS_C || "Reservations");
        const { serviceId } = req.body;

        if (!serviceId) {
            return res.json({ success: false, message: "Service ID is required." });
        }

        const [ordersData, reservationsData] = await Promise.all([
            ORDERS.find({ serviceId: new ObjectId(serviceId) }).toArray(),
            RESERVATIONS.find({ serviceId: new ObjectId(serviceId) }).toArray()
        ]);

        const combined = [
            ...ordersData.map(o => ({ ...o, type: "Order" })),
            ...reservationsData.map(r => ({ ...r, type: "Reservation" }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ success: true, orders: combined });
    } catch (error) {
        console.error("GetOrdersByService error:", error);
        res.json({ success: false, message: "Failed to fetch orders." });
    }
};

export const UpdateOrderStatus = async (req, res) => {
    try {
        const { ORDERS } = getCollections(req);
        const { orderId, status } = req.body;

        await ORDERS.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status } }
        );

        res.json({ success: true, message: "Order status updated." });
    } catch (error) {
        console.error("UpdateOrderStatus error:", error);
        res.json({ success: false, message: "Failed to update order status." });
    }
};

export const BookTable = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const reservations = db.collection(process.env.RESERVATIONS_C || "Reservations");
        const bookingData = req.body;

        if (!bookingData.serviceId) {
            return res.json({ success: false, message: "Service ID is required." });
        }

        const newBooking = {
            ...bookingData,
            serviceId: new ObjectId(bookingData.serviceId),
            createdAt: new Date(),
            status: "Confirmed"
        };

        const result = await reservations.insertOne(newBooking);
        res.json({ success: true, message: "Table booked successfully!", bookingId: result.insertedId });
    } catch (error) {
        console.error("BookTable error:", error);
        res.json({ success: false, message: "Failed to book table." });
    }
};

