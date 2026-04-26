import express from "express";
import { UserMW } from "../../Middleware/UserMW.js";
import { AdminMW } from "../../Middleware/AdminMW.js";
import { AuthenticatedServiceProviderRequest, ChangeRatingData, GettingServiceCardsData, GettingServiceWholeData, ServiceProviderRegistrationController, VerifyServiceProviderOtp } from "../../Controller/CommonController/commonCont.js";
import { ContactUsController } from "../../Controller/CommonController/contactController.js";
const commonRoutes = express.Router();

commonRoutes.post("/changeRatingData", UserMW, ChangeRatingData);
commonRoutes.post("/service-provider/register", ServiceProviderRegistrationController);
commonRoutes.post("/service-provider/verify-otp", VerifyServiceProviderOtp);
commonRoutes.post("/getServiceCardsData", GettingServiceCardsData);
commonRoutes.post("/getServiceWholeData", GettingServiceWholeData);
commonRoutes.post("/admin/request-service", AdminMW, AuthenticatedServiceProviderRequest);
commonRoutes.post("/contact", ContactUsController);

export default commonRoutes;