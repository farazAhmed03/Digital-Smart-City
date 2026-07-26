import express from "express";
import * as FoodSPContFun from "../../Controller/Food/superAdmin.js";
import * as SAContFun from "../../Controller/SuperAdminCont.js"; 
import { AdminMW } from "../../Middleware/AdminMW.js";

const foodSARoutes = express.Router();

// --- FOOD SERVICE MANAGEMENT ---
foodSARoutes.post("/CreateFoodCataAdmin", AdminMW, FoodSPContFun.CreateFoodCataAdmin);
foodSARoutes.post("/GetSADFoodTabData", AdminMW, FoodSPContFun.RetriveNewFoodReqs);
foodSARoutes.post("/GetFoodTabData", AdminMW, FoodSPContFun.RetriveFoodDataForSP);
foodSARoutes.post("/ChangeFoodAdminVerificationState", AdminMW, FoodSPContFun.ChangeFoodAdminVerificationState);
foodSARoutes.post("/ChangeTheFoodInstState", AdminMW, FoodSPContFun.ChangeFoodInstState);
foodSARoutes.post("/DeleteTheFoodInst", AdminMW, FoodSPContFun.DeleteTheFoodInst);
foodSARoutes.post("/DeleteTheFoodReq", AdminMW, FoodSPContFun.DeleteFoodRequest);
foodSARoutes.get("/GetFoodUpgradeRequests", AdminMW, FoodSPContFun.GetFoodUpgradeRequests);
foodSARoutes.post("/ApproveFoodUpgrade", AdminMW, FoodSPContFun.ApproveFoodUpgrade);
foodSARoutes.post("/GetFoodNotificationCounts", AdminMW, FoodSPContFun.GetFoodNotificationCounts);
foodSARoutes.post("/ChangeFoodAdminPaymentData", AdminMW, FoodSPContFun.ChangeFoodAdminPaymentData);
// --- BUSINESS MANAGEMENT (Shared Router for now) ---
foodSARoutes.post("/GetBusinessesByStatus", AdminMW, SAContFun.GetBusinessesByStatus);
foodSARoutes.post("/UpdateBusinessStatus", AdminMW, SAContFun.UpdateBusinessStatus);
foodSARoutes.post("/GetBusinessNotificationCounts", AdminMW, SAContFun.GetBusinessNotificationCounts);

export default foodSARoutes;
