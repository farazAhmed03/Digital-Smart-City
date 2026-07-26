import React, { useState } from "react";
import { updateOrderStatus, deleteOrder } from "../../../../ApiCalls/HealthDashboardApiCall";
import { MessageSquare, Trash2, ExternalLink, User, Phone, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

const ManageOrders = ({ data }) => {
    const [orders, setOrders] = useState(data.Orders || []);

    const handleStatusUpdate = (id, status) => {
        updateOrderStatus(id, status, setOrders);
    };

    const handleNotifyWhatsApp = (order) => {
        const number = order.whatsappNumber || order.phone;

        if (!number) {
            alert("No contact number available");
            return;
        }

        // ✅ Clean & format number (Pakistan format)
        const cleanNumber = number.replace(/\D/g, "");
        const finalNumber = cleanNumber.startsWith("92")
            ? cleanNumber
            : `92${cleanNumber.replace(/^0/, "")}`;

        // ✅ Fallbacks
        const customerName = order.customerName || "Customer";
        const shortOrderId = order._id?.toString().slice(-6) || "XXXXXX";

        // ✅ Format Date
        const formattedDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "";

        // ✅ Normalize status
        const status = (order.status || "").toLowerCase();

        // ✅ Status mapping
        let statusLabel = "";
        let statusMessage = "";

        switch (status) {
            case "pending":
                statusLabel = "Pending ⏳";
                statusMessage =
                    "Your request has been received and is currently under review. Our team will get back to you shortly.";
                break;

            case "in progress":
            case "in_progress":
                statusLabel = "In Progress 🔄";
                statusMessage =
                    "Your request is currently being processed. We will update you once it is completed.";
                break;

            case "completed":
                statusLabel = "Completed ✅";
                statusMessage =
                    "Your request has been successfully completed. Thank you for your patience.";
                break;

            case "cancelled":
            case "canceled":
                statusLabel = "Cancelled ❌";
                statusMessage =
                    "Your request has been cancelled. If you need assistance, feel free to contact us.";
                break;

            default:
                statusLabel = order.status;
                statusMessage = "";
        }

        // ✅ Main message (multi-line, professional)
        const message = `Hello ${customerName} 👋,

Thank you for contacting us.

🧾 Order Details:
• Order ID: #${shortOrderId}
• Item: ${order.message || "N/A"}
• Status: ${statusLabel}
• Date: ${formattedDate}

${statusMessage}

If you have any questions or want to share additional details (e.g., prescription), feel free to reply to this message.

Thank you for choosing our service 💙`;

        // ✅ WhatsApp URL
        const url = `https://api.whatsapp.com/send?phone=${finalNumber}&text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            deleteOrder(id, setOrders);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending": return <Clock size={14} />;
            case "In Progress": return <Activity size={14} />;
            case "Completed": return <CheckCircle2 size={14} />;
            case "Cancelled": return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <FileText className="header-icon" />
                    <h3>Prescription Requests & Orders</h3>
                </div>
            </div>

            <div className="hlth-ds-table-container animate-fade">
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Prescription</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.slice().reverse().map((order) => (
                            <tr key={order._id}>
                                <td className="font-bold">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <User size={16} color="#64748b" /> {order.customerName}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={14} color="#64748b" /> {order.phone}
                                    </div>
                                </td>
                                <td>
                                    {order.prescriptionFile ? (
                                        <a href={order.prescriptionFile} target="_blank" rel="noreferrer" className="hlth-ds-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <ExternalLink size={14} /> View File
                                        </a>
                                    ) : (
                                        <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>No file</span>
                                    )}
                                </td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.message}>
                                    {order.message || "-"}
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className={`hlth-ds-status-select ${order.status.toLowerCase().replace(" ", "-")}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="hlth-ds-row-actions">
                                        <button
                                            onClick={() => handleNotifyWhatsApp(order)}
                                            className="hlth-ds-action-btn edit"
                                            title="Notify via WhatsApp"
                                            style={{ background: '#25D366', color: 'white', border: 'none' }}
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(order._id)} className="hlth-ds-action-btn delete" title="Delete Order">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="hlth-ds-empty">
                                    <FileText size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                    <p>No order requests yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Internal Import for icons if not generic
const FileText = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
);

const Activity = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);

export default ManageOrders;
