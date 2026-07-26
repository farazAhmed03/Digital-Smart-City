import React, { useState, useEffect } from "react";
import { GetTheDashboardDta, UpdateFoodMenuApi, UpdateFoodProfileApi, UpdateReviewReplyApi, LogoutApi, SubmitSupportTicketApi, UpdateReportStatusApi, UpdateFoodPromosApi, UpdateFoodGalleryApi, SwitchDashBoard, UpdateCoverImageApi, AddManagerApi, UpdateTimingsApi } from "../../../ApiCalls/DashBoardApiCalls";
import { GetOrdersApi, UpdateOrderStatusApi, GetTheFoodData } from "../../../ApiCalls/ApiCalls";
import { toast } from "react-toastify";
import "./FoodDashboard.css";
import brandLogo from "../../../Assests/brandLogo.jpeg";
import planLimits from "../../../utils/planLimits";
import {
    FiUser,
    FiUsers,
    FiShoppingBag,
    FiMenu,
    FiLogOut,
    FiSettings,
    FiHome,
    FiActivity,
    FiBell,
    FiDollarSign,
    FiMessageSquare,
    FiHelpCircle,
    FiStar,
    FiAlertTriangle,
    FiSlash,
    FiFileText,
    FiClock,
    FiInfo,
    FiSend,
    FiCamera
} from "react-icons/fi";
import { FaUser, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaClock, FaPrint, FaReply, FaStar } from "react-icons/fa";
import { Food_Details } from "../../../Store/Food_store";
import { RequestServiceTab } from "../ProviderDashboard/Components/RequestServiceTab";

const DEFAULT_COVER_IMAGE = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg";

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fd-modal-overlay" onClick={onClose}>
            <div className="fd-modal-content" onClick={e => e.stopPropagation()}>
                <div className="fd-modal-header">
                    <h3>{title}</h3>
                    <button className="fd-btn-close" onClick={onClose}>×</button>
                </div>
                <div className="fd-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

