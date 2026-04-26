import express from "express";
import * as productController from "../../Controller/business/productController.js";
import { businessAuth } from "../../Middleware/business/businessAuthMiddleware.js";
import { businessRole } from "../../Middleware/business/businessRoleMiddleware.js";
import { upload } from "../../Middleware/multer.js";

const router = express.Router();

router.get("/get-products", businessAuth, businessRole, productController.getMyProducts);
router.get("/business/:businessId", productController.getBusinessProducts);
router.post("/add-product", businessAuth, businessRole, upload.single('image'), productController.addProduct);
router.put("/update-product/:productId", businessAuth, businessRole, upload.single('image'), productController.updateProduct);

router.delete("/delete-product/:productId", businessAuth, businessRole, productController.deleteProduct);


export default router;
