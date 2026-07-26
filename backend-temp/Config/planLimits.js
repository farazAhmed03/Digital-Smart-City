export const planLimits = {
    FREE: {
        onlineAdmissions: Infinity,
        staff: Infinity,
        galleryImages: Infinity,
        institutes: Infinity,
        managers: Infinity,
        features: [
            "Basic Info",
            "Administration Info",
            "Staff Data",
            "Fee Structure",
            "Online Admission",
            "Upcoming Event Data",
            "Multiple Institutes",
            "Add Managers",
            "Management System",
            "Gallery Images"
        ]
    },
    BASIC: {
        onlineAdmissions: 25,
        staff: 15,
        galleryImages: 30,
        institutes: 1,
        managers: 0,
        features: [
            "Basic Info",
            "Administration Info",
            "Staff Data",
            "Fee Structure",
            "Online Admission",
            "Upcoming Event Data",
            "Gallery Images"
        ]
    },
    PREMIUM: {
        onlineAdmissions: 60,
        staff: 40,
        galleryImages: 80,
        institutes: 3,
        managers: 3,
        features: [
            "Basic Info",
            "Administration Info",
            "Staff Data",
            "Fee Structure",
            "Online Admission",
            "Upcoming Event Data",
            "Gallery Images",
            "Multiple Institutes",
            "Add Managers"
        ]
    },
    ENTERPRISE: {
        onlineAdmissions: Infinity,
        staff: Infinity,
        galleryImages: Infinity,
        institutes: Infinity,
        managers: Infinity,
        features: [
            "Basic Info",
            "Administration Info",
            "Staff Data",
            "Fee Structure",
            "Online Admission",
            "Upcoming Event Data",
            "Multiple Institutes",
            "Add Managers",
            "Management System",
            "Gallery Images"
        ]
    }
};

export default planLimits;
