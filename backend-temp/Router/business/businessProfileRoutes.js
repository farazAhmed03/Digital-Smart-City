import express from "express";
import * as profileController from "../../Controller/business/businessProfileController.js";
import { businessAuth } from "../../Middleware/business/businessAuthMiddleware.js";
import { businessRole } from "../../Middleware/business/businessRoleMiddleware.js";
import { upload } from "../../Middleware/multer.js";

const router = express.Router();


router.get("/get-profile", businessAuth, businessRole, profileController.getMyBusinessProfile);
router.get("/category/:category", profileController.getProfilesByCategory);
router.get("/:businessId", profileController.getBusinessProfile);
router.put("/update-profile", businessAuth, businessRole, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), profileController.updateBusinessProfile);

export default router;

