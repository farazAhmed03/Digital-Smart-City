import "react-icons";
import "./Dashboard.css";
// Importing icons from react-icons library
import {
    FiUser,
    FiInfo,
    FiUsers,
    FiCalendar,
    FiImage,
    FiMessageSquare,
    FiMenu,
    FiX,
    FiSend
} from "react-icons/fi";

import { MdAnalytics, MdManageAccounts, MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaAddressBook, FaRegMoneyBillAlt } from "react-icons/fa";
import { GetTheDashboardDta, SwitchDashBoard } from "../../../../ApiCalls/DashBoardApiCalls";
import { useEffect, useState } from "react";
import { ProfileContent } from "../ScholAndColDshbrdComp/Profile/Profile";
import { BasicInfoForm } from "../ScholAndColDshbrdComp/BasicInfo/BasicInfo";
import { AdminManagingForm } from "../ScholAndColDshbrdComp/Admin/Admin";
import { EventManagingForm } from "../ScholAndColDshbrdComp/EventsAndActivity/Events";
import { StaffMangingForm } from "../ScholAndColDshbrdComp/Staff/Staff";
import { FeeStructure } from "../ScholAndColDshbrdComp/Fees/Fee";
import { GalleryForm } from "../ScholAndColDshbrdComp/Gallery/gallery";
import { ReviewForm } from "../ScholAndColDshbrdComp/Reviews/Review";
import { AddManagerForm } from "../ScholAndColDshbrdComp/AddManager/AddManagerForm";
import { NewAdmissions } from "../ScholAndColDshbrdComp/NewAdmissions/NewAdmissions";
import { RequestServiceTab } from "../../ProviderDashboard/Components/RequestServiceTab";
import planLimits from "../../../../utils/planLimits";

