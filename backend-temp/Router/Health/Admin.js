import express from "express";
import * as healthAdminCont from "../../Controller/Health/Admin.js";
import { AdminMW } from "../../Middleware/AdminMW.js";
import { upload } from "../../Middleware/multer.js";
const healthAdminRoutes = express.Router();


healthAdminRoutes.post("/health/admin/login", healthAdminCont.HealthAdminLogin);
healthAdminRoutes.post("/health/logout", healthAdminCont.HealthAdminLogout);

// SPECIALISTS TABS
healthAdminRoutes.put("/update/specialist/profile", AdminMW, upload.single("doctorLogo"), healthAdminCont.UpdateProfile);
healthAdminRoutes.get("/health/dashboard", AdminMW, healthAdminCont.GetHealthDashboardData);
healthAdminRoutes.get("/api/health/services", AdminMW, healthAdminCont.GetServices);
healthAdminRoutes.post("/api/health/services", AdminMW, healthAdminCont.AddService);
healthAdminRoutes.put("/api/health/services/:id", AdminMW, healthAdminCont.UpdateService);
healthAdminRoutes.delete("/api/health/services/:id", AdminMW, healthAdminCont.DeleteService);
healthAdminRoutes.post("/api/specialist/education", AdminMW, healthAdminCont.AddEducation);
healthAdminRoutes.put("/api/specialist/education/:id", AdminMW, healthAdminCont.UpdateEducation);
healthAdminRoutes.delete("/api/specialist/education/:id", AdminMW, healthAdminCont.DeleteEducation);
healthAdminRoutes.put("/health/specialist/timings", AdminMW, healthAdminCont.UpdateTimings);
healthAdminRoutes.get("/api/specialist/appointments", AdminMW, healthAdminCont.GetAppointments);
healthAdminRoutes.put("/api/specialist/appointments/status/:id", AdminMW, healthAdminCont.UpdateAppointmentStatus);
healthAdminRoutes.delete("/api/specialist/appointments/:id", AdminMW, healthAdminCont.DeleteAppointmentInternal);
healthAdminRoutes.delete("/api/health/reviews/:id", AdminMW, healthAdminCont.DeleteReview);

// PHARMACY TABS
healthAdminRoutes.put("/update/pharmacy/profile", AdminMW, upload.single("img"), healthAdminCont.UpdatePharmacyProfile);
healthAdminRoutes.get("/api/pharmacy/medicines", AdminMW, healthAdminCont.GetMedicines);
healthAdminRoutes.post("/api/pharmacy/medicines", AdminMW, healthAdminCont.AddMedicine);
healthAdminRoutes.put("/api/pharmacy/medicines/:id", AdminMW, healthAdminCont.UpdateMedicine);
healthAdminRoutes.delete("/api/pharmacy/medicines/:id", AdminMW, healthAdminCont.DeleteMedicine);
healthAdminRoutes.put("/api/pharmacy/orders/:id", AdminMW, healthAdminCont.UpdateOrderStatus);
healthAdminRoutes.delete("/api/pharmacy/orders/:id", AdminMW, healthAdminCont.DeleteOrder);
healthAdminRoutes.post("/UpdateHealthStaff", AdminMW, upload.any(), healthAdminCont.UpdateStaff);
healthAdminRoutes.post("/UpdateHealthGallery", AdminMW, upload.any(), healthAdminCont.UpdateGallery);


export default healthAdminRoutes;