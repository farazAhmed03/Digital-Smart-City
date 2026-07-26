import express from "express";
import * as healthUserCont from "../../Controller/Health/client.js";
import { UserMW } from "../../Middleware/UserMW.js";
import { upload } from "../../Middleware/multer.js";
const healthClientRoutes = express.Router();

healthClientRoutes.post("/api/specialist/book/:id", healthUserCont.BookAppointmentInternal);
healthClientRoutes.post("/api/health/review/:id", UserMW, healthUserCont.AddReview);
healthClientRoutes.post("/api/pharmacy/order/:id", upload.single("prescription"), healthUserCont.PlaceOrderInternal);
healthClientRoutes.post("/public/landing", healthUserCont.GetHealthLandingData);
healthClientRoutes.post("/public/listings", healthUserCont.GetHealthListings);
healthClientRoutes.post("/public/details", healthUserCont.GetHealthDetails);
healthClientRoutes.get("/patient/appointments", UserMW, healthUserCont.GetPatientAppointments);







export default healthClientRoutes;
