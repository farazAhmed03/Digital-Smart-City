import Review from "../../Models/business/Review.js";
import Order from "../../Models/business/Order.js";

// @route   POST /business/reviews/add
// @desc    Add a review for a delivered order
// @access  Public
export const addReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;

        if (!orderId || !rating) {
            return res.status(400).json({ success: false, message: "Order ID and rating are required" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.status !== "Delivered") {
            return res.status(400).json({ success: false, message: "You can only review delivered orders" });
        }

        if (order.isReviewed) {
            return res.status(400).json({ success: false, message: "You have already reviewed this order" });
        }

        const newReview = new Review({
            orderId: order._id,
            businessId: order.businessId,
            customerName: order.customerName,
            rating,
            comment
        });

        await newReview.save();

        order.isReviewed = true;
        await order.save();

        res.json({ success: true, message: "Review submitted successfully", data: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   GET /business/reviews/track/:orderId
// @desc    Get order details for tracking (public)
// @access  Public
export const trackOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate("businessId", "businessName logo");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error("Error tracking order:", error);
        res.status(500).json({ success: false, message: "Server Error (Invalid Order ID format)" });
    }
};

// Helper: builds product-grouped review map from reviews + their associated orders
const buildProductReviewMap = (reviews, orders) => {
    const productMap = {};
    reviews.forEach(review => {
        const order = orders.find(o => o._id.toString() === review.orderId.toString());
        if (!order) return;

        // Each ProductCard order has exactly 1 item — only use the first one
        const item = order.items[0];
        if (!item) return;

        const productKey = item.productName || "Unknown Product";
        if (!productMap[productKey]) {
            productMap[productKey] = {
                productName: productKey,
                productId: item.productId,
                reviews: [],
                totalRating: 0,
                averageRating: 0
            };
        }
        productMap[productKey].reviews.push({
            customerName: review.customerName,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
        });
        productMap[productKey].totalRating += review.rating;
    });

    // Calculate averages
    Object.values(productMap).forEach(p => {
        p.averageRating = parseFloat((p.totalRating / p.reviews.length).toFixed(1));
    });

    return Object.values(productMap);
};

// @route   GET /business/reviews/public/:businessId
// @desc    Get all reviews grouped by product for a specific business (public)
// @access  Public
export const getPublicReviews = async (req, res) => {
    try {
        const { businessId } = req.params;
        const reviews = await Review.find({ businessId });
        const orderIds = reviews.map(r => r.orderId);
        const orders = await Order.find({ _id: { $in: orderIds } });

        const productReviews = buildProductReviewMap(reviews, orders);

        res.json({ success: true, data: productReviews });
    } catch (error) {
        console.error("Error fetching public reviews:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   GET /business/reviews/business-dashboard
// @desc    Get all reviews grouped by product for the logged-in business (admin)
// @access  Private (Business)
export const getBusinessDashboardReviews = async (req, res) => {
    try {
        const businessId = req.business.id;
        const reviews = await Review.find({ businessId });
        const orderIds = reviews.map(r => r.orderId);
        const orders = await Order.find({ _id: { $in: orderIds } });

        const productReviews = buildProductReviewMap(reviews, orders);

        res.json({ success: true, data: productReviews });
    } catch (error) {
        console.error("Error fetching dashboard reviews:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
