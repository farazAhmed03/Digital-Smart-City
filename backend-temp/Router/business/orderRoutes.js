import express from "express";
import { getBusinessOrders, placeBusinessOrder, updateOrderStatus, getCustomerOrders, updateCustomerOrder } from '../../Controller/business/orderController.js';
import { verifyCustomerToken } from '../../Middleware/verifyCustomerToken.js';
import { businessAuth } from "../../Middleware/business/businessAuthMiddleware.js";
import { businessRole } from "../../Middleware/business/businessRoleMiddleware.js";

const router = express.Router();

router.get("/get-orders", businessAuth, businessRole, getBusinessOrders);

router.put("/update-status/:orderId", businessAuth, businessRole, updateOrderStatus);

// Add New Order (Protected by Customer Auth)
router.post('/place', verifyCustomerToken, placeBusinessOrder);

// Customer specific routes
router.get('/my-orders', verifyCustomerToken, getCustomerOrders);
router.post('/customer-update', verifyCustomerToken, updateCustomerOrder);

export default router;
