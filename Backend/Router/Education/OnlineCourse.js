import express from "express";
import { AdminMW } from "../../Middleware/AdminMW.js";
import { upload } from "../../Middleware/multer.js";
import * as OCCont from "../../Controller/Education/onlineCourseCont.js";

const OnlineCourseRoutes = express.Router();

/* =========================================================
   ADMIN ROUTES (Super Admin / SAManager)
========================================================= */

// Course Management
OnlineCourseRoutes.post("/admin/courses/create", AdminMW, upload.single("image"), OCCont.createCourse);
OnlineCourseRoutes.put("/admin/courses/update/:id", AdminMW, upload.single("image"), OCCont.updateCourse);
OnlineCourseRoutes.delete("/admin/courses/delete/:id", AdminMW, OCCont.deleteCourse);
OnlineCourseRoutes.get("/admin/courses/all", AdminMW, OCCont.getAllCoursesAdmin);

// Enrollment Management
OnlineCourseRoutes.get("/admin/enrollments/all", AdminMW, OCCont.getAllEnrollments);
OnlineCourseRoutes.put("/admin/enrollments/status/:id", AdminMW, OCCont.updateEnrollmentStatus);

// Settings Management
OnlineCourseRoutes.get("/admin/oc-settings", AdminMW, OCCont.getOCSettings);
OnlineCourseRoutes.put("/admin/oc-settings", AdminMW, upload.single("heroImage"), OCCont.updateOCSettings);

/* =========================================================
   CLIENT ROUTES
========================================================= */

OnlineCourseRoutes.get("/courses/active", OCCont.getActiveCourses);
OnlineCourseRoutes.get("/courses/detail/:id", OCCont.getCourseDetail);
OnlineCourseRoutes.post("/courses/enroll", upload.single("paymentScreenshot"), OCCont.enrollInCourse);

export default OnlineCourseRoutes;
