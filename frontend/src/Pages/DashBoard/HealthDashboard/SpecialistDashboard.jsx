import React from "react";
import Profile from "./SpecialistTabs/Profile";
import AboutDoctor from "./SpecialistTabs/AboutDoctor";
import ManageServices from "./SpecialistTabs/ManageServices";
import ManageEducation from "./SpecialistTabs/ManageEducation";
import OpeningHours from "./PharmacyTabs/OpeningHours"; // Reuse existing
import ManageAppointments from "./SpecialistTabs/ManageAppointments";
import ManageAvailableSlots from "./SpecialistTabs/ManageAvailableSlots";
import ManageReviews from "./PharmacyTabs/ManageReviews"; // Reuse existing

const SpecialistDashboard = ({ currentTab, data }) => {
    const specialistData = data || {};
    switch (currentTab) {
        case "profile":
            return <Profile data={specialistData} />;
        case "about":
            return <AboutDoctor data={specialistData} />;
        case "services":
            return <ManageServices data={specialistData} />;
        case "education":
            return <ManageEducation data={specialistData} />;
        case "timings":
            return <OpeningHours data={specialistData} />;
        case "slots":
            return <ManageAvailableSlots data={specialistData} />;
        case "appointments":
            return <ManageAppointments data={specialistData} />;
        case "reviews":
            return <ManageReviews data={specialistData} />;
        case "settings":
            return <div className="hlth-ds-placeholder">Settings coming soon...</div>;
        default:
            return <Profile data={specialistData} />;
    }
};

export default SpecialistDashboard;
