import React, { useState, useEffect } from "react";
import { LogoutApi } from "../../../ApiCalls/DashBoardApiCalls";
import { toast, ToastContainer } from "react-toastify";
import "../../BusinessPage/BusinessDashboard.css"; // New professional styles
import {
    FiUser,
    FiShoppingBag,
    FiLogOut,
    FiSettings,
    FiHome,
    FiPackage,
    FiCheckCircle,
    FiClock,
    FiSend
} from "react-icons/fi";
import { RequestServiceTab } from "../ProviderDashboard/Components/RequestServiceTab";
import { BusinessProfile } from "./BusinessProfile";
import { BusinessProducts } from "./BusinessProducts";
import { BusinessOrders } from "./BusinessOrders";
import { BusinessReviews } from "./BusinessReviews";
import { FiStar } from "react-icons/fi";

export const BusinessDashboard = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        LogoutApi();
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return (
                    <div className="biz-welcome-sec">
                        <h1>Business Overview</h1>
                        <p>Welcome to your business administration panel.</p>
                        <div className="biz-analytics-grid">
                            <div className="biz-analytics-item">
                                <FiPackage className="biz-analytics-icon" />
                                <span className="biz-analytics-value">0</span>
                                <span className="biz-analytics-label">Total Products</span>
                            </div>
                            <div className="biz-analytics-item">
                                <FiShoppingBag className="biz-analytics-icon" />
                                <span className="biz-analytics-value">0</span>
                                <span className="biz-analytics-label">Total Orders</span>
                            </div>
                            <div className="biz-analytics-item">
                                <FiClock className="biz-analytics-icon" />
                                <span className="biz-analytics-value">0</span>
                                <span className="biz-analytics-label">Pending Orders</span>
                            </div>
                            <div className="biz-analytics-item">
                                <FiCheckCircle className="biz-analytics-icon" />
                                <span className="biz-analytics-value">0</span>
                                <span className="biz-analytics-label">Completed Orders</span>
                            </div>
                        </div>
                    </div>
                );
            case "Profile":
                return <BusinessProfile />;
            case "Products":
                return <BusinessProducts />;
            case "Orders":
                return <BusinessOrders />;
            case "Reviews":
                return <BusinessReviews />;
            case "Settings":
                return <div className="biz-card"><h2>Settings</h2><p>Account settings and security.</p></div>;
            case "RequestService":
                return <RequestServiceTab dashboardData={{}} />; // Business dashboard might need data refinement later
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="biz-dashboard-wrapper">
            <ToastContainer />

            {/* Sidebar */}
            <aside className="biz-sidebar">
                <div className="biz-sidebar-header">
                    <div className="biz-brand">
                        <span className="biz-brand-text">BUSINESS ADMIN</span>
                    </div>
                </div>

                <nav className="biz-nav">
                    <div
                        className={`biz-nav-item ${activeTab === "Dashboard" ? "active" : ""}`}
                        onClick={() => setActiveTab("Dashboard")}
                    >
                        <FiHome /> <span>Dashboard</span>
                    </div>
                    <div
                        className={`biz-nav-item ${activeTab === "Profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("Profile")}
                    >
                        <FiUser /> <span>Public Profile</span>
                    </div>
                    <div
                        className={`biz-nav-item ${activeTab === "Products" ? "active" : ""}`}
                        onClick={() => setActiveTab("Products")}
                    >
                        <FiPackage /> <span>Products</span>
                    </div>
                    <div
                        className={`biz-nav-item ${activeTab === "Orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("Orders")}
                    >
                        <FiShoppingBag /> <span>Orders</span>
                    </div>
                    <div
                        className={`biz-nav-item ${activeTab === "Reviews" ? "active" : ""}`}
                        onClick={() => setActiveTab("Reviews")}
                    >
                        <FiStar /> <span>Reviews</span>
                    </div>
                    <div
                        className={`biz-nav-item ${activeTab === "Settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("Settings")}
                    >
                        <FiSettings /> <span>Settings</span>
                    </div>
                    <div
                        className={`biz-nav-item ${activeTab === "RequestService" ? "active" : ""}`}
                        onClick={() => setActiveTab("RequestService")}
                    >
                        <FiSend /> <span>Request Service</span>
                    </div>
                </nav>

                <div className="biz-sidebar-footer">
                    <button className="biz-btn-logout" onClick={handleLogout}>
                        <FiLogOut /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="biz-main-content">
                <header className="biz-top-bar">
                    <div className="biz-header-title">
                        <h2>{activeTab}</h2>
                    </div>
                    <div className="biz-user-node">
                        <FiUser />
                        <span>Business Admin</span>
                    </div>
                </header>

                <div className="biz-content-area">
                    {loading ? (
                        <div className="biz-loading">Loading Dashboard...</div>
                    ) : renderContent()}
                </div>
            </main>
        </div>
    );
};
