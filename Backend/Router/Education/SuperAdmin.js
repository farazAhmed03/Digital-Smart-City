import express from "express";
import { AdminMW } from "../../Middleware/AdminMW.js";
import * as EduSACont from "../../Controller/Education/superAdmin.js";
const EduSuperAdminRoutes = express.Router();

EduSuperAdminRoutes.post("/CreateEduCataAdmin", AdminMW, EduSACont.CreateEduCataAdmin);
EduSuperAdminRoutes.post("/GetEduTabNewReqtsData", AdminMW, EduSACont.RetriveNewReqs);
EduSuperAdminRoutes.post("/GetEduTabNewAdnissionsData", AdminMW, EduSACont.RetriveNewAdmissionsForSP);
EduSuperAdminRoutes.post("/ApproveAdmissionAndForward", AdminMW, EduSACont.ApproveAdmissionAndForward);
EduSuperAdminRoutes.post("/getInstituteRecords", AdminMW, EduSACont.getInstituteRecords);
EduSuperAdminRoutes.post("/deleteAdmissionRequest", AdminMW, EduSACont.deleteAdmissionRequest);
EduSuperAdminRoutes.post("/deleteAdmissionRecord", AdminMW, EduSACont.deleteAdmissionRecord);
EduSuperAdminRoutes.post("/GetSADEduTabData", AdminMW, EduSACont.RetriveEduTabDataForSP);

EduSuperAdminRoutes.post("/ChangeAdminVerificationState", AdminMW, EduSACont.ChangeAdminVerificationState);
EduSuperAdminRoutes.post("/ChangeTheInstState", AdminMW, EduSACont.ChangeInstState);
EduSuperAdminRoutes.post("/DeleteTheInst", AdminMW, EduSACont.DeleteTheInst);
EduSuperAdminRoutes.post("/DeleteTheReq", AdminMW, EduSACont.DeleteRequest);
EduSuperAdminRoutes.post("/ChangePaymentData", AdminMW, EduSACont.ChangePaymentPlan);
EduSuperAdminRoutes.get("/GetEduNotificationCounts", AdminMW, EduSACont.GetEducationNotificationCounts);
export default EduSuperAdminRoutes;
