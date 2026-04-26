import express from "express";
import * as EduAdminCont from "../../Controller/Education/Admin.js";
// EduAdminCont => SCHOOL AND COLLEGE ADMIN CONTROLLER FUNCTIONS:
import { AdminMW } from "../../Middleware/AdminMW.js";
import { upload } from "../../Middleware/multer.js";
import { DeleteStaffImage } from "../../utils/cloudinary.js";
const EduAdminRoutes = express.Router();
// ==========================================
// ADMIN AUTHENATICATION AND AUTHORIZATION:
// ==========================================

EduAdminRoutes.post("/AdminLogin", EduAdminCont.AdminLoginFun);
EduAdminRoutes.post("/Logout", EduAdminCont.Logout);
EduAdminRoutes.get("/getDashBoardDta", AdminMW, EduAdminCont.RetriveTheDashboardDta);
EduAdminRoutes.post("/AddManager", AdminMW, EduAdminCont.AddManager);

// ==========================================
// BASIC INFO TAB DATA UPDATING ROUTES:
// ==========================================

EduAdminRoutes.post("/UpdateBasicInfo", AdminMW, upload.fields([
    { name: "bannerUrl", maxCount: 1 },
    { name: "aboutImgUrl", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
]), EduAdminCont.UpdateBasicInfoToDb);

// ==========================================
// ADMIN TAB DATA UPDATING ROUTES:
// ==========================================

EduAdminRoutes.post("/UpdateAdministration", AdminMW, EduAdminCont.UpdateAdministrationToDb);
EduAdminRoutes.post("/UpdateTimings", AdminMW, EduAdminCont.UpdateTimingsToDb);
EduAdminRoutes.post("/UpdateFacilities", AdminMW, EduAdminCont.UpdateFacilitiesToDb);

// ==========================================
// STAFF TAB DATA UPDATING ROUTES:
// ==========================================

EduAdminRoutes.post("/UpdateStaff", AdminMW, upload.any(), EduAdminCont.UpdateStaffData);
EduAdminRoutes.post("/DeleteImage", AdminMW, DeleteStaffImage);
EduAdminRoutes.post("/AddStaffAndStudntData", AdminMW, EduAdminCont.AddStaffAndStudentDataToDb);
EduAdminRoutes.post("/AddResAndPrfumncData", AdminMW, EduAdminCont.AddResAndPrfumncDataToDb);

// ==========================================
// EVENT TAB DATA UPDATING ROUTES:
// ==========================================

EduAdminRoutes.post("/deleteTheEvent", AdminMW, EduAdminCont.deleteTheEventFrmDb)
EduAdminRoutes.post("/AddNewEvent", AdminMW, EduAdminCont.AddNewEventToDb);
EduAdminRoutes.post("/UpdateExtraActivities", AdminMW, EduAdminCont.UpdateExtraActivitiesToDb);

// ==========================================
//FEE TAB DATA UPDATING ROUTE: 
// ==========================================

EduAdminRoutes.post("/AddFeeTabData", AdminMW, EduAdminCont.UpdateFeesToDb);

// ==========================================
// REVIEWS TAB DATA UPDATING ROUTE:
// ==========================================

EduAdminRoutes.post("/AddReviewTabData", AdminMW, EduAdminCont.UpdateReviewsToDb);
// ==========================================
// GALLERY TAB DATA UPDATING ROUTE:
// ==========================================

EduAdminRoutes.post("/UpdateGallery", AdminMW, upload.any(), EduAdminCont.UpdateGallery);
EduAdminRoutes.post("/GetInstituteAdmissions", AdminMW, EduAdminCont.GetInstituteAdmissions);
EduAdminRoutes.post("/update-payment-gateways", AdminMW, EduAdminCont.UpdatePaymentGatewaysToDb);

export default EduAdminRoutes;