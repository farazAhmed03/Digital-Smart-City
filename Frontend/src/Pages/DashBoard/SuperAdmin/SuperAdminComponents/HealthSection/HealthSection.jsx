import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "./HealthSection.css";
import { FiTrash2, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiCalendar, FiMapPin, FiType, FiLayers, FiPlus, FiShield, FiShieldOff, FiEdit, FiClock } from "react-icons/fi";
import { FaWhatsapp, FaIdCard } from "react-icons/fa";
import { HiOutlineLanguage } from "react-icons/hi2";
import { CreateHealthAdminModal } from "../CreateAdminForm/CreateHealthAdmin";
import * as ApiCall from "../../../../../ApiCalls/SuperAdminApiCall";

export const HealthSection = () => {
    const [activeTab, setActiveTab] = useState("SPECIALIST");
    const [rowData, setRowData] = useState([]);
    const [CreateAdminFormData, setCreateAdminFormData] = useState(null);
    const [id, setId] = useState("");

    useEffect(() => {
        if (activeTab === "NEW_REQUESTS") {
            ApiCall.GetHealthNewReqTabData(activeTab, setRowData);
        } else if (activeTab === "SPECIALIST") {
            ApiCall.GetHealthTabData(activeTab, setRowData);
        }
    }, [activeTab]);

    let content = null;
    switch (activeTab) {
        case "NEW_REQUESTS":
            content = (
                <HealthRequestTable
                    data={rowData}
                    setCreateAdminFormData={setCreateAdminFormData}
                    setData={setRowData}
                    setActiveTab={setActiveTab}
                    setId={setId}
                />
            );
            break;

        case "SPECIALIST":
            content = <SpecialistDataTable data={rowData} setData={setRowData} setActiveTab={setActiveTab} />;
            break;



        case "AdminForm":
            content = (
                <CreateHealthAdminModal
                    id={id}
                    setActiveTab={setActiveTab}
                    Data={CreateAdminFormData}
                />
            );
            break;

        default:
            content = null;
    }

    return (
        <section className="SA_content_body">
            <div className="SA_table_controls">
                <div className="SA_sub_nav">
                    <button
                        className={activeTab === "SPECIALIST" ? "SA_active" : ""}
                        onClick={() => setActiveTab("SPECIALIST")}
                    >
                        Specialists
                    </button>

                    <button
                        className={activeTab === "NEW_REQUESTS" ? "SA_active" : ""}
                        onClick={() => setActiveTab("NEW_REQUESTS")}
                    >
                        New Requests
                    </button>
                </div>
            </div>

            <div className="SA_table_container">
                {content}
            </div>
        </section>
    );
};

/* ---------------- SHARED ACTION BUTTONS ---------------- */

const HealthActionButtons = ({
    type,
    data,
    setData,
    setCreateAdminFormData,
    setId,
    setActiveTab
}) => {

    const handleStatusToggle = () => {
        ApiCall.ChangeHealthServiceState(
            data.adminId,
            data.serviceId,
            data.serviceType,
            setData
        );
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            ApiCall.DeleteTheHealthService(
                data.adminId,
                data.serviceType,
                data.serviceId,
                setData
            );
        }
    };

    const handleVerifyToggle = () => {
        ApiCall.ChangeHealthAdminVerificationState(
            data.adminId,
            setData
        );
    };

    const handleRequestApprove = () => {
        setId(data._id);
        setCreateAdminFormData(data);
        setActiveTab("AdminForm");
    };

    const handleRequestReject = () => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            ApiCall.DeleteHealthRequest(
                data._id,
                setData
            );
        }
    };

    return (
        <div className="SA_row_actions">
            <ToastContainer />
            {type === "REQUEST" ? (
                <>
                    <button
                        className="SA_action_icon info"
                        title="Approve & Create Admin"
                        onClick={handleRequestApprove}
                    >
                        <FiPlus />
                    </button>

                    <button
                        className="SA_action_icon danger"
                        title="Reject Request"
                        onClick={handleRequestReject}
                    >
                        <FiTrash2 />
                    </button>
                </>
            ) : (
                <>
                    {/* Enable / Disable */}
                    <button
                        title={data.serviceStatus ? "Disable Service" : "Enable Service"}
                        className={`SA_action_icon ${data.serviceStatus ? "btn-enable" : "btn-disable"}`}
                        onClick={handleStatusToggle}
                    >
                        {data.serviceStatus ? <FiCheckCircle /> : <FiXCircle />}
                    </button>

                    {/* Delete */}
                    <button
                        className="SA_action_icon danger"
                        title="Delete Service"
                        onClick={handleDelete}
                    >
                        <FiTrash2 />
                    </button>

                    {/* Verify Admin */}
                    <button
                        title={data.verified ? "Admin is Verified" : "Admin is not Verified"}
                        className="SA_action_icon info"
                        onClick={handleVerifyToggle}
                    >
                        {data.verified ? <FiShield /> : <FiShieldOff />}
                    </button>
                </>
            )}
        </div>
    );
};

