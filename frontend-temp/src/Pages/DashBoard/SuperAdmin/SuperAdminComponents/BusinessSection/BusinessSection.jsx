import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "../EductionSection/EductionSection.css"; // Reuse styles
import {
    FiTrash2,
    FiPlus,
    FiPhone,
    FiMail,
    FiCheckCircle,
    FiXCircle,
    FiShield,
    FiShieldOff,
    FiMap,
    FiSearch,
    FiClock,
    FiAlertCircle
} from "react-icons/fi";
import { FaWhatsapp, FaIdCard } from "react-icons/fa";
import { HiOutlineLanguage } from "react-icons/hi2";

import { CreateAdminModal } from "../CreateAdminForm/CreateAdmin";
import {
    GetBusinessesByStatus,
    UpdateBusinessStatus
} from "../../../../../ApiCalls/SuperAdminApiCall";

export const BusinessSection = () => {
    const [activeTab, setActiveTab] = useState("approved"); // Default: approved businesses
    const [rowData, setRowData] = useState([]);
    const [CreateAdminFormData, setCreateAdminFormData] = useState(null);
    const [id, setId] = useState("");

    const fetchTabData = () => {
        if (activeTab === "AdminForm") return;
        GetBusinessesByStatus(activeTab, setRowData);
    };

    useEffect(() => {
        fetchTabData();
    }, [activeTab]);

    const handleAction = (id, newStatus, fromCollection) => {
        UpdateBusinessStatus(id, newStatus, fromCollection, fetchTabData);
    };

    let content = null;

    if (activeTab === "AdminForm") {
        content = (
            <CreateAdminModal
                id={id}
                setActiveTab={setActiveTab}
                Data={CreateAdminFormData}
            />
        );
    } else {
        content = (
            <BusinessManagementTable
                data={rowData}
                status={activeTab}
                onAction={handleAction}
                setCreateAdminFormData={setCreateAdminFormData}
                setId={setId}
                setActiveTab={setActiveTab}
            />
        );
    }

    const tabs = [
        { label: "Businesses", status: "approved" },
        { label: "New Requests", status: "new_request" },
        { label: "Under Review", status: "under_review" },
        { label: "Pending", status: "pending" },
        { label: "Rejected", status: "rejected" },
        { label: "Suspended", status: "suspended" }
    ];

    return (
        <section className="SA_content_body">
            <div className="SA_table_controls">
                <div className="SA_sub_nav" style={{ overflowX: "auto", display: "flex", gap: "10px" }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.status}
                            className={activeTab === tab.status ? "SA_active" : ""}
                            onClick={() => setActiveTab(tab.status)}
                            style={{ whiteSpace: "nowrap" }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="SA_table_container">
                {content}
            </div>
        </section>
    );
};

const BusinessManagementTable = ({ data, status, onAction, setCreateAdminFormData, setId, setActiveTab }) => {
    if (!data || data.length === 0)
        return <p className="no-data">No businesses found in this category.</p>;

    const isRequest = !["approved", "suspended"].includes(status);
    const fromCollection = isRequest ? "NRs" : "Business";

    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Business & Owner</th>
                    <th>Contact Info</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((biz, i) => (
                    <tr className="SA_table_row" key={i}>
                        <td>
                            <div className="SA_admin_profile">
                                <div className="SA_row_avatar">
                                    {(biz.businessName || biz.fullname || "B").charAt(0)}
                                </div>
                                <div>
                                    <p className="SA_admin_name">{biz.businessName || biz.fullname || "N/A"}</p>
                                    <span className="SA_inst_label">Owner: {biz.ownerName || biz.fullname || "N/A"}</span>
                                    {isRequest && (
                                        <span className={`service-source-badge ${(biz.source === "AUTHENTICATED_ADMIN" || biz.newServiceDetails) ? "source-admin" : "source-public"}`} style={{ display: 'block' }}>
                                            {(biz.source === "AUTHENTICATED_ADMIN" || biz.newServiceDetails) ? "Admin Request" : "Public Registration"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="SA_contact_stack">
                                {(biz.adminEmail || biz.email) && <div className="SA_contact_item"><FiMail /> <span>{biz.adminEmail || biz.email}</span></div>}
                                {(biz.phone || biz.phonenumber) && <div className="SA_contact_item"><FiPhone /> <span>{biz.phone || biz.phonenumber}</span></div>}
                                {biz.whatsappnumber && <div className="SA_contact_item"><FaWhatsapp /> <span>{biz.whatsappnumber}</span></div>}
                            </div>
                        </td>
                        <td>
                            <div className="SA_contact_stack">
                                <div className="SA_contact_item"><HiOutlineLanguage /> <span>{biz.language || "N/A"}</span></div>
                                <div className="SA_contact_item"><FiMap /> <span>{biz.address || "Kohat"}</span></div>
                                <div className="SA_contact_item"><FaIdCard /> <span>{biz.idCard || biz.IDCard}</span></div>
                            </div>
                        </td>
                        <td>
                            <span className={`SA_plan_badge ${status.toLowerCase()}`}>
                                {status.replace("_", " ")}
                            </span>
                        </td>
                        <td>
                            <div className="SA_row_actions">
                                {status !== "approved" && (
                                    <button
                                        className="SA_action_icon info"
                                        title="Approve / Setup"
                                        onClick={() => {
                                            if (isRequest) {
                                                setId(biz._id);
                                                setCreateAdminFormData({
                                                    ...biz,
                                                    AdminName: biz.fullname,
                                                    AdminEmail: biz.email,
                                                    AdminIDCard: biz.IDCard,
                                                    ServiceName: biz.fullname + "'s Business",
                                                    ServiceType: "BUSINESS",
                                                    reqId: biz._id
                                                });
                                                setActiveTab("AdminForm");
                                            } else {
                                                onAction(biz._id, "approved", "Business");
                                            }
                                        }}
                                    >
                                        <FiPlus />
                                    </button>
                                )}

                                {status === "new_request" && (
                                    <button
                                        className="SA_action_icon"
                                        style={{ color: "#f39c12" }}
                                        title="Mark Under Review"
                                        onClick={() => onAction(biz._id, "under_review", fromCollection)}
                                    >
                                        <FiSearch />
                                    </button>
                                )}

                                {status === "under_review" && (
                                    <button
                                        className="SA_action_icon"
                                        style={{ color: "#3498db" }}
                                        title="Mark Pending"
                                        onClick={() => onAction(biz._id, "pending", fromCollection)}
                                    >
                                        <FiClock />
                                    </button>
                                )}

                                {status !== "rejected" && status !== "approved" && (
                                    <button
                                        className="SA_action_icon danger"
                                        title="Reject"
                                        onClick={() => onAction(biz._id || biz.id, "rejected", fromCollection)}
                                    >
                                        <FiXCircle />
                                    </button>
                                )}

                                {status === "approved" && (
                                    <button
                                        className="SA_action_icon danger"
                                        title="Suspend"
                                        onClick={() => onAction(biz._id || biz.id, "suspended", "Business")}
                                    >
                                        <FiAlertCircle />
                                    </button>
                                )}

                                {(status === "rejected" || status === "suspended") && (
                                    <button
                                        className="SA_action_icon info"
                                        title="Re-activate / Pending"
                                        onClick={() => onAction(biz._id || biz.id, "pending", fromCollection)}
                                    >
                                        <FiCheckCircle />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
