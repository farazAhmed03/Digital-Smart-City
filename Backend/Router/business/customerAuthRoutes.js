import express from 'express';
import { registerCustomer, loginCustomer, getMe } from '../../Controller/business/customerAuthController.js';
import { verifyCustomerToken } from '../../Middleware/verifyCustomerToken.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/me', verifyCustomerToken, getMe);

export default router;
