import express from "express";
import { UserMW } from "../../Middleware/UserMW.js";
import * as userCont from "../../Controller/Auth/authCont.js";
import { AdminMW } from "../../Middleware/AdminMW.js";
import * as ForgotPassCont from "../../Controller/Auth/forgotPasswordCont.js";
import { switchService } from "../../Controller/Auth/switchCont.js";

const AuthRoutes = express.Router();
// SUPEADMIN ROUTES
AuthRoutes.post("/IntializesuperAdmin", userCont.createInitialSuperAdmin);
AuthRoutes.post("/SuperAdminLogin", userCont.SuperAdminLogin);
AuthRoutes.get("/GetSuperAdminDashboardData", AdminMW, userCont.RetriveSuperAdminData);
AuthRoutes.post("/CreateSAManager", AdminMW, userCont.CreateSAManager);
AuthRoutes.post("/SuperAdminLogout", userCont.SuperAdminLogout);
AuthRoutes.post("/DeleteThSAManager", AdminMW, userCont.DeleteThSAManager);

// DASHBOARD SWITCHING (CROSS-SECTOR)
AuthRoutes.post("/admin/switch-service", AdminMW, switchService);

// FORGOT PASSWORD
AuthRoutes.post("/forgot-password/request-otp", ForgotPassCont.requestResetOtp);
AuthRoutes.post("/forgot-password/verify-otp", ForgotPassCont.verifyResetOtp);
AuthRoutes.post("/forgot-password/reset", ForgotPassCont.resetPassword);


// CLIENT ROUTES
AuthRoutes.post("/register/user/request-otp", userCont.RequestRegisterOtp);
AuthRoutes.post("/register/user/verify-otp", userCont.VerifyRegisterOtp);
AuthRoutes.post("/user/login", userCont.LoginUser);
AuthRoutes.post("/user/logout", userCont.UserLogout);
AuthRoutes.get("/user/data", UserMW, userCont.GetLoggedInUser);

export default AuthRoutes;