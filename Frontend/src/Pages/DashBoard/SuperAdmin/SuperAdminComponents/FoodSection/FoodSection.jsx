import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import "./FoodSection.css";
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
    FiMapPin
} from "react-icons/fi";
import { FaWhatsapp, FaIdCard } from "react-icons/fa";

import { CreateFoodAdminModal } from "../CreateAdminForm/CreateFoodAdmin";
import {
    ChangeFoodAdminVerificationState,
    ChangeFoodInstState,
    ChangePaymentPlan, // Shared payment plan logic if applicable
    deleteFoodRequest,
    DeleteTheFoodInst,
    GetFoodNewReqTabData,
    GetFoodTabData,
    GetFoodUpgradeRequests,
    ApproveFoodUpgrade
} from "../../../../../ApiCalls/SuperAdminApiCall";

export const FoodSection = () => {

    const [activeTab, setActiveTab] = useState("RESTAURANT");
    const [rowData, setRowData] = useState([]);
    const [upgradeData, setUpgradeData] = useState([]);
    const [serviceReqData, setServiceReqData] = useState([]);
    const [CreateAdminFormData, setCreateAdminFormData] = useState(null);
    const [id, setId] = useState("");

    useEffect(() => {
        // SAD => Super Admin Dashboard
        if (activeTab === "RESTAURANT") {
            GetFoodTabData(activeTab, setRowData);
        } else if (activeTab === "NEW_REQUESTS") {
            GetFoodNewReqTabData(activeTab, setRowData);
        } else if (activeTab === "UPGRADE_REQUESTS") {
            GetFoodUpgradeRequests(setUpgradeData);
        } else if (activeTab === "SERVICE_REQUESTS") {
            GetFoodUpgradeRequests((reqs) => {
                const safeReqs = Array.isArray(reqs) ? reqs : [];
                setServiceReqData(safeReqs.filter(r => r.requestType === "service_request"));
            });
        }
    }, [activeTab]);

    let content = null;

    switch (activeTab) {
        case "RESTAURANT":
            content = <FoodDataTable data={rowData} setData={setRowData} />;
            break;

        case "NEW_REQUESTS":
            content = (
                <NewRequestTable
                    data={rowData}
                    setCreateAdminFormData={setCreateAdminFormData}
                    setData={setRowData}
                    setActiveTab={setActiveTab}
                    setId={setId}
                />
            );
            break;
        case "UPGRADE_REQUESTS":
            content = <UpgradeRequestTable data={upgradeData} setData={setUpgradeData} refreshFoodTable={() => GetFoodTabData("RESTAURANT", setRowData)} />;
            break;
        case "SERVICE_REQUESTS":
            content = <ServiceRequestTable data={serviceReqData} setData={setServiceReqData} refreshFoodTable={() => GetFoodTabData("RESTAURANT", setRowData)} />;
            break;

        case "AdminForm":
            content = (
                <CreateFoodAdminModal
                    id={id}
                    setActiveTab={setActiveTab}
                    Data={CreateAdminFormData}
                    setRowData={setRowData}
                />
            );
            break;

        default:
            content = null;
    }

    return (
        <section className="SA_content_body">
            <ToastContainer />
            <div className="SA_table_controls">
                <div className="SA_sub_nav">
                    <button
                        className={activeTab === "RESTAURANT" ? "SA_active" : ""}
                        onClick={() => setActiveTab("RESTAURANT")}
                    >
                        Restaurants
                    </button>

                    <button
                        className={activeTab === "NEW_REQUESTS" ? "SA_active" : ""}
                        onClick={() => setActiveTab("NEW_REQUESTS")}
                    >
                        New Requests
                    </button>

                    <button
                        className={activeTab === "UPGRADE_REQUESTS" ? "SA_active" : ""}
                        onClick={() => setActiveTab("UPGRADE_REQUESTS")}
                    >
                        Upgrade Requests
                    </button>

                    <button
                        className={activeTab === "SERVICE_REQUESTS" ? "SA_active" : ""}
                        onClick={() => setActiveTab("SERVICE_REQUESTS")}
                    >
                        Service Requests
                    </button>
                </div>
            </div>

            <div className="SA_table_container">
                {content}
            </div>

        </section>
    );
};

/* ---------------- FOOD TABLE ---------------- */