export const SchoolAndClgDashBoard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [AdminOtherServices, setAdminOtherServices] = useState(undefined);
    const [isSwitchOpen, setIsSwitchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    let [currentTab, setCurrentTab] = useState("Profile");


    useEffect(() => {
        GetTheDashboardDta(setDashboardData, setLoading, setAdminOtherServices);
    }, []);

    let content;
    switch (currentTab) {
        case "Profile":
            content = <ProfileContent dashboardData={dashboardData} />;
            break;
        case "Basic Info":
            content = <BasicInfoForm dashboardData={dashboardData} />;
            break;
        case "Admin":
            content = <AdminManagingForm dashboardData={dashboardData} />;
            break;
        case "Staff":
            content = <StaffMangingForm dashboardData={dashboardData} />;
            break;
        case "EvntsAndActvty":
            content = <EventManagingForm dashboardData={dashboardData} />;
            break;
        case "Fee Structure":
            content = <FeeStructure dashboardData={dashboardData} />;
            break;
        case "Gallery":
            content = <GalleryForm dashboardData={dashboardData} />;
            break;
        case "Reviews":
            content = <ReviewForm dashboardData={dashboardData} />;
            break;
        case "Manager":
            content = <AddManagerForm OtherServices={AdminOtherServices} />
            break;
        case "Admissions":
            content = <NewAdmissions dashboardData={dashboardData} />
            break;
        case "Request Service":
            content = <RequestServiceTab dashboardData={dashboardData} />
            break;
        default:
            content = <ProfileContent />;
    }
    return (
        <>
            {
                (loading)
                    ?
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <p>Loading dashboard...</p>
                    </div>
                    :
                    <>
                        <section className="layout">
                            <aside className={`DshBrdsidebar ${isMobileMenuOpen ? "open" : ""}`}>
                                <ul>
                                    <li
                                        className={currentTab === "Profile" ? "active" : ""}
                                        onClick={() => {
                                            setCurrentTab("Profile");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <i><FiUser className="DshbrdSidbrIcn" /></i>
                                        <p className="DshbrdtagName">Profile</p>
                                    </li>

                                    {dashboardData?.role === "admin" && (
                                        <li
                                            className={currentTab === "Request Service" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("Request Service");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><FiSend className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Request Service</p>
                                        </li>
                                    )}

                                    <li
                                        className={currentTab === "Basic Info" ? "active" : ""}
                                        onClick={() => {
                                            setCurrentTab("Basic Info");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <i><FiInfo className="DshbrdSidbrIcn" /></i>
                                        <p className="DshbrdtagName">Basic Info</p>
                                    </li>

                                    {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Admin") && (
                                        <li
                                            className={currentTab === "Admin" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("Admin");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><MdOutlineAdminPanelSettings className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Admin</p>
                                        </li>
                                    )}

                                    {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Staff") && (
                                        <li
                                            className={currentTab === "Staff" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("Staff");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><FiUsers className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Staff</p>
                                        </li>
                                    )}

                                    {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Events") && (
                                        <li
                                            className={currentTab === "EvntsAndActvty" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("EvntsAndActvty");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><FiCalendar className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Events</p>
                                        </li>
                                    )}

                                    {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Fee Structure") && (
                                        <li
                                            className={currentTab === "Fee Structure" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("Fee Structure");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><FaRegMoneyBillAlt className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Fee Structure</p>
                                        </li>
                                    )}

                                    {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Admissions") && (
                                        <li
                                            className={currentTab === "Admissions" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("Admissions");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><FaAddressBook className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Admissions</p>
                                        </li>
                                    )}

                                    {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Gallery") && (
                                        <li
                                            className={currentTab === "Gallery" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("Gallery");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><FiImage className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Gallery</p>
                                        </li>
                                    )}

                                    {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Reviews") && (
                                        <li
                                            className={currentTab === "Reviews" ? "active" : ""}
                                            onClick={() => {
                                                setCurrentTab("Reviews");
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <i><FiMessageSquare className="DshbrdSidbrIcn" /></i>
                                            <p className="DshbrdtagName">Reviews</p>
                                        </li>
                                    )}

                                    {
                                        (dashboardData?.role === "admin" && AdminOtherServices)
                                            ?
                                            <>
                                                {/* SWITCH DASHBOARD TAB */}
                                                {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Multiple Institutes") && (
                                                    <li
                                                        className={currentTab === "Dashboard" ? "active" : ""}
                                                        onClick={() => setIsSwitchOpen(prev => !prev)}
                                                    >
                                                        <i>
                                                            <MdAnalytics className="DshbrdSidbrIcn" />
                                                        </i>
                                                        <p className="DshbrdtagName">Switch Dashboard</p>
                                                    </li>
                                                )}

                                                {/* DROPDOWN */}
                                                {isSwitchOpen && Array.isArray(AdminOtherServices) && (
                                                    <ul className="dashboard-dropdown">
                                                        {AdminOtherServices.map(service => (
                                                            <li
                                                                key={service.ServiceId}
                                                                className="dropdown-item"
                                                                onClick={() => {
                                                                    setCurrentTab("Dashboard");
                                                                    setIsSwitchOpen(false);

                                                                    SwitchDashBoard(
                                                                        service.ServiceName,
                                                                        service.ServiceId,
                                                                        service.ServiceType,
                                                                        setDashboardData,
                                                                        setAdminOtherServices
                                                                    );

                                                                    setIsMobileMenuOpen(false); // close sidebar on mobile
                                                                }}
                                                            >
                                                                {service.ServiceName}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* ADD MANAGER TAB */}
                                                {planLimits[dashboardData?.PaymentPlan || "FREE"]?.features.includes("Add Manager") && (
                                                    <li
                                                        className={currentTab === "Manager" ? "active" : ""}
                                                        onClick={() => {
                                                            setCurrentTab("Manager");
                                                            setIsSwitchOpen(false);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        <i>
                                                            <MdManageAccounts className="DshbrdSidbrIcn" />
                                                        </i>
                                                        <p className="DshbrdtagName">Add Manager</p>
                                                    </li>
                                                )}
                                            </>
                                            :
                                            <></>
                                    }

                                </ul>
                            </aside>

                            <section className="content">
                                {content}
                            </section>
                        </section>

                        {/* MOBILE FLOATING TOGGLE BUTTON */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        >
                            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>

                    </>
            }
        </>
    )
};
