import { useEffect, useRef, useState } from "react";
import "./SuperAdminLayout.css";
import NotificationAudio from "../../../../Assests/whatsappAudio2.mp3";
import { FiHome, FiUsers, FiLogOut } from "react-icons/fi";
import {
    MdOutlineSchool,
    MdOutlineBusiness,
    MdOutlineLocalHospital,
    MdOutlineRestaurant,
    MdOutlineCastForEducation
} from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../../../components/navbar/Navbar";
import { SuperAdminHomeSec } from "../SuperAdminComponents/HomeSection/SuprAdminHomeSec";
import { EducationSection } from "../SuperAdminComponents/EductionSection/EductionSection";
import { FoodSection } from "../SuperAdminComponents/FoodSection/FoodSection";
import { HealthSection } from "../SuperAdminComponents/HealthSection/HealthSection";
import { BusinessSection } from "../SuperAdminComponents/BusinessSection/BusinessSection";
import { OCSection } from "../SuperAdminComponents/OCSection/OCSection";
import { SAAddManagerForm } from "../SuperAdminComponents/SAAddManagers/SAAddManagers";
import { VerifyTheSuperAdmin, GetEducationNotificationCounts, GetFoodNotificationCounts, GetHealthNotificationCounts, GetBusinessNotificationCounts, logoutSuperAdmin } from "../../../../ApiCalls/SuperAdminApiCall";
import { socket } from "../Socket";

/* ---------------- SIDEBAR CONFIG ---------------- */

const SIDEBAR_ITEMS = [
    { key: "Home", title: "Home", tab: "", icon: <FiHome /> },
    { key: "Education", title: "Education", tab: "Education", icon: <MdOutlineSchool /> },
    { key: "Restaurant", title: "Food", tab: "Restaurant", icon: <MdOutlineRestaurant /> },
    { key: "Health", title: "Health", tab: "Health", icon: <MdOutlineLocalHospital /> },
    { key: "Business", title: "Business", tab: "Business", icon: <MdOutlineBusiness /> },
    { key: "OnlineCourses", title: "Online Courses", tab: "OnlineCourses", icon: <MdOutlineCastForEducation /> },
    { key: "AddManagers", title: "Add Managers", tab: "AddManagers", icon: <FiUsers /> }
];

const getAllowedSidebarItems = (role) => {
    if (!role) return [];
    if (role === "SUPER_ADMIN" || role === "All") return SIDEBAR_ITEMS;
    return SIDEBAR_ITEMS.filter((item) => {
        if (item.key === "Home" || item.key === role) return true;
        if (role === "Education" && item.key === "OnlineCourses") return true;
        return false;
    });
};