const FoodProfile = ({ data, onUpdate, onCoverUpdate }) => {
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverSubmit = async (e) => {
        const fileInput = e.target.files?.[0] || document.getElementById("fd-cover-upload").files[0];
        if (!fileInput) return toast.info("Please select an image first.");

        setUploading(true);
        const fd = new FormData();
        fd.append("coverImage", fileInput);

        try {
            await onCoverUpdate(fd);
            setPreview(null);
            document.getElementById("fd-cover-upload").value = "";
        } finally {
            setUploading(false);
        }
    };

    const currentCover = data.coverImage || data.aboutImage || DEFAULT_COVER_IMAGE;

    return (
        <div className="fd-card">
            <h2 className="fd-section-title">Service Profile</h2>
            <p className="fd-section-subtitle">Manage your restaurant's public information and appearance</p>

            <div className="fd-cover-management">
                <div className="fd-cover-preview-container">
                    <img
                        src={preview || currentCover}
                        alt="Cover Preview"
                        className="fd-cover-preview-img"
                    />
                    <div className="fd-cover-overlay">
                        <label htmlFor="fd-cover-upload" className="fd-cover-upload-label">
                            <FiCamera /> Change Cover Image
                        </label>
                        <input
                            type="file"
                            id="fd-cover-upload"
                            className="fd-hidden-input"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                {preview && (
                    <div className="fd-cover-actions">
                        <button
                            className="fd-btn-primary"
                            onClick={handleCoverSubmit}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Save New Cover"}
                        </button>
                        <button
                            className="fd-btn-outline"
                            onClick={() => { setPreview(null); document.getElementById("fd-cover-upload").value = ""; }}
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <form className="fd-profile-form" onSubmit={onUpdate}>
                <div className="fd-form-group">
                    <label>Restaurant Name</label>
                    <input type="text" className="fd-input" name="name" defaultValue={data.ServiceName || data.name} disabled />
                </div>

                <div className="fd-form-group">
                    <label>Tagline</label>
                    <input type="text" className="fd-input" name="tagline" defaultValue={data.tagline} />
                </div>

                <div className="fd-form-group">
                    <label>Restaurant Type</label>
                    <select
                        className="fd-input"
                        name="type"
                        defaultValue={
                            data.Type ||
                            data.type ||
                            data?.quickInfo?.basicProfile?.type ||
                            data?.ServiceType ||
                            ""
                        }>
                        <option>Fine Dining</option>
                        <option>Cafe</option>
                        <option>Fast Food</option>
                        <option>Local Cuisine</option>
                        <option>Bakery</option>
                        <option>Street Food</option>
                    </select>
                </div>

                <div className="fd-form-group">
                    <label>Description</label>
                    <textarea className="fd-textarea" name="about" defaultValue={data.about}></textarea>
                </div>

                {/* Location & Contact */}
                <div className="fd-form-group">
                    <label>Location</label>
                    <input type="text" className="fd-input" name="location" defaultValue={data.quickInfo?.basicProfile?.location} />
                </div>

                <div className="fd-form-group">
                    <label>Contact Phone</label>
                    <input type="tel" className="fd-input" name="phone" defaultValue={data.contact?.phone} />
                </div>

                <div className="fd-form-group">
                    <label>Contact Email</label>
                    <input type="email" className="fd-input" name="email" defaultValue={data.contact?.email} />
                </div>

                <div className="fd-form-group">
                    <label>Owner Name</label>
                    <input type="text" className="fd-input" name="owner" defaultValue={data.quickInfo?.administration?.owner} disabled />
                </div>


                {/* Operational Details Removed Timing */}

                <div className="fd-form-group">
                    <label>Delivery Availability</label>
                    <select className="fd-input" name="deliveryAvailability" defaultValue={data.deliveryAvailability}>
                        <option>Available (City Wide)</option>
                        <option>Limited (3km Radius)</option>
                        <option>Takeaway Only</option>
                        <option>Dine-In Only</option>
                    </select>
                </div>

                <div className="fd-form-group">
                    <label>Offer Table Reservation?</label>
                    <select className="fd-input" name="offersReservation" defaultValue={data.offersReservation ? "Yes" : "No"}>
                        <option value="Yes">Yes, we offer table bookings</option>
                        <option value="No">No, walk-in only</option>
                    </select>
                </div>

                <div className="fd-form-group">
                    <label>Facilities (Comma Separated)</label>
                    <input type="text" className="fd-input" name="facilities" defaultValue={data.quickInfo?.facilities?.join(", ")} />
                </div>

                {/* Images */}
                <div className="fd-form-group">
                    <label>Cover Image URL (Display Only)</label>
                    <input type="text" className="fd-input" name="coverImage" value={data.coverImage || data.aboutImage || ""} readOnly />
                </div>

                <button type="submit" className="fd-btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

const FoodTimings = ({ data, onUpdate }) => {
    return (
        <div className="fd-card">
            <h2 className="fd-section-title">Service Timings</h2>
            <p className="fd-section-subtitle">Manage your restaurant opening and closing hours</p>

            <form className="fd-profile-form" onSubmit={onUpdate}>
                <div className="fd-form-group">
                    <label>Opening Hours</label>
                    <input
                        type="text"
                        className="fd-input"
                        name="opening"
                        placeholder="e.g. 09:00 AM - 11:00 PM"
                        defaultValue={data.timings?.opening || ""}
                        required
                    />
                    <small style={{ color: "#888", marginTop: "5px", display: "block" }}>
                        Format: [Open Time] - [Close Time]
                    </small>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button type="submit" className="fd-btn-primary">Save Timings</button>
                </div>
            </form>
        </div>
    );
};

const ServiceAnalytics = ({ orders }) => {
    const [filter, setFilter] = useState("Daily");

    const getFilteredOrders = () => {
        const now = new Date();
        return orders.filter(order => {
            const orderDate = new Date(order.timestamp || order.createdAt || now);
            const diffTime = Math.abs(now - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (filter === "Daily") return diffDays <= 1;
            if (filter === "Weekly") return diffDays <= 7;
            if (filter === "Monthly") return diffDays <= 30;
            if (filter === "Yearly") return diffDays <= 365;
            return true;
        });
    };

    const filtered = getFilteredOrders();
    const totalOrders = filtered.length;
    const completedOrders = filtered.filter(o => (o.status || "").toLowerCase() === "delivered" || (o.status || "").toLowerCase() === "approved").length;
    const revenue = filtered
        .filter(o => {
            const st = (o.status || "").toLowerCase();
            return st === "delivered" || st === "approved";
        })
        .reduce((acc, curr) => acc + (curr.total || curr.amount || 0), 0);
    const pending = filtered.filter(o => (o.status || "").toLowerCase() === "pending").length;

    const stats = [
        { label: "Total Orders", value: totalOrders, icon: <FiShoppingBag /> },
        { label: "Completed", value: completedOrders, icon: <FaCheck /> },
        { label: "Revenue", value: `Rs. ${revenue}`, icon: <FiDollarSign /> },
        { label: "Pending", value: pending, icon: <FaClock /> }
    ];

    return (
        <div className="fd-card fd-analytics-v2">
            <div className="fd-section-header-flex">
                <div className="fd-title-group">
                    <h2 className="fd-section-title">Performance Insights</h2>
                    <p className="fd-section-subtitle">Real-time data for your {filter.toLowerCase()} performance</p>
                </div>
                <div className="fd-filter-btns">
                    {["Daily", "Weekly", "Monthly", "Yearly"].map(f => (
                        <button
                            key={f}
                            className={`fd-filter-btn ${filter === f ? "active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="fd-analytics-grid">
                {stats.map((s, i) => (
                    <div key={i} className="fd-analytics-item">
                        <div className="fd-stat-icon">{s.icon}</div>
                        <span className="fd-analytics-value">{s.value}</span>
                        <span className="fd-analytics-label">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// New Ads component displaying a promotional banner
const FoodAd = () => {
    return (
        <div className="fd-card fd-ad-card">
            <h2 className="fd-section-title">Special Promotion</h2>
            <div className="fd-ad-content">
                <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" alt="Ad" className="fd-ad-img" />
                <p className="fd-ad-text">Get 20% off on all orders this weekend! Use code <strong>WEEKEND20</strong> at checkout.</p>
            </div>
        </div>
    );
};

const FoodManagers = ({ profileData, otherServices, onManagerAdded }) => {
    const [formData, setFormData] = useState({
        ManagerEmail: "",
        password: "",
        ServiceName: "",
        ServiceType: ""
    });

    const normalizedPlan = (profileData?.PaymentPlan || "FREE").toString().trim().toUpperCase();
    const managerLimit = planLimits[normalizedPlan]?.managers ?? 0;
    const foodServices = [
        {
            ServiceId: profileData?._id,
            ServiceName: profileData?.ServiceName,
            ServiceType: profileData?.Type || profileData?.ServiceType
        },
        ...(otherServices || [])
    ].filter(service => service?.ServiceName && service?.ServiceType);
    const managers = Array.isArray(profileData?.Managers) ? profileData.Managers : [];
    const canAddManagers = profileData?.role === "admin" && managerLimit !== 0;
    const limitReached = Number.isFinite(managerLimit) && managers.length >= managerLimit;

    useEffect(() => {
        if (!formData.ServiceName && foodServices.length > 0) {
            setFormData(prev => ({
                ...prev,
                ServiceName: foodServices[0].ServiceName,
                ServiceType: foodServices[0].ServiceType
            }));
        }
    }, [foodServices, formData.ServiceName]);

    const handleServiceChange = (event) => {
        const selectedService = foodServices.find(
            service => String(service.ServiceId || service.ServiceName) === event.target.value
        );

        if (!selectedService) return;

        setFormData(prev => ({
            ...prev,
            ServiceName: selectedService.ServiceName,
            ServiceType: selectedService.ServiceType
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!canAddManagers) {
            toast.error("Your current plan does not support managers.");
            return;
        }

        if (limitReached) {
            toast.error(`Your ${normalizedPlan} plan allows ${managerLimit} manager${managerLimit === 1 ? "" : "s"} only.`);
            return;
        }

        AddManagerApi(formData, "/food/AddManager", () => {
            setFormData(prev => ({
                ...prev,
                ManagerEmail: "",
                password: ""
            }));
            if (onManagerAdded) onManagerAdded();
        });
    };

    return (
        <div className="fd-card">
            <div className="fd-section-header-flex">
                <div>
                    <h2 className="fd-section-title">Add Managers</h2>
                    <p className="fd-section-subtitle">Create manager logins for your food services.</p>
                </div>
                <div className="fd-manager-plan-note">
                    <span className="fd-tag">Plan: {normalizedPlan}</span>
                    <span className="fd-tag">
                        Limit: {Number.isFinite(managerLimit) ? `${managers.length}/${managerLimit}` : `${managers.length}/Unlimited`}
                    </span>
                </div>
            </div>

            <div className="fd-managers-grid">
                <div className="fd-managers-list">
                    <h3 className="fd-subsection-title">Assigned Managers</h3>
                    {managers.length ? managers.map((manager, index) => (
                        <div key={`${manager.ManagerEmail}-${index}`} className="fd-manager-row">
                            <div>
                                <strong>{manager.ManagerEmail}</strong>
                                <p>{manager.ServiceName} <span className="fd-tag">{manager.ServiceType}</span></p>
                            </div>
                        </div>
                    )) : (
                        <p className="fd-empty-state">No food managers added yet.</p>
                    )}
                </div>

                <form className="fd-profile-form" onSubmit={handleSubmit}>
                    <h3 className="fd-subsection-title">Create Manager</h3>

                    {!canAddManagers && (
                        <p className="fd-empty-state">Your current plan does not include the Add Manager feature.</p>
                    )}

                    <div className="fd-form-group">
                        <label>Manager Email</label>
                        <input
                            type="email"
                            className="fd-input"
                            value={formData.ManagerEmail}
                            onChange={e => setFormData(prev => ({ ...prev, ManagerEmail: e.target.value }))}
                            placeholder="manager@email.com"
                            required
                            disabled={!canAddManagers || limitReached}
                        />
                    </div>

                    <div className="fd-form-group">
                        <label>Manager Password</label>
                        <input
                            type="password"
                            className="fd-input"
                            value={formData.password}
                            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter a secure password"
                            required
                            disabled={!canAddManagers || limitReached}
                        />
                    </div>

                    <div className="fd-form-group">
                        <label>Assign Service</label>
                        <select
                            className="fd-input"
                            value={
                                foodServices.find(
                                    service =>
                                        service.ServiceName === formData.ServiceName &&
                                        service.ServiceType === formData.ServiceType
                                )?.ServiceId?.toString() || ""
                            }
                            onChange={handleServiceChange}
                            disabled={!canAddManagers || limitReached}
                        >
                            {foodServices.map(service => (
                                <option key={`${service.ServiceId || service.ServiceName}`} value={String(service.ServiceId || service.ServiceName)}>
                                    {service.ServiceName} ({service.ServiceType})
                                </option>
                            ))}
                        </select>
                    </div>

                    {limitReached && (
                        <p className="fd-empty-state">Manager limit reached for your current plan.</p>
                    )}

                    <button type="submit" className="fd-btn-primary" disabled={!canAddManagers || limitReached}>
                        Create Manager
                    </button>
                </form>
            </div>
        </div>
    );
};

const FoodMenu = ({ items, onAdd, onDelete, onEdit, onToggleStock }) => {
    return (
        <div className="fd-card">
            <h2 className="fd-section-title">Menu Management</h2>
            <div className="fd-menu-actions">
                <button className="fd-btn-primary" onClick={onAdd}><FaPlus /> Add New Item</button>
            </div>

            <div className="fd-menu-list">
                {items.length > 0 ? items.map((item) => (
                    <div className="fd-menu-item" key={item.id}>
                        <img src={item.img} alt={item.name} className="fd-menu-img" />
                        <div className="fd-menu-details">
                            <div className="fd-menu-header">
                                <h4>{item.name}</h4>
                                <span className={`fd-availability ${item.isAvailable ? 'available' : 'unavailable'}`}>
                                    {item.isAvailable ? 'In Stock' : 'Not Available'}
                                </span>
                            </div>
                            <p className="fd-item-desc">{item.desc}</p>

                            <div className="fd-item-meta">
                                <span className="fd-price-tag">Rs. {item.price}</span>
                                {item.prepTime && <span className="fd-meta-tag"><FaClock /> {item.prepTime}</span>}
                                {item.sku && <span className="fd-meta-tag">SKU: {item.sku}</span>}
                            </div>

                            <div className="fd-tags">
                                {item.tags?.map((tag, idx) => <span key={idx} className="fd-tag">{tag}</span>)}
                            </div>
                        </div>
                        <div className="fd-menu-btns">
                            <button
                                className={item.isAvailable ? "fd-btn-secondary" : "fd-btn-primary"}
                                onClick={() => onToggleStock(item.id, !item.isAvailable)}
                            >
                                {item.isAvailable ? "Mark Out of Stock" : "Mark In Stock"}
                            </button>
                            <button className="fd-btn-edit" onClick={() => onEdit(item)}><FaEdit /> Edit</button>
                            <button className="fd-btn-delete" onClick={() => onDelete(item.id)}><FaTrash /> Delete</button>
                        </div>
                    </div>
                )) : <p>No menu items found. Add some!</p>}
            </div>
        </div>
    )
}
const MembershipDetails = () => {
    return (
        <div className="fd-card">
            <h2 className="fd-section-title">Membership Details</h2>
            <div className="fd-membership-info">
                <p>Membership ID: 123456</p>
                <p>Membership Type: Gold</p>
                <p>Expiry Date: 2025-12-31</p>
            </div>
        </div>
    )
}
// ==========================================
// 1. ORDERS CENTER (ADVANCED)
// ==========================================
const FoodOrders = ({ orders, setOrders, profileData }) => {
    const [subTab, setSubTab] = useState("New");

    const handlePrint = (order) => {
        const win = window.open("", "_blank", "width=600,height=800");
        const itemsHtml = Array.isArray(order.items)
            ? order.items.map(i => `<tr><td>${i.qty || 1} x ${i.name}</td><td style="text-align:right">Rs. ${Number(i.subtotal || i.price || 0)}</td></tr>`).join("")
            : `<tr><td>Items</td><td style="text-align:right">${order.items || "-"}</td></tr>`;

        const content = `
            <html>
            <head>
              <title>Receipt - ${order.orderID || order._id || ""}</title>
              <style>
                @page { size: 58mm auto; margin: 4mm; }
                body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 0; color: #000; width: 100%; }
                h2, h3, h4 { margin: 0; padding: 0; font-weight: 600; font-size: 14px; }
                .center { text-align: center; }
                .muted { color: #555; font-size: 11px; }
                table { width: 100%; border-collapse: collapse; margin-top: 6px; }
                td { padding: 2px 0; font-size: 11px; }
                .total { font-weight: 700; border-top: 1px dashed #000; padding-top: 6px; font-size: 12px; }
                .line { border-top: 1px dashed #000; margin: 6px 0; }
                .footer { margin-top: 10px; font-size: 11px; text-align: center; }
                .amount { text-align: right; }
                .label { font-size: 11px; }
              </style>
            </head>
            <body>
              <div class="center">
                <h3>${profileData?.ServiceName || profileData?.name || "Restaurant"}</h3>
                <div class="muted">${order.type === "Reservation" ? "Reservation Receipt" : "Order Receipt"}</div>
              </div>
              <div class="line"></div>
              <div class="label">Ref: ${order.orderID || order._id || order.id || "-"}</div>
              <div class="label">Date: ${order.timestamp || new Date(order.createdAt || Date.now()).toLocaleString()}</div>
              <div class="label">Customer: ${order.userDetails?.name || order.customerName || order.customer || "-"}</div>
              <div class="label">Contact: ${order.userDetails?.phone || order.contact || "-"}</div>
              ${order.type === "Reservation" ? `
                <div class="label">Guests: ${order.guests || "-"}</div>
                <div class="label">Reservation: ${order.date || "-"} ${order.time || ""}</div>
              ` : `<div class="label">Address: ${order.userDetails?.address || order.specialRequest || "-"}</div>`}
              <div class="line"></div>
              <table>${itemsHtml}</table>
              <table>
                <tr><td>Subtotal</td><td class="amount">Rs. ${order.total || 0}</td></tr>
                <tr class="total"><td>Total</td><td class="amount">Rs. ${order.total || 0}</td></tr>
              </table>
              <div class="line"></div>
              <table>
                <tr><td>Method</td><td class="amount">${order.paymentMethod || "—"}</td></tr>
                <tr><td>Status</td><td class="amount">${order.status}</td></tr>
              </table>
              <div class="line"></div>
              <div class="footer">Member of DSCH</div>
              <script>window.print(); setTimeout(() => window.close(), 200);</script>
            </body>
            </html>
        `;
        win.document.open();
        win.document.write(content);
        win.document.close();
    };

    // Filter orders and reservations based on active sub-tab
    const filteredOrders = orders.filter(o => {
        if (subTab === "Reservations") return o.type === "Reservation";

        // Filter regular orders
        if (o.type === "Reservation") return false;
        if (subTab === "New") return o.status === "Pending";
        if (subTab === "Preparing") return o.status === "Preparing";
        if (subTab === "Ready") return o.status === "Ready";
        if (subTab === "Delivered") return o.status === "Delivered";
        if (subTab === "Cancelled") return o.status === "Cancelled" || o.status === "Rejected";
        return true;
    });

    const updateStatus = (id, newStatus) => {
        UpdateOrderStatusApi(id, newStatus).then(res => {
            if (res.data.success) {
                setOrders(orders.map(o => (o._id === id || o.id === id) ? { ...o, status: newStatus } : o));
                toast.success(`Order status updated to ${newStatus}`);
                if (typeof ordersRefresh === "function") ordersRefresh();
            }
        });
    };

    return (
        <div className="fd-orders-container">
            <h2 className="fd-section-title">Orders Center</h2>

            {/* Order Status Tabs */}
            <div className="fd-tabs-secondary">
                {["New", "Preparing", "Ready", "Delivered", "Cancelled", "Reservations"].map(tab => (
                    <button
                        key={tab}
                        className={`fd-tab-btn ${subTab === tab ? "active" : ""}`}
                        onClick={() => setSubTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="fd-orders-list">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <div key={order._id || order.id} className={`fd-order-card ${order.type === "Reservation" ? "reservation-card" : ""}`}>
                        <div className="fd-order-header">
                            <h4>{order.type === "Reservation" ? `Reservation` : `Order`} #{order.orderID || (order._id ? order._id.slice(-6) : order.id)}</h4>
                            <span className="fd-time-stamp">{order.timestamp || new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="fd-order-body">
                            {order.type === "Reservation" ? (
                                <>
                                    <p><strong>Customer:</strong> {order.customerName}</p>
                                    <p><strong>Date/Time:</strong> {order.date} at {order.time}</p>
                                    <p><strong>Guests:</strong> {order.guests}</p>
                                    <p><strong>Contact:</strong> {order.contact}</p>
                                    {order.specialRequest && <p className="fd-note">Request: {order.specialRequest}</p>}
                                    <p className="fd-status-badge">Status: {order.status}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Customer:</strong> {order.userDetails?.name || order.customer}</p>
                                    <p><strong>Items:</strong> {Array.isArray(order.items) ? order.items.map(i => `${i.qty}x ${i.name}`).join(", ") : order.items}</p>
                                    <p className="fd-total-price">Total: Rs. {order.total}</p>
                                    {order.specialInstructions && <p className="fd-note">Note: {order.specialInstructions}</p>}
                                </>
                            )}
                        </div>

                        <div className="fd-order-actions">
                            {order.type !== "Reservation" && subTab === "New" && (
                                <>
                                    <button className="fd-btn-approve" onClick={() => updateStatus(order._id || order.id, "Preparing")}><FaCheck /> Accept</button>
                                    <button className="fd-btn-reject" onClick={() => updateStatus(order._id || order.id, "Rejected")}><FaTimes /> Reject</button>
                                </>
                            )}
                            {subTab === "Preparing" && (
                                <button className="fd-btn-primary" onClick={() => updateStatus(order._id || order.id, "Ready")}><FaClock /> Mark Ready</button>
                            )}
                            {subTab === "Ready" && (
                                <button className="fd-btn-success" onClick={() => updateStatus(order._id || order.id, "Delivered")}><FaCheck /> Mark Delivered</button>
                            )}

                            <button className="fd-btn-icon" title="Print Receipt" onClick={() => handlePrint(order)}><FaPrint /></button>
                        </div>
                    </div>
                )) : <div className="fd-empty-state">No orders in this category.</div>}
            </div>
        </div>
    );
};

// ==========================================
// 2. DEALS & PROMOTIONS
// ==========================================
const FoodDeals = ({ promotions = [], onAdd, onDelete }) => {
    return (
        <div className="fd-card">
            <h2 className="fd-section-title">Deals & Promotions</h2>
            <div className="fd-menu-actions">
                <button className="fd-btn-primary" onClick={onAdd}><FaPlus /> Create New Promo</button>
            </div>

            <table className="fd-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.length > 0 ? promotions.map(p => (
                        <tr key={p.id}>
                            <td>{p.title}</td>
                            <td><span className="fd-badge-code">{p.code || "N/A"}</span></td>
                            <td>{p.value}</td>
                            <td>{p.type}</td>
                            <td><span className={`fd-status-badge status-${p.status}`}>{p.status}</span></td>
                            <td>
                                <button className="fd-btn-text-danger" onClick={() => onDelete(p.id)}><FaTrash /> Remove</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="6">No active promotions.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

// ==========================================
// 3. REVIEWS & REPUTATION
// ==========================================
const FoodReviews = ({ reviews = [], onReply }) => {
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);

    const submitReply = (id) => {
        if (!replyText.trim()) return;
        onReply(id, replyText);
        setReplyText("");
        setActiveReplyId(null);
    };

    return (
        <div className="fd-card">
            <div className="fd-section-header-flex">
                <div className="fd-title-group">
                    <h2 className="fd-section-title">Reviews & Reputation</h2>
                    <p className="fd-section-subtitle">Manage customer feedback and build your brand</p>
                </div>
            </div>
            <div className="fd-reviews-list">
                {reviews.length === 0 ? (
                    <div className="fd-empty-state">No reviews yet. Your customers' feedback will appear here.</div>
                ) : (
                    reviews.map((r, i) => {
                        const isDetailed = typeof r === 'object';
                        const name = isDetailed ? (r.name || "Verified Customer") : "Verified Customer";
                        const comment = isDetailed ? r.comment : r;
                        const rating = isDetailed ? (Number(r.rating) || 5) : 5;
                        const date = isDetailed ? (r.date || r.timestamp || "Just now") : "Static Review";

                        return (
                            <div key={i} className="fd-review-card">
                                <div className="fd-review-header">
                                    <div className="fd-review-user">
                                        <h4>{name}</h4>
                                        <div className="fd-review-stars">
                                            {[...Array(5)].map((_, idx) => (
                                                <FaStar key={idx} color={idx < rating ? "#fdcb6e" : "#dfe6e9"} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="fd-review-date">{new Date(date).toLocaleDateString()}</span>
                                </div>
                                <p className="fd-review-body">"{comment}"</p>

                                {isDetailed && r.response ? (
                                    <div className="fd-reply-section">
                                        <h5>Your Response:</h5>
                                        <p>{r.response}</p>
                                    </div>
                                ) : (
                                    <div className="fd-reply-box">
                                        {activeReplyId === (r.id || r._id) ? (
                                            <div className="fd-reply-input-cont">
                                                <textarea
                                                    placeholder="Write your response..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="fd-textarea"
                                                />
                                                <div className="fd-menu-btns" style={{ marginTop: '10px' }}>
                                                    <button className="fd-btn-primary" onClick={() => submitReply(r.id || r._id)}>Send Reply</button>
                                                    <button className="fd-btn-outline" onClick={() => setActiveReplyId(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button className="fd-btn-edit" onClick={() => setActiveReplyId(r.id || r._id)}>
                                                <FaReply /> Reply to Review
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// ==========================================
// 4. FINANCE & SUBSCRIPTION
// ==========================================
const FoodFinance = ({ finance = {}, orders = [], onRequestService }) => {
    const totalRevenue = orders.filter(o => o.status === "Delivered" || o.status === "Approved").reduce((acc, curr) => acc + curr.total, 0);
    const activeBalance = finance?.balance || totalRevenue;
    const plan = (finance?.subscriptionPlan || finance?.plan || "Free") === "Basic" ? "Free" : (finance?.subscriptionPlan || finance?.plan || "Free");
    const planExpiry = finance?.planExpiry || finance?.PlanExpiry;
    const planMax = { Free: 1, "Standard (Free)": 1, Premium: 3, Enterprise: Infinity };
    const used = finance?.servicesUsed || finance?.serviceCount || 1;
    const limit = planMax[plan] ?? 1;

    return (
        <div className="fd-card">
            <div className="fd-section-header-flex">
                <div className="fd-title-group">
                    <h2 className="fd-section-title">Finance & Wallet</h2>
                    <p className="fd-section-subtitle">Monitor your earnings and subscription status</p>
                </div>
            </div>

            <div className="fd-analytics-grid">
                <div className="fd-analytics-item">
                    <div className="fd-stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}><FiDollarSign /></div>
                    <span className="fd-analytics-value">Rs. {activeBalance}</span>
                    <span className="fd-analytics-label">Total Earnings</span>
                </div>
                <div className="fd-analytics-item">
                    <div className="fd-stat-icon" style={{ background: '#fff3cd', color: '#856404' }}><FiClock /></div>
                    <span className="fd-analytics-value">Rs. {finance?.pendingPayout || 0}</span>
                    <span className="fd-analytics-label">Pending Payout</span>
                </div>
            </div>

            <div className="fd-subsection" style={{ marginTop: '30px' }}>
                <h3 className="fd-subsection-title">Recent Transactions</h3>
                <table className="fd-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.filter(o => o.status === "Delivered").slice(0, 5).map(o => (
                            <tr key={o._id || o.id}>
                                <td>#{o.orderID || (o._id ? o._id.slice(-6) : o.id)}</td>
                                <td>{new Date(o.timestamp).toLocaleDateString()}</td>
                                <td>Rs. {o.total}</td>
                                <td><span className="fd-status-pill delivered">Paid</span></td>
                            </tr>
                        ))}
                        {orders.filter(o => o.status === "Delivered").length === 0 && (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No payment history yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="fd-subsection" style={{ marginTop: '30px' }}>
                <h3 className="fd-subsection-title">Subscription Status</h3>
                <div className="fd-subscription-card" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 5px 0' }}><strong>Plan:</strong> {plan}</p>
                            <p style={{ margin: '0 0 5px 0' }}><strong>Services:</strong> {used}/{limit === Infinity ? "∞" : limit}</p>
                            {planExpiry && <p style={{ margin: 0 }}><strong>Expires:</strong> {new Date(planExpiry).toLocaleDateString()}</p>}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="fd-btn-edit" onClick={() => window.dispatchEvent(new CustomEvent("open-upgrade-modal"))}>Upgrade Plan</button>
                            {(plan === "Premium" || plan === "Enterprise") && (
                                <button className="fd-btn-primary" onClick={onRequestService}>Request New Service</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CustomerOrderTracking = ({ orders, currentUserName }) => {
    const myOrders = orders.filter(o => o.customer === currentUserName);

    const getProgressWidth = (status) => {
        switch (status) {
            case "Pending": return "25%";
            case "Preparing": return "50%";
            case "Ready": return "75%";
            case "Delivered": return "100%";
            default: return "0%";
        }
    };

    return (
        <div className="fd-card">
            <h2 className="fd-section-title">My Purchases & Tracking</h2>
            <p className="fd-section-subtitle">Follow your orders from kitchen to doorstep</p>

            <div className="fd-tracking-list">
                {myOrders.length > 0 ? myOrders.map(order => (
                    <div key={order.id} className="fd-tracking-item">
                        <div className="fd-track-info">
                            <div className="fd-track-main">
                                <h3>Order #{order.id}</h3>
                                <p>{order.items}</p>
                                <span className="fd-track-date">Today, 12:45 PM</span>
                            </div>
                            <div className="fd-track-status-badge">
                                <span className={`fd-status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                                <span className="fd-track-amount">Rs. {order.total}</span>
                            </div>
                        </div>

                        <div className="fd-progress-container">
                            <div className="fd-progress-bar-bg">
                                <div className="fd-progress-fill" style={{ width: getProgressWidth(order.status) }}></div>
                            </div>
                            <div className="fd-progress-labels">
                                <span className={order.status === "Pending" ? "active" : ""}>Pending</span>
                                <span className={order.status === "Preparing" ? "active" : ""}>Preparing</span>
                                <span className={order.status === "Ready" ? "active" : ""}>Ready</span>
                                <span className={order.status === "Delivered" ? "active" : ""}>Delivered</span>
                            </div>
                        </div>

                        <div className="fd-track-actions">

                            <button className="fd-btn-outline"><FiStar /> Rate Order</button>
                            {order.status === "Delivered" && <button className="fd-btn-primary">Order Again</button>}
                        </div>
                    </div>
                )) : (
                    <div className="fd-empty-state">
                        <FiShoppingBag size={48} />
                        <p>No orders found. Time to eat something delicious!</p>
                        <button className="fd-btn-primary">Explore Menu</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 6. REPORTS & COMPLIANCE
// ==========================================
const FoodReports = ({ reports = [], reportCount = 0, status = "Active", onSelect }) => {
    return (
        <div className="fd-card">
            <div className="fd-section-header-flex">
                <div className="fd-title-group">
                    <h2 className="fd-section-title">Reports & Compliance</h2>
                    <p className="fd-section-subtitle">Monitor user reports and ensure service quality</p>
                </div>
            </div>

            <div className={`fd-report-status-box status-${status.toLowerCase()}`} style={{
                background: status === "Suspended" ? "#fff5f5" : (status === "Warning" ? "#fff9db" : "#f8fbfa"),
                padding: '25px',
                borderRadius: '15px',
                border: `1px solid ${status === "Suspended" ? "#feb2b2" : (status === "Warning" ? "#ffe066" : "#e6fffa")}`,
                marginBottom: '30px'
            }}>
                <div className="fd-report-metric" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>Progress to Suspension</h3>
                        <strong>{reportCount} / 100 Reports</strong>
                    </div>
                    <div className="fd-progress-bar-bg" style={{ height: '12px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                        <div className="fd-progress-fill" style={{
                            width: `${Math.min(reportCount, 100)}%`,
                            height: '100%',
                            background: reportCount > 70 ? '#e74c3c' : (reportCount > 40 ? '#f1c40f' : '#2ecc71'),
                            transition: '0.5s'
                        }}></div>
                    </div>
                </div>
                <div className="fd-status-display" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: status === "Suspended" ? "#e74c3c" : (status === "Warning" ? "#f1c40f" : "#2ecc71"),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        {status === "Suspended" ? <FiAlertTriangle /> : (status === "Warning" ? <FiInfo /> : <FaCheck />)}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0' }}>Current Status: {status}</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                            {status === "Suspended" ? "Your service is currently hidden from public." :
                                status === "Warning" ? "Action required: Improve your service to avoid suspension." :
                                    "Your service is in good standing. Keep it up!"}
                        </p>
                    </div>
                </div>
            </div>

            <h3 className="fd-subsection-title">Recent Reports History</h3>
            <table className="fd-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Reporter</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length > 0 ? reports.map((r, i) => (
                        <tr key={i} onClick={() => onSelect && onSelect(r)} style={{ cursor: onSelect ? "pointer" : "default" }}>
                            <td>{r.timestamp ? new Date(r.timestamp).toLocaleDateString() : (r.date || "N/A")}</td>
                            <td><strong>{r.reason}</strong><br /><small style={{ color: '#888' }}>{r.details}</small></td>
                            <td>{r.reporterName || "Anonymous"}</td>
                            <td><span className={`fd-status-badge status-${(r.status || "Pending").toLowerCase()}`}>{r.status || "Pending"}</span></td>
                        </tr>
                    )) : <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No reports found. Good job!</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export const FoodDashboard = () => {
    /**
     * SUPER ADMIN CONNECTION LOGIC COMMENT:
     * This Dashboard will eventually connect to the Super Admin Dashboard.
     * 
     * Logic to be implemented:
     * 1. Check `user.role` from AuthContext.
     * 2. If `user.role === 'admin'`, fetch global data.
     * 3. Sync `verificationStatus` with Admin's `InspectionModule`.
     * 4. Orders and Complaints will push notifications to Admin Panel.
     * 
     * For now, this component runs in standalone "Provider Mode".
     */

    // State for various sections
    const [serviceId, setServiceId] = useState(null);
    const [activeTab, setActiveTab] = useState("Orders");
    const [AdminTags, setAdmintags] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ordersRefresh, setOrdersRefresh] = useState(null);
    const [feedbackRefresh, setFeedbackRefresh] = useState(null);
    const [galleryImgs, setGalleryImgs] = useState([]);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradePlan, setUpgradePlan] = useState("Free");
    const [showServiceReqModal, setShowServiceReqModal] = useState(false);
    const [newServiceForm, setNewServiceForm] = useState({ name: "", type: "Restaurant", location: "" });
    const [otherServices, setOtherServices] = useState([]);

    const refreshDashboardData = () => {
        setLoading(true);
        GetTheDashboardDta((data) => {
            setProfileData(data);
            setServiceId(data._id);
            const categorizedItems = data.categorizedMenu?.flatMap(cat => cat.items) || [];
            setMenuItems(categorizedItems.length > 0 ? categorizedItems : (data.menu || []));
            setGalleryImgs(
                (data.gallery || []).map(url => ({ preview: url, file: null }))
            );
            setOtherServices(data.OtherServices || data.Services?.filter(s => s.ServiceId?.toString() !== data._id?.toString()) || []);
        }, setLoading, setOtherServices);
    };

    // Modal states
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState(null);
    const [menuForm, setMenuForm] = useState({ name: '', price: '', desc: '', img: '' });
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [promoForm, setPromoForm] = useState({ title: '', code: '' });
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [activeReport, setActiveReport] = useState(null);
    const [reportResponse, setReportResponse] = useState("");
    const [reportActionLoading, setReportActionLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const handleLogout = () => {
        LogoutApi();
    };

    useEffect(() => {
        refreshDashboardData();
    }, []);

    useEffect(() => {
        if (serviceId) {
            const refreshOrders = () => {
                GetOrdersApi(serviceId).then(res => {
                    if (res.data.success) {
                        setOrders(res.data.orders);
                    }
                });
            };
            refreshOrders();

            const refreshFeedback = () => {
                GetTheFoodData(serviceId, (svc) => {
                    if (svc) {
                        setProfileData(prev => ({
                            ...prev,
                            ratingData: svc.ratingData || prev?.ratingData || [],
                            detailedReviews: svc.detailedReviews || prev?.detailedReviews || [],
                            supportTickets: svc.supportTickets || prev?.supportTickets || [],
                        }));
                    }
                });
            };
            refreshFeedback();

            // store for reuse in updateStatus and reviews tab refresh
            setOrdersRefresh(() => refreshOrders);
            setFeedbackRefresh(() => refreshFeedback);

            // hook for upgrade modal trigger
            const listener = () => setShowUpgradeModal(true);
            window.addEventListener("open-upgrade-modal", listener);
            return () => window.removeEventListener("open-upgrade-modal", listener);
        }
    }, [serviceId]);

    useEffect(() => {
        if (activeTab === "Reviews" && typeof feedbackRefresh === "function") {
            feedbackRefresh();
        }
    }, [activeTab, feedbackRefresh]);

    // Build lightweight notification feed (derived from reports/orders/support tickets)
    useEffect(() => {
        const feed = [];
        if (profileData?.reports?.length) {
            const pending = profileData.reports.filter(r => (r.status || "Pending") === "Pending");
            if (pending.length) {
                feed.push({
                    type: "report",
                    title: `${pending.length} report${pending.length > 1 ? "s" : ""} pending review`,
                    action: () => {
                        setActiveTab("Reports");
                        setReportModalOpen(false);
                        setAdmintags(false);
                    }
                });
            }
        }

        if (orders.length) {
            const newOrders = orders.filter(o => o.status === "Pending");
            if (newOrders.length) {
                feed.push({
                    type: "order",
                    title: `${newOrders.length} new order${newOrders.length > 1 ? "s" : ""} waiting`,
                    action: () => {
                        setActiveTab("Orders");
                        setAdmintags(false);
                    }
                });
            }
        }



        setNotifications(feed);
    }, [profileData, orders]);

    if (loading) return <div className="fd-loading">Loading Dashboard...</div>;

    // Profile Handlers
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Manual check for files if any
        const fileInput = e.target.querySelector('input[type="file"]');
        if (fileInput && fileInput.files[0]) {
            formData.set("aboutImage", fileInput.files[0]);
        }

        UpdateFoodProfileApi(formData, setProfileData);
    };

    const handleTimingsUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const timings = {
            opening: formData.get("opening")
        };
        UpdateTimingsApi(timings, setProfileData);
    };

    const handleCoverUpdate = async (formData) => {
        try {
            await UpdateCoverImageApi(formData, setProfileData);
        } catch (err) {
            console.error(err);
        }
    };

    // Menu Handlers (Modals)
    const handleMenuImgFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setMenuForm(prev => ({ ...prev, img: ev.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const openAddMenu = () => {
        setEditingMenuItem(null);
        setMenuForm({ name: '', price: '', desc: '', img: '' });
        setIsMenuModalOpen(true);
    };

    const openEditMenu = (item) => {
        setEditingMenuItem(item);
        setMenuForm({ name: item.name, price: item.price, desc: item.desc, img: item.img || '' });
        setIsMenuModalOpen(true);
    };

    const handleSaveMenu = (e) => {
        e.preventDefault();
        let updatedMenuItems;
        if (editingMenuItem) {
            updatedMenuItems = menuItems.map(m => m.id === editingMenuItem.id ? { ...m, ...menuForm } : m);
        } else {
            const newItem = {
                id: Date.now(),
                ...menuForm,
                img: menuForm.img || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
                isAvailable: true
            };
            updatedMenuItems = [...menuItems, newItem];
        }

        UpdateFoodMenuApi(updatedMenuItems, setMenuItems);
        setIsMenuModalOpen(false);
    };

    const handleDeleteMenuItem = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const updatedMenuItems = menuItems.filter(item => item.id !== id);
            UpdateFoodMenuApi(updatedMenuItems, setMenuItems);
        }
    };

    const handleToggleStock = (id, nextState) => {
        const updatedMenuItems = menuItems.map(item =>
            item.id === id ? { ...item, isAvailable: nextState } : item
        );
        UpdateFoodMenuApi(updatedMenuItems, setMenuItems);
        toast.success(`Item marked ${nextState ? "In Stock" : "Out of Stock"}`);
    };

    // Gallery Handlers
    const handleAddGalleryFiles = (files) => {
        const arr = Array.from(files || []);
        const mapped = arr.map(file => ({ preview: URL.createObjectURL(file), file }));
        setGalleryImgs(prev => [...prev, ...mapped]);
    };

    const handleRemoveGalleryImg = (idx) => {
        const img = galleryImgs[idx];
        if (img.preview && img.file) {
            URL.revokeObjectURL(img.preview);
        }
        setGalleryImgs(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSaveGallery = () => {
        if (!galleryImgs.length) return toast.error("Add at least one image.");
        const fd = new FormData();

        // Split existing and new files
        galleryImgs.forEach(img => {
            if (img.file) {
                fd.append("galleryImages", img.file);
            } else {
                fd.append("existingImages", img.preview);
            }
        });

        UpdateFoodGalleryApi(fd, (res) => {
            if (res?.gallery) {
                setGalleryImgs(res.gallery.map(url => ({ preview: url, file: null })));
                setProfileData(prev => ({ ...prev, gallery: res.gallery }));
            }
        });
    };

    // Deals Handlers (Modals)

    const openAddPromo = () => {
        setPromoForm({ title: '', code: '', value: '10%', type: 'discount', status: 'active' });
        setIsPromoModalOpen(true);
    };

    const handleSavePromo = (e) => {
        e.preventDefault();
        const newDeal = { id: Date.now(), ...promoForm, usage: 0 };
        const updated = [...(profileData.promotions || []), newDeal];
        UpdateFoodPromosApi(updated, setProfileData);
        setIsPromoModalOpen(false);
    };

    const handleDeleteDeal = (id) => {
        const updated = (profileData.promotions || []).filter(p => p.id !== id);
        UpdateFoodPromosApi(updated, setProfileData);
    };

    const handleReviewReply = (id, response) => {
        const newData = { ...profileData };
        let found = false;

        if (newData.detailedReviews) {
            newData.detailedReviews = newData.detailedReviews.map(r => {
                if (r.id === id || r._id === id) {
                    found = true;
                    return { ...r, response };
                }
                return r;
            });
        }

        if (Array.isArray(newData.ratingData)) {
            newData.ratingData = newData.ratingData.map(r => {
                if (r.id === id || r._id === id) {
                    found = true;
                    return { ...r, response };
                }
                return r;
            });
        }

        setProfileData(newData);
        UpdateReviewReplyApi(id, response);
    };

    const handleReportClick = (report) => {
        setActiveReport(report);
        setReportResponse(report?.adminResponse || "");
        setReportModalOpen(true);
    };

    const handleReportAction = async (status) => {
        if (!activeReport) return;
        setReportActionLoading(true);
        try {
            const res = await UpdateReportStatusApi(activeReport.id || activeReport._id, status, reportResponse);
            if (res.data.success) {
                const updatedReport = res.data.report || { ...activeReport, status, adminResponse: reportResponse };
                setProfileData({
                    ...profileData,
                    reports: (profileData.reports || []).map(r =>
                        (r.id === activeReport.id || r._id === activeReport._id) ? { ...r, ...updatedReport } : r
                    )
                });
                setReportModalOpen(false);
                toast.success("Report updated");
            } else {
                toast.error(res.data.message || "Failed to update report");
            }
        } catch (err) {
            toast.error("Failed to update report");
        } finally {
            setReportActionLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Orders": return <FoodOrders orders={orders} setOrders={setOrders} profileData={profileData} />;
            case "Menu": return <FoodMenu items={menuItems} onAdd={openAddMenu} onDelete={handleDeleteMenuItem} onEdit={openEditMenu} onToggleStock={handleToggleStock} />;
            case "Deals": return <FoodDeals promotions={profileData.promotions} onAdd={openAddPromo} onDelete={handleDeleteDeal} />;
            case "Profile": return <FoodProfile data={profileData} onUpdate={handleProfileUpdate} onCoverUpdate={handleCoverUpdate} />;
            case "Timings": return <FoodTimings data={profileData} onUpdate={handleTimingsUpdate} />;
            case "Analytics": return <ServiceAnalytics orders={orders} />;
            case "Finance": {
                const servicesCount = (profileData?.Services?.length || 1) + (otherServices?.length || 0);
                return <FoodFinance finance={{ ...profileData.finance, plan: profileData.PaymentPlan, planExpiry: profileData.PlanExpiry, servicesUsed: servicesCount }} orders={orders} onRequestService={() => setShowServiceReqModal(true)} />;
            }
            case "Reviews": {
                const ratingArr = Array.isArray(profileData.ratingData) ? profileData.ratingData : [];
                const detailArr = Array.isArray(profileData.detailedReviews) ? profileData.detailedReviews : [];
                return <FoodReviews reviews={[...ratingArr, ...detailArr]} onReply={handleReviewReply} />;
            }
            case "Reports": return <FoodReports reports={profileData.reports} reportCount={profileData.reportCount} status={profileData.reportStatus} onSelect={handleReportClick} />;
            case "RequestService": return <RequestServiceTab dashboardData={profileData} />;
            case "MyPurchases": return <CustomerOrderTracking orders={orders} currentUserName="Ali Khan" />;
            case "Ads": return <FoodAd />;
            case "Membership-details": return <MembershipDetails />;
            case "Gallery": return (
                <div className="fd-card">
                    <h2 className="fd-section-title">Photo Gallery</h2>
                    <p className="fd-section-subtitle">Showcase your restaurant ambiance and dishes.</p>
                    <div className="fd-form-group">
                        <label>Upload Images</label>
                        <input type="file" accept="image/*" multiple onChange={e => handleAddGalleryFiles(e.target.files)} />
                    </div>
                    <div className="fd-gallery-grid">
                        {galleryImgs.length ? galleryImgs.map((img, idx) => (
                            <div key={idx} className="fd-gallery-item">
                                <img src={img.preview} alt={`gallery-${idx}`} />
                                <button className="fd-btn-delete" onClick={() => handleRemoveGalleryImg(idx)}>Remove</button>
                            </div>
                        )) : <p className="fd-empty-state">No images yet.</p>}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <button className="fd-btn-primary" onClick={handleSaveGallery}>Save Gallery</button>
                    </div>
                </div>
            );
            case "Managers":
                return <FoodManagers profileData={profileData} otherServices={otherServices} onManagerAdded={refreshDashboardData} />;
            case "SwitchService": {
                const canRequestService = ["Premium", "Enterprise"].includes(profileData?.PaymentPlan);
                return (
                    <div className="fd-card">
                        <div className="fd-section-header-flex">
                            <div>
                                <h2 className="fd-section-title">Switch Service</h2>
                                <p className="fd-section-subtitle">Open any of your approved services.</p>
                            </div>
                            {canRequestService && (
                                <button className="fd-btn-primary" onClick={() => setShowServiceReqModal(true)}>
                                    Request New Service
                                </button>
                            )}
                            <button className="fd-btn-outline" onClick={refreshDashboardData}>Refresh Services</button>
                        </div>
                        <div className="fd-form-group">
                            {(otherServices && otherServices.length ? otherServices : (profileData?.Services || [])
                                .filter(s => s.ServiceId?.toString() !== serviceId?.toString()))
                                .map((svc, idx) => (
                                    <div key={idx} className="fd-switch-row">
                                        <div>
                                            <strong>{svc.ServiceName || svc.serviceName}</strong> <span className="fd-tag">{svc.ServiceType || svc.serviceType}</span>
                                        </div>
                                        <button className="fd-btn-primary" onClick={() => {
                                            SwitchDashBoard(svc.ServiceName || svc.serviceName, svc.ServiceId || svc.serviceId, svc.ServiceType || svc.serviceType, setProfileData, setOtherServices);
                                        }}>Open Dashboard</button>
                                    </div>
                                ))}
                            {(!otherServices || otherServices.length === 0) && (!profileData?.Services || profileData.Services.length <= 1) && (
                                <p className="fd-empty-state">No other services available.</p>
                            )}
                        </div>
                    </div>
                );
            }
            default: return <FoodOrders orders={orders} setOrders={setOrders} />;
        }
    };

    return (
        <div className="fd-dashboard-wrapper">
            {showUpgradeModal && (
                <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="Upgrade Plan">
                    <form className="fd-profile-form" onSubmit={(e) => {
                        e.preventDefault();
                        const subject = `Upgrade Request: ${upgradePlan}`;
                        const message = `Admin requests upgrade to ${upgradePlan} plan.`;
                        SubmitSupportTicketApi({ subject, message }, () => {
                            toast.success("Upgrade request sent to Super Admin");
                        });
                        setShowUpgradeModal(false);
                    }}>
                        <div className="fd-form-group">
                            <label>Select Plan</label>
                            <select className="fd-input" value={upgradePlan} onChange={e => setUpgradePlan(e.target.value)}>
                                <option value="Free">Free (1 service)</option>
                                <option value="Premium">Premium (3 services)</option>
                                <option value="Enterprise">Enterprise (unlimited)</option>
                            </select>
                        </div>
                        <p className="fd-section-subtitle">
                            Free: 1 service. Premium: 3 services. Enterprise: unlimited. Requests go to Super Admin for approval.
                        </p>
                        <button className="fd-btn-primary" type="submit">Send Upgrade Request</button>
                    </form>
                </Modal>
            )}

            {showServiceReqModal && (
                <Modal isOpen={showServiceReqModal} onClose={() => setShowServiceReqModal(false)} title="Request New Service">
                    <form className="fd-profile-form" onSubmit={(e) => {
                        e.preventDefault();
                        const payload = {
                            subject: "SERVICE_REQUEST",
                            message: JSON.stringify({
                                adminId: profileData?.AdminId,
                                serviceName: newServiceForm.name,
                                serviceType: newServiceForm.type,
                                location: newServiceForm.location
                            })
                        };
                        SubmitSupportTicketApi(payload, () => {
                            toast.success("New service request sent to Super Admin");
                        });
                        setShowServiceReqModal(false);
                    }}>
                        <div className="fd-form-group">
                            <label>Service Name</label>
                            <input className="fd-input" value={newServiceForm.name} onChange={e => setNewServiceForm({ ...newServiceForm, name: e.target.value })} required />
                        </div>
                        <div className="fd-form-group">
                            <label>Service Type</label>
                            <select className="fd-input" value={newServiceForm.type} onChange={e => setNewServiceForm({ ...newServiceForm, type: e.target.value })}>
                                <option>Restaurant</option>
                                <option>Cafe</option>
                                <option>Fast Food</option>
                                <option>Bakery</option>
                                <option>Local Food</option>
                                <option>Street Food</option>
                                <option>Fine Dining</option>
                            </select>
                        </div>
                        <div className="fd-form-group">
                            <label>Location</label>
                            <input className="fd-input" value={newServiceForm.location} onChange={e => setNewServiceForm({ ...newServiceForm, location: e.target.value })} required />
                        </div>
                        <button className="fd-btn-primary" type="submit">Submit Request</button>
                    </form>
                </Modal>
            )}
            <header className="fd-main-header">
                <nav className="fd-navbar">
                    <div className="fd-nav-container" style={{ padding: "10px 2px" }}>
                        {/* LOGO */}
                        <div className="fd-nav-logo">
                            <img src={brandLogo} alt="Logo" className="logo-img fd-dshbrdlogo" />
                            <h2>DIGITAL SMART CITIES HUB</h2>
                        </div>

                        <div className="fd-Admin-Icon-TagsCont">
                            <span className="fd-usrIcon fd-adminIcon" onClick={() => setAdmintags(!AdminTags)}>
                                <FaUser />
                                {notifications.length > 0 && <span className="fd-notif-badge">{notifications.length}</span>}
                            </span>
                            <ul className={AdminTags ? "fd-tags-cont fd-flexDsply fd-Admin-Tags" : "fd-tags-cont fd-Admin-Tags"}>
                                <li className="fd-profile-block">
                                    <div className="fd-profile-name">{profileData?.AdminName || profileData?.owner || "Food Admin"}</div>
                                    <div className="fd-profile-email">{profileData?.contact?.email || profileData?.AdminEmail || "—"}</div>
                                </li>
                                <li className="fd-notifs-header">Notifications</li>
                                {notifications.length ? notifications.map((n, idx) => (
                                    <li key={idx} className="fd-notif-item" onClick={n.action}>
                                        {n.title}
                                    </li>
                                )) : <li className="fd-notif-empty">No new notifications</li>}
                                <li className="fd-DshbrdlogOut-tag" onClick={handleLogout}>log Out</li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="fd-layout">
                {/* Sidebar */}
                <aside className="fd-sidebar">
                    <ul>
                        <li onClick={() => setActiveTab("Orders")} className={activeTab === "Orders" ? "active" : ""}><FiShoppingBag className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Orders</p></li>
                        <li onClick={() => setActiveTab("Menu")} className={activeTab === "Menu" ? "active" : ""}><FiMenu className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Menu</p></li>
                        <li onClick={() => setActiveTab("Deals")} className={activeTab === "Deals" ? "active" : ""}><FiDollarSign className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Deals</p></li>
                        <li onClick={() => setActiveTab("Analytics")} className={activeTab === "Analytics" ? "active" : ""}><FiActivity className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Analytics</p></li>
                        <li onClick={() => setActiveTab("Finance")} className={activeTab === "Finance" ? "active" : ""}><FiDollarSign className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Finance</p></li>
                        <li onClick={() => setActiveTab("Reviews")} className={activeTab === "Reviews" ? "active" : ""}><FiMessageSquare className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Reviews</p></li>
                        <li onClick={() => setActiveTab("Profile")} className={activeTab === "Profile" ? "active" : ""}><FiUser className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Profile</p></li>
                        <li onClick={() => setActiveTab("Reports")} className={activeTab === "Reports" ? "active" : ""}><FiFileText className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Reports</p></li>
                        <li onClick={() => setActiveTab("RequestService")} className={activeTab === "RequestService" ? "active" : ""}><FiSend className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Request Service</p></li>

                        <li onClick={() => setActiveTab("MyPurchases")} className={activeTab === "MyPurchases" ? "active" : ""}><FiShoppingBag className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">My Purchases</p></li>
                        <li onClick={() => setActiveTab("Gallery")} className={activeTab === "Gallery" ? "active" : ""}><FiUser className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Gallery</p></li>
                        <li onClick={() => setActiveTab("Timings")} className={activeTab === "Timings" ? "active" : ""}><FiClock className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Timings</p></li>
                        {profileData?.role === "admin" && otherServices?.length > 0 && (
                            <li onClick={() => setActiveTab("Managers")} className={activeTab === "Managers" ? "active" : ""}><FiUsers className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Add Managers</p></li>
                        )}
                        {otherServices?.length > 0 && (
                            <li onClick={() => setActiveTab("SwitchService")} className={activeTab === "SwitchService" ? "active" : ""}><FiUser className="fd-DshbrdSidbrIcn" /> <p className="fd-DshbrdtagName">Switch Service</p></li>
                        )}
                    </ul>
                </aside>

                <section className="fd-content">
                    {profileData?.reportStatus === "Warning" && (
                        <div className="fd-warning-alert">
                            <FiAlertTriangle className="fd-warning-icon" />
                            <div>
                                <h4>Warning: High Report Volume</h4>
                                <p>Your business has received multiple user reports. Please resolve issues to avoid suspension.</p>
                            </div>
                        </div>
                    )}

                    {renderContent()}
                </section>
            </main>

            {/* Menu Modal */}
            <Modal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} title={editingMenuItem ? "Edit Menu Item" : "Add Menu Item"}>
                <form className="fd-profile-form" onSubmit={handleSaveMenu}>
                    <div className="fd-form-group">
                        <label>Item Name</label>
                        <input
                            type="text"
                            className="fd-input"
                            value={menuForm.name}
                            onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="fd-form-group">
                        <label>Price (Rs.)</label>
                        <input
                            type="number"
                            className="fd-input"
                            value={menuForm.price}
                            onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
                            required
                        />
                    </div>
                    <div className="fd-form-group">
                        <label>Description</label>
                        <textarea
                            className="fd-textarea"
                            value={menuForm.desc}
                            onChange={e => setMenuForm({ ...menuForm, desc: e.target.value })}
                            required
                        />
                    </div>
                    <div className="fd-form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            className="fd-input"
                            placeholder="https://example.com/image.jpg"
                            value={menuForm.img}
                            onChange={e => setMenuForm({ ...menuForm, img: e.target.value })}
                        />
                    </div>
                    <div className="fd-form-group">
                        <label>Upload Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="fd-input"
                            onChange={e => handleMenuImgFile(e.target.files?.[0])}
                        />
                        {menuForm.img && (
                            <div className="fd-menu-img-preview">
                                <img src={menuForm.img} alt="Preview" style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "10px" }} />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="fd-btn-primary">Save Item</button>
                </form>
            </Modal>

            {/* Promo Modal */}
            <Modal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} title="Create New Promotion">
                <form className="fd-profile-form" onSubmit={handleSavePromo}>
                    <div className="fd-form-group">
                        <label>Promotion Title</label>
                        <input
                            type="text"
                            className="fd-input"
                            value={promoForm.title}
                            onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
                            placeholder="e.g. Summer Discount"
                            required
                        />
                    </div>
                    <div className="fd-form-group">
                        <label>Promo Code</label>
                        <input
                            type="text"
                            className="fd-input"
                            value={promoForm.code}
                            onChange={e => setPromoForm({ ...promoForm, code: e.target.value })}
                            placeholder="e.g. SUMMER10"
                            required
                        />
                    </div>
                    <button type="submit" className="fd-btn-primary">Create Promo</button>
                </form>
            </Modal>

            {/* Report Detail Modal */}
            <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report Detail">
                {activeReport && (
                    <div className="fd-profile-form">
                        <div className="fd-form-group">
                            <label>Reason</label>
                            <input type="text" className="fd-input" value={activeReport.reason} disabled />
                        </div>
                        <div className="fd-form-group">
                            <label>Details</label>
                            <textarea className="fd-textarea" value={activeReport.details} disabled />
                        </div>
                        <div className="fd-form-group">
                            <label>Reporter</label>
                            <input type="text" className="fd-input" value={activeReport.reporterName || activeReport.reporter || "Anonymous"} disabled />
                        </div>
                        <div className="fd-form-group">
                            <label>Your Response</label>
                            <textarea
                                className="fd-textarea"
                                value={reportResponse}
                                onChange={e => setReportResponse(e.target.value)}
                                placeholder="Add notes or reply (optional)"
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <button type="button" className="fd-btn-primary" disabled={reportActionLoading} onClick={() => handleReportAction("Approved")}>
                                {reportActionLoading ? "Saving..." : "Approve"}
                            </button>
                            <button type="button" className="fd-btn-secondary" disabled={reportActionLoading} onClick={() => handleReportAction("Rejected")}>
                                {reportActionLoading ? "Saving..." : "Reject"}
                            </button>
                            <button type="button" className="fd-btn" disabled={reportActionLoading} onClick={() => handleReportAction("Resolved")}>
                                {reportActionLoading ? "Saving..." : "Mark Resolved"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
