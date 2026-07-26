const planLimits = {
    FREE: {
        onlineAdmissions: Infinity,
        staff: Infinity,
        galleryImages: Infinity,
        institutes: Infinity,
        managers: Infinity,
        features: [
            "Profile",
            "Basic Info",
            "Admin",
            "Staff",
            "Events",
            "Fee Structure",
            "Admissions",
            "Gallery",
            "Reviews",
            "Multiple Institutes",
            "Add Manager",
            "Management System"
        ]
    },
    BASIC: {
        onlineAdmissions: 25,
        staff: 15,
        galleryImages: 30,
        institutes: 1,
        managers: 0,
        features: [
            "Profile",
            "Basic Info",
            "Admin",
            "Staff",
            "Events",
            "Fee Structure",
            "Admissions",
            "Gallery",
            "Reviews"
        ]
    },
    PREMIUM: {
        onlineAdmissions: 60,
        staff: 40,
        galleryImages: 80,
        institutes: 3,
        managers: 3,
        features: [
            "Profile",
            "Basic Info",
            "Admin",
            "Staff",
            "Events",
            "Fee Structure",
            "Admissions",
            "Gallery",
            "Reviews",
            "Multiple Institutes",
            "Add Manager"
        ]
    },
    ENTERPRISE: {
        onlineAdmissions: Infinity,
        staff: Infinity,
        galleryImages: Infinity,
        institutes: Infinity,
        managers: Infinity,
        features: [
            "Profile",
            "Basic Info",
            "Admin",
            "Staff",
            "Events",
            "Fee Structure",
            "Admissions",
            "Gallery",
            "Reviews",
            "Multiple Institutes",
            "Add Manager",
            "Management System"
        ]
    }
};

export default planLimits;
