import ManageMedicines from "./PharmacyTabs/ManageMedicines";
import Profile from "./PharmacyTabs/Profile";
import OpeningHours from "./PharmacyTabs/OpeningHours";
import ManageServices from "./PharmacyTabs/ManageServices";
import ManageOrders from "./PharmacyTabs/ManageOrders";
import ManageReviews from "./PharmacyTabs/ManageReviews";
import ManageGallery from "./PharmacyTabs/ManageGallery";

const PharmacyDashboard = ({ currentTab, data }) => {
    const pharmacyData = data || {};
    
    switch (currentTab) {
        case "profile":
            return <Profile data={pharmacyData} />;
        case "medicines":
            return <ManageMedicines data={pharmacyData} />;
        case "services":
            return <ManageServices data={pharmacyData} />;
        case "timings":
            return <OpeningHours data={pharmacyData} />;
        case "orders":
            return <ManageOrders data={pharmacyData} />;
        case "reviews":
            return <ManageReviews data={pharmacyData} />;
        case "gallery":
            return <ManageGallery data={pharmacyData} />;
        case "settings":
            return <div className="hlth-ds-placeholder">Settings coming soon...</div>;
        default:
            return <Profile data={pharmacyData} />;
    }
};

export default PharmacyDashboard;
