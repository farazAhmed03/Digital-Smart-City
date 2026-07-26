import express from "express";
import { AdminMW } from "../../Middleware/AdminMW.js";
import * as healthSuperAdminCont from "../../Controller/Health/superAdmin.js";
const healthSuperAdminRoutes = express.Router();

healthSuperAdminRoutes.post("/CreateHealthCataAdmin", AdminMW, healthSuperAdminCont.CreateHealthCataAdmin);

healthSuperAdminRoutes.post("/GetHealthTabNewReqtsData", AdminMW, healthSuperAdminCont.RetriveHealthRequests);

healthSuperAdminRoutes.post("/GetSADHealthTabData", AdminMW, healthSuperAdminCont.RetriveHealthTabDataForSP);

healthSuperAdminRoutes.post("/ChangeHealthServiceState", AdminMW, healthSuperAdminCont.ChangeHealthServiceState);

healthSuperAdminRoutes.post("/DeleteTheHealthService", AdminMW, healthSuperAdminCont.DeleteTheHealthService);

healthSuperAdminRoutes.post("/ChangeHealthAdminVerificationState", AdminMW, healthSuperAdminCont.ChangeHealthAdminVerificationState);

healthSuperAdminRoutes.post("/DeleteHealthRequest", AdminMW, healthSuperAdminCont.DeleteHealthRequest);

healthSuperAdminRoutes.put("/updateTheHealthServicePlan", AdminMW, healthSuperAdminCont.UpdateHealthServicePlan);
healthSuperAdminRoutes.post("/GetHealthNotificationCounts", AdminMW, healthSuperAdminCont.GetHealthNotificationCounts);

export default healthSuperAdminRoutes;