/* ---------------- SPECIALIST DATA TABLE ---------------- */

const SpecialistDataTable = ({ data, setData }) => {
    if (!data || data.length === 0)
        return <p className="no-data">No active specialists found.</p>;

    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Doctor & Clinic</th>
                    <th>Specialization & Exp</th>
                    <th>Contact & Location</th>
                    <th>Ratings & Plan</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((admin, i) => (
                    <tr className="SA_table_row" key={i}>
                        <td>
                            <div className="SA_admin_profile">
                                <div className="SA_row_avatar">
                                    {(admin.adminName || "D").charAt(0)}
                                </div>
                                <div>
                                    <p className="SA_admin_name">{admin.adminName}</p>
                                    <span className="SA_inst_label">
                                        {admin.serviceType || admin.serviceName}
                                    </span>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div className="SA_contact_stack">
                                {admin.specialization && (
                                    <span className="health-specialization-badge" style={{ width: 'fit-content' }}>
                                        {admin.specialization}
                                    </span>
                                )}
                                <div className="SA_contact_item">
                                    <b>Experience:</b> <span>{admin.experience || 0} Years</span>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div className="SA_contact_stack">
                                {admin.email && (
                                    <div className="SA_contact_item">
                                        <FiMail /> <span>{admin.email}</span>
                                    </div>
                                )}
                                {admin.location && (
                                    <div className="SA_contact_item">
                                        <FiMapPin /> <span>{admin.location}</span>
                                    </div>
                                )}
                                {admin.whatsapp && (
                                    <div className="SA_contact_item">
                                        <FaWhatsapp /> <span><a href={`https://wa.me/${admin.whatsapp}`} target="_blank">{admin.whatsapp}</a></span>
                                    </div>
                                )}
                                {admin.phonenumber && (
                                    <div className="SA_contact_item">
                                        <FiPhone /> <span>{admin.phonenumber}</span>
                                    </div>
                                )}
                            </div>
                        </td>

                        <td>
                            <div className="SA_contact_stack">
                                <span className="health-rating-badge">
                                    ⭐ {admin.rating || 0} / 5
                                </span>
                                <select
                                    value={admin.PaymentPlan}
                                    className={`SA_plan_badge ${admin.PaymentPlan?.toLowerCase()}`}
                                    onChange={(e) => ApiCall.UpdateHealthServicePlan(admin.adminId, admin.serviceId, "SPECIALIST", e.target.value, setData)}
                                >
                                    <option value="FREE">Free</option>
                                    <option value="BASIC">Basic</option>
                                    <option value="PREMIUM">Premium</option>
                                    <option value="ENTERPRISE">Enterprise</option>
                                </select>
                            </div>
                        </td>

                        <td>
                            <HealthActionButtons
                                type="SPECIALIST"
                                data={admin}
                                setData={setData}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};



/* ---------------- HEALTH REQUEST TABLE ---------------- */

const HealthRequestTable = ({ data, setCreateAdminFormData, setActiveTab, setId, setData }) => {
    if (!data || data.length === 0)
        return <p className="no-data">No new health requests at this time.</p>;

    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Service Name / Full Name</th>
                    <th>Contact Details</th>
                    <th>Requested Service</th>
                    <th>Request Metadata</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((request, i) => (
                    <tr className="SA_table_row" key={i}>
                        <td>
                            <div className="SA_admin_profile">
                                <div className="SA_row_avatar">
                                    {(request.fullname || "H").charAt(0)}
                                </div>
                                <div>
                                    <p className="SA_admin_name">{request.fullname}</p>
                                    <span className={`service-source-badge ${(request.source === "AUTHENTICATED_ADMIN" || request.newServiceDetails) ? "source-admin" : "source-public"}`}>
                                        {(request.source === "AUTHENTICATED_ADMIN" || request.newServiceDetails) ? "Admin Request" : "Public Registration"}
                                    </span>
                                    <span className="health-request-date">
                                        <FiCalendar /> {new Date(request.createdAt).toLocaleDateString()}
                                    </span>
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
                            <div className="SA_contact_stack">
                                <div className="SA_contact_item">
                                    <FiLayers /> <b>Category:</b> <span>{request.catagory}</span>
                                </div>
                                <div className="SA_contact_item">
                                    <FiType /> <b>Type:</b> <span>{request.type}</span>
                                </div>
                                <div className="SA_contact_item">
                                    <FiMapPin /> <b>Address:</b> <span>{request.location}</span>
                                </div>
                                <div className="SA_contact_item">
                                    <HiOutlineLanguage /> <b>Language:</b> <span>{request.language}</span>
                                </div>
                                <div className="SA_contact_item">
                                    <b>Status:</b> <span className={`status-badge ${request.status?.toLowerCase()}`}>{request.status || "Pending"}</span>
                                </div>
                            </div>
                        </td>

                        <td>
                            <HealthActionButtons
                                type="REQUEST"
                                data={request}
                                setData={setData}
                                setCreateAdminFormData={setCreateAdminFormData}
                                setId={setId}
                                setActiveTab={setActiveTab}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