const FoodDataTable = ({ data, setData }) => {
    if (!data || data.length === 0)
        return <p className="no-data">No active food services found.</p>;
    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Admin & Service</th>
                    <th>Contact Info</th>
                    <th>Payment Plan</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {data.map((admin, i) => (
                    <tr className="SA_table_row" key={i}>

                        <td>
                            <div className="SA_admin_profile">
                                <div className="SA_row_avatar">
                                    {(admin.adminName || "A").charAt(0)}
                                </div>
                                <div>
                                    <p className="SA_admin_name">{admin.adminName}</p>
                                    <span className="SA_inst_label">
                                        {admin.ServiceName}
                                    </span>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div className="SA_contact_stack">
                                <div className="SA_contact_item">
                                    <FiMail /> <span>{admin.email}</span>
                                </div>
                                <div className="SA_contact_item">
                                    <FiMap /> <span> {admin.location}</span>
                                </div>
                                <div className="SA_contact_item">
                                    <FaWhatsapp size={15} /> <a href={`https://wa.me/${admin.whatsapp}`} target="_blank" rel="noreferrer">{admin.whatsapp}</a>
                                </div>
                                <div className="SA_contact_item">
                                    <FiPhone /> <span>{admin.phonenumber}</span>
                                </div>
                                <div className="SA_contact_item">
                                    <FaIdCard /> <span>{admin.IDCard}</span>
                                </div>
                            </div>
                        </td>

                        <td>
                            <select value={admin.PaymentPlan} className={`SA_plan_badge ${admin.PaymentPlan?.toLowerCase()}`} onChange={(e) => ChangePaymentPlan(admin.adminId, admin.InstId, setData, e.target.value, admin.ServiceType)}>
                                <option value="FREE">Free</option>
                                <option value="BASIC">Basic</option>
                                <option value="PREMIUM">Premium</option>
                                <option value="ENTERPRISE">Enterprise</option>
                            </select>
                        </td>

                        <td>
                            <div className="SA_row_actions">
                                <button
                                    title={admin.status ? "Service is active" : "Service is inactive"}
                                    className="SA_action_icon warn"
                                    onClick={() =>
                                        ChangeFoodInstState(admin.adminId, admin.InstId, setData)
                                    }
                                >
                                    {admin.status ? <FiCheckCircle /> : <FiXCircle />}
                                </button>

                                <button
                                    className="SA_action_icon danger"
                                    onClick={() =>
                                        DeleteTheFoodInst(admin.adminId, admin.InstId, setData)
                                    }
                                >
                                    <FiTrash2 />
                                </button>

                                <button
                                    title={admin.verified ? "Admin is Verified" : "Admin is not Verified"}
                                    className="SA_action_icon info"
                                    onClick={() =>
                                        ChangeFoodAdminVerificationState(admin.adminId, setData)
                                    }
                                >
                                    {admin.verified ? <FiShield /> : <FiShieldOff />}
                                </button>
                            </div>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};

/* ---------------- UPGRADE REQUEST TABLE ---------------- */

const UpgradeRequestTable = ({ data, setData, refreshFoodTable }) => {
    if (!data || data.length === 0) return <p className="no-data">No upgrade requests.</p>;
    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Admin</th>
                    <th>Service</th>
                    <th>Requested Plan</th>
                    <th>Message</th>
                    <th>Requested At</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map((r, i) => (
                    <tr key={i}>
                        <td>
                            <div className="SA_admin_profile">
                                <div className="SA_row_avatar">{(r.adminName || "A").charAt(0)}</div>
                                <div>
                                    <p className="SA_admin_name">{r.adminName}</p>
                                    <span className="SA_inst_label">{r.adminEmail}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div>{r.serviceName}</div>
                            <small>{r.serviceType}</small>
                        </td>
                        <td>{r.requestedPlan || "—"}</td>
                        <td>{r.subject}</td>
                        <td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : "—"}</td>
                        <td>
                            <div className="SA_row_actions">
                                <button className="SA_action_icon info" onClick={() => ApproveFoodUpgrade(r.serviceId, r.requestId, r.requestedPlan || "Basic", setData, refreshFoodTable)}>
                                    <FiCheckCircle />
                                </button>
                                <button className="SA_action_icon danger" onClick={() => setData(prev => prev.filter(x => x.requestId !== r.requestId))}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

/* ---------------- SERVICE REQUEST TABLE ---------------- */

const ServiceRequestTable = ({ data, setData, refreshFoodTable }) => {
    if (!data || data.length === 0) return <p className="no-data">No service requests.</p>;
    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Admin</th>
                    <th>Service Info</th>
                    <th>Requested Plan</th>
                    <th>Requested At</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map((r, i) => (
                    <tr key={i}>
                        <td>
                            <div className="SA_admin_profile">
                                <div className="SA_row_avatar">{(r.adminName || "A").charAt(0)}</div>
                                <div>
                                    <p className="SA_admin_name">{r.adminName}</p>
                                    <span className="SA_inst_label">{r.adminEmail}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div>{r.newService?.name || "N/A"}</div>
                            <small>{r.newService?.type || "—"}</small><br />
                            <small>{r.newService?.location || ""}</small>
                        </td>
                        <td>{r.requestedPlan || "Same Plan"}</td>
                        <td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : "—"}</td>
                        <td>
                            <div className="SA_row_actions">
                                <button className="SA_action_icon info" onClick={() => ApproveFoodUpgrade(r.serviceId, r.requestId, r.requestedPlan || "Premium", setData, refreshFoodTable, "service_request", r)}>
                                    <FiCheckCircle />
                                </button>
                                <button className="SA_action_icon danger" onClick={() => setData(prev => prev.filter(x => x.requestId !== r.requestId))}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
/* ---------------- NEW REQUEST TABLE ---------------- */

export const CreateFoodCataAdmin = (AdminData, setActiveTab, ServiceType, setFormSubmitted, setRows) => {
    if (typeof setFormSubmitted === 'function') setFormSubmitted(true);
    axios.post(`/CreateFoodCataAdmin`, AdminData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                if (typeof setRows === 'function' && res.data.ResponseData) {
                    setRows(res.data.ResponseData);
                }
                setActiveTab(ServiceType);
            } else {
                if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
                toast.error(res.data.message);
            }
        }).catch(() => {
            if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
            toast.error("Failed to create Food Admin.");
        });
};

const NewRequestTable = ({ data, setCreateAdminFormData, setActiveTab, setId, setData }) => {
    if (!data || data.length === 0)
        return <p className="no-data">No new requests at this time.</p>;

    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Applicant Name</th>
                    <th>Contact Details</th>
                    <th>Requested Service</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((request, i) => (
                    <tr className="SA_table_row" key={i}>
                        <td>
                            <div className="SA_admin_profile">
                                <div className="SA_row_avatar">
                                    {(request.fullname || "U").charAt(0)}
                                </div>
                                <div className="SA_admin_info_col">
                                    <p className="SA_admin_name">{request.fullname}</p>
                                    <span className={`service-source-badge ${(request.source === "AUTHENTICATED_ADMIN" || request.newServiceDetails) ? "source-admin" : "source-public"}`}>
                                        {(request.source === "AUTHENTICATED_ADMIN" || request.newServiceDetails) ? "Admin Request" : "Public Registration"}
                                    </span>
                                    {/* Display Existing Sectors */}
                                    {request.existingSectors && request.existingSectors.length > 0 && (
                                        <div className="existing-sectors-badges">
                                            {request.existingSectors.map((sector, idx) => (
                                                <span key={idx} className="sector-badge">{sector}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </td>

                        <td>
                            <div className="SA_contact_stack">
                                {request.email && (
                                    <div className="SA_contact_item">
                                        <FiMail /> <span>{request.email}</span>
                                    </div>
                                )}
                                {request.phonenumber && (
                                    <div className="SA_contact_item">
                                        <FiPhone /> <span>{request.phonenumber}</span>
                                    </div>
                                )}
                                {request.whatsappnumber && (
                                    <div className="SA_contact_item">
                                        <FaWhatsapp /> <a href={`https://wa.me/${request.whatsappnumber}`} target="_blank" rel="noopener noreferrer">{request.whatsappnumber}</a>
                                    </div>
                                )}
                                {request.IDCard && request.IDCard !== "MIGRATED_USER" && (
                                    <div className="SA_contact_item">
                                        <FaIdCard /> <span>{request.IDCard}</span>
                                    </div>
                                )}
                            </div>
                        </td>

                        <td>
                            {request.newServiceDetails ? (
                                <div className="SA_requested_service_card">
                                    <p className="service_name">{request.newServiceDetails.name}</p>
                                    <p className="service_meta"><FiMapPin /> {request.newServiceDetails.location}</p>
                                    {request.newServiceDetails.message && <p className="service_msg">"{request.newServiceDetails.message}"</p>}
                                </div>
                            ) : (
                                <span className="SA_no_details">New Registration Request</span>
                            )}
                        </td>
                        <td>
                            <div className="SA_row_actions">
                                <button
                                    className="SA_action_icon info"
                                    title="Approve & Create Admin"
                                    onClick={() => {
                                        setId(request._id);
                                        setCreateAdminFormData(request);
                                        setActiveTab("AdminForm");
                                    }}
                                >
                                    <FiPlus />
                                </button>
                                <button className="SA_action_icon danger" title="Reject Request" onClick={() => { deleteFoodRequest(request._id, setData) }}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};
