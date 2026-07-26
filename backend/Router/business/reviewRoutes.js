import express from 'express';
import { addReview, trackOrder, getPublicReviews, getBusinessDashboardReviews } from '../../Controller/business/reviewController.js';
import { businessAuth } from '../../Middleware/business/businessAuthMiddleware.js';
import { businessRole } from '../../Middleware/business/businessRoleMiddleware.js';

const router = express.Router();

router.post('/add', addReview);
router.get('/track/:orderId', trackOrder);
router.get('/public/:businessId', getPublicReviews);
router.get('/business-dashboard', businessAuth, businessRole, getBusinessDashboardReviews);

export default router;
