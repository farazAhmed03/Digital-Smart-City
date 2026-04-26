import Order from "../../Models/business/Order.js";
import Review from "../../Models/business/Review.js";

// @route   POST /business/orders/customer-update
// @desc    Customer update order (cancel or edit notes)
// @access  Private (Customer)
export const updateCustomerOrder = async (req, res) => {
    try {
        const { orderId, action, notes } = req.body;
        const customerId = req.customer.id;

        const order = await Order.findOne({ _id: orderId, customerId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found or unauthorized" });
        }

        if (order.status !== "Received" && order.status !== "Under Review") {
            return res.status(400).json({ success: false, message: "Order can no longer be modified" });
        }

        if (action === "Cancel") {
            order.status = "Canceled";
            order.statusHistory.push({ status: "Canceled", changedBy: "customer" });
        } else if (action === "Edit") {
            if (notes !== undefined) {
                order.notes = notes;
            }
        }

        await order.save();
        res.json({ success: true, message: "Order updated successfully", order });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// @route   GET /business/orders/get-orders
// @desc    Get all orders for a specific business
// @access  Private (Business Owner)
export const getBusinessOrders = async (req, res) => {
    try {
        const businessId = req.business.id;

        // Fetch original orders
        const orders = await Order.find({ businessId }).sort({ createdAt: -1 }).lean();

        // Concurrently fetch reviews for these orders
        const reviews = await Review.find({ businessId }).lean();

        // Map reviews directly into the corresponding orders
        const ordersWithReviews = orders.map(order => {
            const review = reviews.find(r => r.orderId.toString() === order._id.toString());
            return {
                ...order,
                review: review || null
            };
        });

        res.json({ success: true, orders: ordersWithReviews });
    } catch (err) {

        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const businessId = req.business.id;

        const order = await Order.findOne({ _id: orderId, businessId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.status === status) {
            return res.json({ success: true, message: "Status is already up to date", data: order });
        }

        order.status = status;
        order.statusHistory.push({ status, changedBy: "admin" });
        await order.save();
        res.json({ success: true, message: "Order status updated successfully", data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// @route   POST /business/orders/place
// @desc    Place a new business order (Customer only)
// @access  Private (Customer)
export const placeBusinessOrder = async (req, res) => {
    try {
        const orderData = req.body;
        if (req.customer) {
            orderData.customerId = req.customer.id;
        }

        orderData.statusHistory = [{ status: "Received", changedBy: "customer" }];

        const newOrder = new Order(orderData);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully", data: newOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// @route   GET /business/orders/my-orders
// @desc    Get all orders for the logged-in customer
// @access  Private (Customer)
export const getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.customer.id;
        const orders = await Order.find({ customerId })
            .populate('businessId', 'businessName logo')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