export const SuperAdminDashboard = () => {
    const [currentTab, setCurrentTab] = useState("");
    const [role, setRole] = useState(null);
    const [superAdminEmail, setSuperAdminEmail] = useState("");
    const [SAManagers, setSAManagers] = useState(null);
    const [, setNotifications] = useState([]);
    const [tabNotifCounts, setTabNotifCounts] = useState({ Education: 0, Restaurant: 0, Health: 0, Business: 0 });
    const [eduNotifCounts, setEduNotifCounts] = useState({ admissions: 0, requests: 0 });

    const audioRef = useRef(new Audio(NotificationAudio));
    const audioUnlocked = useRef(false);

    useEffect(() => {
        audioRef.current.volume = 1;
        const unlockAudio = () => {
            audioRef.current.play().then(() => {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioUnlocked.current = true;
            }).catch(() => {});
            window.removeEventListener("click", unlockAudio);
        };
        window.addEventListener("click", unlockAudio);
        return () => window.removeEventListener("click", unlockAudio);
    }, []);

    const playNotificationSound = () => {
        if (!audioUnlocked.current) return;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
    };

    useEffect(() => {
        VerifyTheSuperAdmin(setRole, setSuperAdminEmail, setSAManagers);
    }, []);

    // Fetch initial counts for all sectors
    useEffect(() => {
        if (role === "SUPER_ADMIN" || role === "All") {
            GetEducationNotificationCounts(setEduNotifCounts);
            GetFoodNotificationCounts(setTabNotifCounts);
            GetHealthNotificationCounts(setTabNotifCounts);
            GetBusinessNotificationCounts(setTabNotifCounts);
        } else if (role === "Education") {
            GetEducationNotificationCounts(setEduNotifCounts);
        } else if (role === "Food") {
            GetFoodNotificationCounts(setTabNotifCounts);
        } else if (role === "Health") {
            GetHealthNotificationCounts(setTabNotifCounts);
        } else if (role === "Business") {
            GetBusinessNotificationCounts(setTabNotifCounts);
        }
    }, [role]);

    // Update total Education count in sidebar when sub-counts change
    useEffect(() => {
        const totalEdu = eduNotifCounts.admissions + eduNotifCounts.requests;
        setTabNotifCounts(prev => ({
            ...prev,
            Education: totalEdu
        }));
    }, [eduNotifCounts]);

    useEffect(() => {
        socket.connect();
        socket.emit("join_superadmin");

        const notificationHandler = (payload) => {
            setNotifications((prev) => [payload, ...prev]);

            if (payload?.type === "NEW_ADMISSION_REQUEST") {
                setEduNotifCounts(prev => ({ ...prev, admissions: prev.admissions + 1 }));
            } else if (payload?.type === "NEW_EDU_SERVICE_REQUEST") {
                setEduNotifCounts(prev => ({ ...prev, requests: prev.requests + 1 }));
            } else if (payload?.type === "NEW_SERVICE_REQUEST") {
                // Handling generic requests from commonCont.js
                const category = payload.data?.category; // e.g., "Food", "Health", "Business"
                if (category === "Education") {
                    setEduNotifCounts(prev => ({ ...prev, requests: prev.requests + 1 }));
                } else if (category === "Food") {
                    setTabNotifCounts(prev => ({ ...prev, Restaurant: (prev.Restaurant || 0) + 1 }));
                } else if (category === "Health") {
                    setTabNotifCounts(prev => ({ ...prev, Health: (prev.Health || 0) + 1 }));
                } else if (category === "Business") {
                    setTabNotifCounts(prev => ({ ...prev, Business: (prev.Business || 0) + 1 }));
                }
            } else if (payload?.type === "NEW_DOCTOR_REQUEST") {
                setTabNotifCounts((prev) => ({
                    ...prev,
                    Health: (prev.Health || 0) + 1
                }));
            }
            playNotificationSound();
        };

        socket.on("new_notification", notificationHandler);
        return () => {
            socket.off("new_notification", notificationHandler);
            socket.disconnect();
        };
    }, []);

    const handleTabClick = (tab) => {
        setCurrentTab(tab);
        if (tab !== "Education") {
            setTabNotifCounts((prev) => ({ ...prev, [tab]: 0 }));
        }
    };

    const sidebarItems = getAllowedSidebarItems(role);

    /* -------- CONTENT RENDERING -------- */
    let content = null;

    // Block unauthorized content for managers
    const isAuthorized = role === "SUPER_ADMIN" || role === "All" || currentTab === "" || currentTab === role || (role === "Education" && currentTab === "OnlineCourses");

    if (!isAuthorized) {
        content = (
            <div className="SA_empty_state">
                You are not authorized to access this module.
            </div>
        );
    } else {
        switch (currentTab) {
            case "":
                content = <SuperAdminHomeSec />;
                break;
            case "Education":
                content = <EducationSection notifCounts={eduNotifCounts} setEduNotifCounts={setEduNotifCounts} />;
                break;
            case "Restaurant":
                content = <FoodSection />;
                break;
            case "Health":
                content = <HealthSection />;
                break;
            case "Business":
                content = <BusinessSection />;
                break;
            case "OnlineCourses":
                content = <OCSection />;
                break;
            case "AddManagers":
                content = (
                    <SAAddManagerForm
                        SuperAdminEmail={superAdminEmail}
                        SAManagers={SAManagers}
                        setSAManagers={setSAManagers}
                    />
                );
                break;
            default:
                content = <div className="SA_empty_state">Welcome. Please select a module.</div>;
        }
    }

    return (
        <div className="SA_main_wrapper">
            <header><Navbar variant={"SuperAdmin"} /></header>
            <main className="SA_layout">
                <aside className="SA_sidebar">
                    <div className="SA_brand_mark" onClick={() => setCurrentTab("")}>
                        DK
                    </div>
                    <nav className="SA_side_nav">
                        {sidebarItems.length > 0 ? (
                            sidebarItems.map((item) => (
                                <li
                                    key={item.key}
                                    title={item.title}
                                    className={currentTab === item.tab ? "active" : ""}
                                    onClick={() => handleTabClick(item.tab)}
                                    style={{ position: "relative" }}
                                >
                                    {item.icon}
                                    {tabNotifCounts[item.tab] > 0 && (
                                        <span className="SA_notif_badge">{tabNotifCounts[item.tab]}</span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <div className="SA_sidebar_loading">...</div>
                        )}
                        <li 
                            title="Logout" 
                            onClick={logoutSuperAdmin} 
                            className="SA_logout_item"
                            style={{ marginTop: "auto" }}
                        >
                            <FiLogOut />
                        </li>
                    </nav>
                </aside>
                <div className="SA_content_main">{content}</div>
            </main>
        </div>
    );
};

