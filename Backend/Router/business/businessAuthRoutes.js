import express from "express";
import * as authController from "../../Controller/business/businessAuthController.js";

const router = express.Router();

router.post("/register-request", authController.registerBusinessRequest);
router.post("/login", authController.businessLogin);
router.post("/logout", authController.businessLogout);

export default router;
