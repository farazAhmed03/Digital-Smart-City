import planLimits from "../Config/planLimits.js";

/**
 * Strict pre-execution validation for subscription status and feature access.
 * @param {Object} admin - The admin object from DB.
 * @param {String} featureName - The name of the feature to check (from planLimits features array).
 * @returns {Object} { allowed: Boolean, message: String }
 */
export const validatePlanFeature = (admin, featureName) => {
    // 1. Check Subscription Status
    if (!admin.Status) {
        return {
            allowed: false,
            message: "Subscription is not active."
        };
    }

    // 2. Check Expiry for FREE Plan
    const plan = admin.PaymentPlan || "FREE";
    const limits = planLimits[plan];

    if (!limits) {
        return { allowed: true }; // Fallback
    }

    if (plan === "FREE") {
        const currentDate = new Date();
        const expiryDate = new Date(admin.PlanExpiry || admin.trialEndDate);
        if (currentDate > expiryDate) {
            return {
                allowed: false,
                message: "Your free trial has expired. Please contact admin to upgrade."
            };
        }
    }

    // 3. Check if Feature is Allowed in Plan
    if (!limits.features || !limits.features.includes(featureName)) {
        return {
            allowed: false,
            message: "This feature is not available in your current payment plan."
        };
    }

    return { allowed: true };
};

export const checkPlanLimit = (institute, limitKey, currentCount) => {
    const plan = institute.PaymentPlan || "FREE";
    const limits = planLimits[plan];

    if (!limits) {
        return { allowed: true }; // Fallback
    }

    const limitValue = limits[limitKey];

    // Check if subscription/trial is expired
    if (plan === "FREE" || institute.SubscriptionStatus === "Expired") {
        const currentDate = new Date();
        const expiryDate = new Date(institute.PlanExpiry || institute.trialEndDate);
        if (currentDate > expiryDate) {
            return {
                allowed: false,
                message: "Your subscription or free trial has expired. Please contact admin to upgrade."
            };
        }
    }

    if (currentCount >= limitValue) {
        return {
            allowed: false,
            message: `Your plan ${limitKey} limit has been reached. Please upgrade your plan.`
        };
    }

    return { allowed: true };
};
