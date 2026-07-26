import JWT from "jsonwebtoken";
import { Admins } from "../../Models/Admins.js";
import { validatePlanFeature } from "../../utils/planValidation.js";
import { getSectorFromType, getServiceModel } from "../../HelperFun/helperFun.js";
import { ObjectId } from "mongodb";

/**
 * Switch Active Service Context for Admin
 * POST /admin/switch-service
 */
export const switchService = async (req, res) => {
    try {
        const { ServiceId } = req.body;
        const { AdminId, role: currentRole } = req.token;

        // 1. Authorization: ONLY Admin can switch
        if (currentRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only admins can switch between services."
            });
        }

        if (!ServiceId) {
            return res.status(400).json({
                success: false,
                message: "Service ID is required"
            });
        }

        // 2. Fetch Admin & Validate Plan
        const admin = await Admins.findById(AdminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // 3. Find Targeted Service
        const selectedService = admin.Services.find(
            s => s.ServiceId.toString() === ServiceId.toString()
        );

        if (!selectedService) {
            return res.status(404).json({
                success: false,
                message: "Service not found in your associated services."
            });
        }

        // 4. Resolve Sector (Backward Compatibility)
        const sector = selectedService.Sector || getSectorFromType(selectedService.ServiceType);

        // 3.5 Plan check (skip for Food sector so admins can manage multiple food outlets with same account)
        if (sector !== "FOOD") {
            const planCheck = validatePlanFeature(admin, "Multiple Institutes");
            if (!planCheck.allowed) {
                return res.status(403).json({
                    success: false,
                    message: planCheck.message || "Your current plan does not support switching between multiple services."
                });
            }
        }

        if (!sector) {
            return res.status(400).json({
                success: false,
                message: "Unable to determine sector for this service."
            });
        }

        // 5. Check if Target Service is Active in its own Collection
        const ServiceModel = await getServiceModel(selectedService.ServiceType);
        if (ServiceModel) {
            const serviceDoc = await ServiceModel.findById(selectedService.ServiceId);
            if (serviceDoc && serviceDoc.isActive === false) {
                 return res.status(403).json({
                    success: true, // success: true but with restricted access message
                    message: "This service account has been disabled. Please contact support."
                });
            }
        }

        // 6. Generate New Token with Sector Context
        const token = JWT.sign(
            {
                role: "admin",
                AdminId: admin._id,
                AdminEmail: admin.AdminEmail,
                ServiceId: selectedService.ServiceId,
                ServiceName: selectedService.ServiceName,
                ServiceType: selectedService.ServiceType,
                sector: sector,
                verified: admin.Verified
            },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("adm_token", token, {
            httpOnly: true,        // Prevents XSS attacks
            secure: true,          // MUST be true for SameSite: None 
            sameSite: "None",      // Allows cross-site cookies between Railway and Vercel
            maxAge: 24 * 60 * 60 * 1000, 
            path: "/",
        });

        // 7. Prepare Response with Other Services
        const OtherServices = admin.Services.filter(
            s => s.ServiceId.toString() !== ServiceId.toString()
        );

        return res.json({
            success: true,
            message: `Switched to ${selectedService.ServiceName}`,
            role: "admin",
            ServiceType: selectedService.ServiceType,
            sector: sector,
            OtherServices
        });

    } catch (error) {
        console.error("switchService error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during service switch."
        });
    }
};
