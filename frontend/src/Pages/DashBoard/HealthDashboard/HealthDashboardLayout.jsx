import { getHealthDashboardData, logoutHealthAdmin } from "../../../ApiCalls/HealthDashboardApiCall";
import { SwitchDashBoard } from "../../../ApiCalls/DashBoardApiCalls";
import SpecialistDashboard from "./SpecialistDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import "./HealthDashboard.css";
import { ToastContainer } from "react-toastify";
import { FaImage, FaImages } from "react-icons/fa";
import { MdAnalytics, MdInventory } from "react-icons/md";
import planLimits from "../../../utils/planLimits";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiBookOpen, FiBriefcase, FiCalendar, FiClock, FiInfo, FiLogOut, FiMenu, FiSettings, FiStar, FiUser, FiX, FiSend } from "react-icons/fi";
import { RequestServiceTab } from "../ProviderDashboard/Components/RequestServiceTab";

const HealthDashboardLayout = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState("profile");
    const [AdminOtherServices, setAdminOtherServices] = useState(undefined);
    const [isSwitchOpen, setIsSwitchOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getHealthDashboardData(setDashboardData, setLoading, setAdminOtherServices);
    }, []);

    const serviceType = dashboardData?.ServiceType;
    const userRole = dashboardData?.role;
    const currentPlan = (dashboardData?.PaymentPlan || "FREE").toUpperCase();

    const handleLogout = () => {
        logoutHealthAdmin(navigate);
    };

    if (loading) {
        return (
            <div className="health-loading-container">
                <div className="health-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    const menuItems = serviceType?.toLowerCase() === "specialist" ? [
        { name: "profile", label: "Basic Info", icon: <FiUser /> },
        { name: "about", label: "About Doctor", icon: <FiInfo /> },
        { name: "services", label: "Manage Services", icon: <FiActivity /> },
        { name: "education", label: "Education & Certs", icon: <FiBookOpen /> },
        { name: "timings", label: "Available Timings", icon: <FiClock /> },
        { name: "appointments", label: "Appointments", icon: <FiCalendar /> },
        { name: "reviews", label: "Patient Reviews", icon: <FiStar /> },
        { name: "settings", label: "Settings", icon: <FiSettings /> },
    ] : [
        { name: "profile", label: "Profile", icon: <FiUser /> },
        { name: "medicines", label: "Medicine Inventory", icon: <MdInventory /> },
        { name: "orders", label: "Orders", icon: <FiBriefcase /> },
        { name: "timings", label: "Available Timings", icon: <FiClock /> },
        { name: "settings", label: "Settings", icon: <FiSettings /> },
        { name: "gallery", label: "gallery", icon: <FaImages /> },
        { name: "request-service", label: "Request Service", icon: <FiSend /> }
    ];

    return (
        <div className="health-dashboard-wrapper">
            <ToastContainer />
            {/* Sidebar */}
            <aside className={`health-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-header">
                    <h2>{serviceType?.toLowerCase() === "specialist" ? "Doctor Portal" : "Pharmacy Portal"}</h2>
                    <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
                <ul className="sidebar-menu">
                    {menuItems.map((item) => (
                        <li
                            key={item.name}
                            className={currentTab === item.name ? "active" : ""}
                            onClick={() => setCurrentTab(item.name)}
                        >
                            <span className="icon">{item.icon}</span>
                            {isSidebarOpen && <span className="name">{item.label || item.name}</span>}
                        </li>
                    ))}

                    {userRole === "admin" && AdminOtherServices && AdminOtherServices.length > 0 && (
                        <li className="switch-dashboard-item" onClick={() => setIsSwitchOpen(!isSwitchOpen)}>
                            <span className="icon"><MdAnalytics /></span>
                            {isSidebarOpen && <span className="name">Switch Dashboard</span>}
                            {isSwitchOpen && Array.isArray(AdminOtherServices) && (
                                <ul className="switch-dropdown">
                                    {AdminOtherServices.map(service => (
                                        <li key={service.ServiceId} onClick={(e) => {
                                            e.stopPropagation();
                                            SwitchDashBoard(service.ServiceName, service.ServiceId, service.ServiceType, setDashboardData, setAdminOtherServices);
                                            setIsSwitchOpen(false);
                                        }}>
                                            {service.ServiceName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
                <div className="sidebar-footer" onClick={handleLogout}>
                    <span className="icon"><FiLogOut /></span>
                    {isSidebarOpen && <span className="name">Logout</span>}
                </div>
            </aside>

            {/* Main Content */}
            <main className="health-main-content">
                <header className="content-top-bar">
                    <h1>{menuItems.find(i => i.name === currentTab)?.label || currentTab}</h1>
                    <div className="user-info">
                        <span>{dashboardData?.ServiceName || dashboardData?.data?.ServiceName}</span>
                        {serviceType && <div className="role-badge">{serviceType}</div>}
                    </div>
                </header>
                <section className="content-body">
                    {currentTab === "request-service" ? (
                        <RequestServiceTab dashboardData={dashboardData} />
                    ) : serviceType?.toLowerCase() === "specialist" ? (
                        <SpecialistDashboard currentTab={currentTab} data={dashboardData} />
                    ) : (
                        <PharmacyDashboard currentTab={currentTab} data={dashboardData} />
                    )}
                </section>
            </main>
        </div>
    );
};

export default HealthDashboardLayout;
