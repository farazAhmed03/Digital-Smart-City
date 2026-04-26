import React, { useState } from 'react';
import './TourismDashboard.css';
import {
    FiMessageCircle, FiPhoneCall, FiMapPin, FiCheckCircle, FiAlertTriangle, FiCalendar,
    FiUsers, FiHome, FiGrid, FiStar, FiShield, FiTrendingUp, FiSend
} from 'react-icons/fi';
import { RequestServiceTab } from '../ProviderDashboard/Components/RequestServiceTab';
import { FaWhatsapp, FaCrown } from 'react-icons/fa';
import { Tourism_Provider_Details } from '../../../Store/Tourism_store';

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="td-modal-overlay" onClick={onClose}>
            <div className="td-modal-content" onClick={e => e.stopPropagation()}>
                <div className="td-modal-header">
                    <h3>{title}</h3>
                    <button className="td-btn-close" onClick={onClose}>×</button>
                </div>
                <div className="td-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 1. DASHBOARD OVERVIEW
// ==========================================
const DashboardOverview = ({ data }) => {
    const stats = [
        { label: "Profile Views", value: data.profileViews, icon: <FiUsers />, color: "#0abde3" },
        { label: "Phone Calls", value: data.calls, icon: <FiPhoneCall />, color: "#5f27cd" },
        { label: "WhatsApp Hits", value: data.whatsapp, icon: <FaWhatsapp />, color: "#1dd1a1" },
        { label: "Requests", value: data.requestsCount, icon: <FiMessageCircle />, color: "#ff9f43" }
    ];

    return (
        <div className="td-overview">
            <div className="td-stats-grid">
                {stats.map((stat, index) => (
                    <div className="td-stat-card" key={index}>
                        <div className="td-stat-icon" style={{ color: stat.color, background: `${stat.color}20` }}>
                            {stat.icon}
                        </div>
                        <div className="td-stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="td-section-card">
                <div className="td-section-header">
                    <h3 className="td-section-title">Recent Customer Requests</h3>
                </div>
                <table className="td-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Service Requested</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.requests.slice(0, 5).map(req => (
                            <tr key={req.id}>
                                <td>{req.user}</td>
                                <td>{req.service}</td>
                                <td>{req.date}</td>
                                <td><span className={`td-status-badge td-status-${req.status}`}>{req.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ==========================================
// 2. OFFERINGS SECTION
// ==========================================
const OfferingsManager = ({ offerings, onAdd, onDelete, onEdit }) => {
    return (
        <div className="td-section-card">
            <div className="td-section-header">
                <h3 className="td-section-title">My Offerings</h3>
                <button className="td-btn-primary" onClick={onAdd}><FiGrid /> Add New Offering</button>
            </div>
            <div className="td-offerings-list">
                {offerings.length > 0 ? offerings.map(offer => (
                    <div className="td-offering-item" key={offer.id}>
                        <div className="td-offering-details">
                            <h4>{offer.title}</h4>
                            <p>{offer.desc}</p>
                            <span style={{ fontWeight: 'bold', color: '#0abde3' }}>Rs. {offer.price}</span>
                        </div>
                        <div className="td-offering-actions">
                            <span className={`td-status-badge td-status-${offer.availability}`}>{offer.availability}</span>
                            <div className="td-action-group">
                                <button className="td-btn-action" onClick={() => onEdit(offer)}>Edit</button>
                                <button className="td-btn-action delete" onClick={() => onDelete(offer.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                )) : <p className="td-empty-text">No offerings added yet.</p>}
            </div>
        </div>
    );
};

const TourismRequests = ({ requests, onUpdateStatus }) => {
    const handleChat = (req) => {
        const message = `Hello ${req.user}, this is ${req.service} provider regarding your request on ${req.date}.`;
        const phone = req.contact.replace(/\D/g, ''); // Simple cleanup
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="td-section-card">
            <h3 className="td-section-title">Manage Service Requests</h3>
            <table className="td-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.user}</td>
                            <td>{req.service}</td>
                            <td>{req.date}</td>
                            <td>{req.contact}</td>
                            <td><span className={`td-status-badge td-status-${req.status}`}>{req.status}</span></td>
                            <td>
                                <div className="td-action-group">
                                    {req.status === 'Pending' && (
                                        <>
                                            <button className="td-btn-sm td-btn-success" onClick={() => onUpdateStatus(req.id, 'Confirmed')}>Accept</button>
                                            <button className="td-btn-sm td-btn-danger" onClick={() => onUpdateStatus(req.id, 'Cancelled')}>Reject</button>
                                        </>
                                    )}
                                    <button className="td-btn-sm td-btn-outline" onClick={() => handleChat(req)}><FaWhatsapp /> Chat</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TourismReviews = ({ reviews, onReply }) => {
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);

    const submitReply = (id) => {
        if (!replyText.trim()) return;
        onReply(id, replyText);
        setReplyText("");
        setActiveReplyId(null);
    };

    return (
        <div className="td-section-card">
            <h3 className="td-section-title">Customer Reviews</h3>
            <div className="td-reviews-list">
                {reviews.map(rev => (
                    <div key={rev.id} className="td-review-item">
                        <div className="td-review-header">
                            <div>
                                <h4>{rev.user}</h4>
                                <span className="td-review-date">{rev.date}</span>
                            </div>
                            <div className="td-stars">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={i < rev.rating ? "fill" : ""} />
                                ))}
                            </div>
                        </div>
                        <p className="td-review-comment">"{rev.comment}"</p>
                        {rev.reply ? (
                            <div className="td-review-reply">
                                <strong>Your Reply:</strong> {rev.reply}
                            </div>
                        ) : (
                            <div className="td-reply-section">
                                {activeReplyId === rev.id ? (
                                    <div className="td-reply-input-cont">
                                        <textarea
                                            placeholder="Type your reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="td-input"
                                        />
                                        <div className="td-action-group">
                                            <button className="td-btn-sm td-btn-success" onClick={() => submitReply(rev.id)}>Send</button>
                                            <button className="td-btn-sm td-btn-outline" onClick={() => setActiveReplyId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="td-btn-text" onClick={() => setActiveReplyId(rev.id)}>Reply to review</button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const TourismSubscription = ({ data, onUpgrade }) => {
    return (
        <div className="td-trust-section">
            <div className="td-trust-card td-promo-card">
                <FiTrendingUp className="td-trust-icon" />
                <h2>Upgrade to Pro</h2>
                <p>Get listed at the top, verify your profile with a gold badge, and reach 10x more customers.</p>
                <button className="td-btn-white" onClick={onUpgrade}>Upgrade to Pro</button>
            </div>
            <div className="td-section-card">
                <h3 className="td-section-title">Current Plan</h3>
                <div className="td-plan-details">
                    <div className="td-plan-info">
                        <strong>{data.PaymentPlan || "FREE"}</strong>
                        <p>Expiry: {data.subscriptionExpiry}</p>
                    </div>
                    <span className="td-status-badge td-status-Available">Active</span>
                </div>
                <div className="td-billing-history">
                    <h4>Recent Invoices</h4>
                    <p>No recent invoices found.</p>
                </div>
            </div>
        </div>
    );
};

const TourismProfile = ({ data, onUpdate }) => {
    const [form, setForm] = useState({
        ...data,
        // Ensure all fields exist even if data is missing them
        description: data.description || "",
        googleMapLink: data.googleMapLink || "",
        exactAddress: data.exactAddress || "",
        distanceFromCity: data.distanceFromCity || "",
        parking: data.parking || "Ample",
        openingTime: data.openingTime || "09:00",
        closingTime: data.closingTime || "22:00",
        entryFee: data.entryFee || "Free",
        bestSeason: data.bestSeason || "All Year",
        facilities: data.facilities || [],
        coverImage: data.coverImage || "",
        galleryImages: data.galleryImages || []
    });

    const [activeSection, setActiveSection] = useState('General');

    const handleCheckboxChange = (e, field) => {
        const value = e.target.value;
        const list = form[field] || [];
        if (e.target.checked) {
            setForm({ ...form, [field]: [...list, value] });
        } else {
            setForm({ ...form, [field]: list.filter(item => item !== value) });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(form);
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'General':
                return (
                    <div className="td-anime-fade">
                        <div className="td-form-row">
                            <div className="td-form-group">
                                <label>Service Name <span style={{ fontSize: '0.8rem', color: '#e17055' }}>(Contact Admin to change)</span></label>
                                <input type="text" className="td-input" value={form.name} readOnly style={{ backgroundColor: '#f1f2f6', cursor: 'not-allowed' }} />
                            </div>
                            <div className="td-form-group">
                                <label>Category</label>
                                <select className="td-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                    <option>Places</option>
                                    <option>Parks</option>
                                    <option>Hotels</option>
                                    <option>Restaurants</option>
                                    <option>Tour Guides</option>
                                    <option>Bazar</option>
                                </select>
                            </div>
                        </div>
                        <div className="td-form-group">
                            <label>Tagline (Short Slogan)</label>
                            <input type="text" className="td-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
                        </div>
                        <div className="td-form-group">
                            <label>Detailed Description</label>
                            <textarea className="td-input" rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your place..." />
                        </div>
                        <div className="td-form-row">
                            <div className="td-form-group">
                                <label>Contact Phone</label>
                                <input type="text" className="td-input" value={form.whatsappNum || ""} onChange={(e) => setForm({ ...form, whatsappNum: e.target.value })} />
                            </div>
                            <div className="td-form-group">
                                <label>Email Address</label>
                                <input type="email" className="td-input" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </div>
                        </div>
                    </div>
                );
            case 'Location':
                return (
                    <div className="td-anime-fade">
                        <div className="td-alert-box">
                            <FiMapPin />
                            <strong>Location Locked:</strong> To change your location or map pin, please submit a request to the admin.
                        </div>
                        <div className="td-form-group">
                            <label>Google Maps Share Link</label>
                            <input type="text" className="td-input" value={form.googleMapLink} readOnly style={{ backgroundColor: '#f1f2f6', cursor: 'not-allowed' }} />
                        </div>
                        <div className="td-form-group">
                            <label>Exact Address / Location Name</label>
                            <input type="text" className="td-input" value={form.exactAddress} readOnly style={{ backgroundColor: '#f1f2f6', cursor: 'not-allowed' }} />
                        </div>
                        <div className="td-form-row">
                            <div className="td-form-group">
                                <label>Distance from City Center</label>
                                <input type="text" className="td-input" placeholder="e.g. 5 KM" value={form.distanceFromCity} onChange={(e) => setForm({ ...form, distanceFromCity: e.target.value })} />
                            </div>
                            <div className="td-form-group">
                                <label>Parking Availability</label>
                                <select className="td-input" value={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.value })}>
                                    <option>Ample Parking</option>
                                    <option>Street Parking</option>
                                    <option>Paid Parking</option>
                                    <option>No Parking</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'Operations':
                return (
                    <div className="td-anime-fade">
                        <div className="td-form-row">
                            <div className="td-form-group">
                                <label>Opening Time</label>
                                <input type="time" className="td-input" value={form.openingTime} onChange={(e) => setForm({ ...form, openingTime: e.target.value })} />
                            </div>
                            <div className="td-form-group">
                                <label>Closing Time</label>
                                <input type="time" className="td-input" value={form.closingTime} onChange={(e) => setForm({ ...form, closingTime: e.target.value })} />
                            </div>
                        </div>
                        <div className="td-form-row">
                            <div className="td-form-group">
                                <label>Entry Fee</label>
                                <input type="text" className="td-input" placeholder="e.g. Free or Rs. 50" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} />
                            </div>
                            <div className="td-form-group">
                                <label>Best Season/Time</label>
                                <input type="text" className="td-input" placeholder="e.g. Winter Evening" value={form.bestSeason} onChange={(e) => setForm({ ...form, bestSeason: e.target.value })} />
                            </div>
                        </div>
                    </div>
                );
            case 'Facilities':
                return (
                    <div className="td-anime-fade">
                        <label className="td-label-lg">Select Available Facilities</label>
                        <div className="td-checkbox-grid">
                            {["Free Wi-Fi", "Washrooms", "Prayer Area", "Wheelchair Access", "Kids Play Area", "AC / Heating", "Card Payment", "Outdoor Seating"].map(opt => (
                                <label key={opt} className="td-check-item">
                                    <input
                                        type="checkbox"
                                        value={opt}
                                        checked={form.facilities.includes(opt)}
                                        onChange={(e) => handleCheckboxChange(e, 'facilities')}
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 'Media':
                return (
                    <div className="td-anime-fade">
                        <div className="td-form-group">
                            <label>Cover Image URL</label>
                            <input type="text" className="td-input" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
                            {form.coverImage && <img src={form.coverImage} alt="Cover" style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '10px', borderRadius: '10px' }} />}
                        </div>
                        {/* Gallery placeholder - in real app would be file upload */}
                        <div className="td-form-group">
                            <label>Gallery Images (URLs)</label>
                            <textarea className="td-input" placeholder="Paste image URLs separated by comma" />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="td-section-card">
            <div className="td-section-header">
                <div>
                    <h3 className="td-section-title">Edit Service Details</h3>
                    <p className="td-section-subtitle">Keep your service information up to date.</p>
                </div>
                <button type="submit" className="td-btn-primary" onClick={handleSubmit}>Save Changes</button>
            </div>

            <div className="td-profile-tabs">
                {['General', 'Location', 'Operations', 'Facilities', 'Media'].map(tab => (
                    <button
                        key={tab}
                        className={`td-tab-btn ${activeSection === tab ? 'active' : ''}`}
                        onClick={() => setActiveSection(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <form className="td-form-body">
                {renderSection()}
            </form>
        </div>
    );
};

// ==========================================
// 3. TRUST & BADGE SECTION
// ==========================================
const TrustCenter = ({ data }) => {
    return (
        <div className="td-trust-section">
            <div className="td-trust-card">
                <FaCrown className="td-trust-icon" />
                <h2>DSCH Verified Partner</h2>
                <p>Plan: {data.subscriptionPlan}</p>
                <p>Expires: {data.subscriptionExpiry}</p>
            </div>

            <div className="td-section-card">
                <h3 className="td-section-title">Compliance Status</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                    <FiShield size={40} color="#1dd1a1" />
                    <div>
                        <h4>Account Status: Active</h4>
                        <p>You are following all community guidelines.</p>
                    </div>
                </div>

                {data.reportsCount > 0 && (
                    <div className="td-warning-box">
                        <h4><FiAlertTriangle /> Attention Needed</h4>
                        <p>You have {data.reportsCount} active reports. Please resolve them to avoid badge suspension.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// NEW BOOKINGS SECTION
// ==========================================
const BookingsManager = () => {
    const [bookings, setBookings] = useState(() => {
        return JSON.parse(localStorage.getItem('tourism_bookings') || '[]');
    });

    const updateStatus = (id, newStatus) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        setBookings(updated);
        localStorage.setItem('tourism_bookings', JSON.stringify(updated));
    };

    return (
        <div className="td-section-card">
            <h3 className="td-section-title">Hotel Bookings & Reservations</h3>
            <table className="td-table">
                <thead>
                    <tr>
                        <th>Guest Name</th>
                        <th>Hotel</th>
                        <th>Dates</th>
                        <th>Contact</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? bookings.map(b => (
                        <tr key={b.id}>
                            <td>
                                <div style={{ fontWeight: 'bold' }}>{b.name}</div>
                                <small style={{ color: '#888' }}>ID: {b.id}</small>
                            </td>
                            <td>{b.hotelName}</td>
                            <td>
                                <div>In: {b.checkIn}</div>
                                <div>Out: {b.checkOut}</div>
                            </td>
                            <td>{b.phone}</td>
                            <td>{b.guests}</td>
                            <td>
                                <span className={`td-status-badge td-status-${b.status === "Pending" ? "Available" : b.status === "Confirmed" ? "Active" : "Rejected"}`}>
                                    {b.status}
                                </span>
                            </td>
                            <td>
                                {b.status === "Pending" && (
                                    <div className="td-action-group">
                                        <button className="td-btn-sm td-btn-success" onClick={() => updateStatus(b.id, 'Confirmed')}>Confirm</button>
                                        <button className="td-btn-sm td-btn-danger" onClick={() => updateStatus(b.id, 'Cancelled')}>Cancel</button>
                                    </div>
                                )}
                                {b.status === "Confirmed" && (
                                    <button className="td-btn-sm td-btn-outline" onClick={() => updateStatus(b.id, 'Checked-Out')}>Check Out</button>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                                <FiCalendar size={40} style={{ color: '#ccc', marginBottom: '10px' }} />
                                <p>No bookings found yet.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
export const TourismDashboard = () => {
    const [activeTab, setActiveTab] = useState('Overview');

    // Initial data from store
    const [providerData, setProviderData] = useState(Tourism_Provider_Details[0]);

    // Handlers for Offerings (Modals)
    const [isOfferingModalOpen, setIsOfferingModalOpen] = useState(false);
    const [editingOffering, setEditingOffering] = useState(null);
    const [offeringForm, setOfferingForm] = useState({ title: '', price: '', desc: '' });

    const openAddOffering = () => {
        setEditingOffering(null);
        setOfferingForm({ title: '', price: '', desc: '' });
        setIsOfferingModalOpen(true);
    };

    const openEditOffering = (offer) => {
        setEditingOffering(offer);
        setOfferingForm({ title: offer.title, price: offer.price, desc: offer.desc });
        setIsOfferingModalOpen(true);
    };

    const handleSaveOffering = (e) => {
        e.preventDefault();
        if (editingOffering) {
            setProviderData({
                ...providerData,
                offerings: providerData.offerings.map(o => o.id === editingOffering.id ? { ...o, ...offeringForm } : o)
            });
        } else {
            const newOffer = { id: Date.now(), ...offeringForm, availability: "Available" };
            setProviderData({ ...providerData, offerings: [...providerData.offerings, newOffer] });
        }
        setIsOfferingModalOpen(false);
    };

    const handleDeleteOffering = (id) => {
        if (window.confirm("Are you sure you want to delete this offering?")) {
            setProviderData({
                ...providerData,
                offerings: providerData.offerings.filter(o => o.id !== id)
            });
        }
    };

    // Subscription Modal
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const handleSubscription = (e) => {
        e.preventDefault();
        alert("Subscription request submitted! Our team will contact you soon.");
        setIsSubModalOpen(false);
    };

    // Review Hanlder
    const handleReviewReply = (id, reply) => {
        setProviderData({
            ...providerData,
            reviews: providerData.reviews.map(r => r.id === id ? { ...r, reply } : r)
        });
    };

    // Handlers for Requests
    const handleUpdateStatus = (id, status) => {
        setProviderData({
            ...providerData,
            requests: providerData.requests.map(r => r.id === id ? { ...r, status } : r)
        });
    };

    // Handler for Profile
    const handleProfileUpdate = (updatedData) => {
        setProviderData({ ...providerData, ...updatedData });
        alert("Profile updated successfully!");
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview': return <DashboardOverview data={providerData} />;
            case 'Offerings': return (
                <OfferingsManager
                    offerings={providerData.offerings}
                    onAdd={openAddOffering}
                    onDelete={handleDeleteOffering}
                    onEdit={openEditOffering}
                />
            );
            case 'Bookings': return <BookingsManager />;
            case 'Requests': return <TourismRequests requests={providerData.requests} onUpdateStatus={handleUpdateStatus} />;
            case 'Reviews': return <TourismReviews reviews={providerData.reviews} onReply={handleReviewReply} />;
            case 'Trust': return <TrustCenter data={providerData} />;
            case 'Subscription': return <TourismSubscription data={providerData} onUpgrade={() => setIsSubModalOpen(true)} />;
            case 'Profile': return <TourismProfile data={providerData} onUpdate={handleProfileUpdate} />;
            case 'RequestService': return <RequestServiceTab dashboardData={providerData} />;
            default: return <DashboardOverview data={providerData} />;
        }
    };

    return (
        <div className="td-dashboard-container">
            {/* Sidebar */}
            <aside className="td-sidebar">
                <div className="td-brand">
                    <h2>Digital Kohat Tourism</h2>
                </div>
                <ul className="td-nav-menu">
                    <li className={`td-nav-item ${activeTab === 'Overview' ? 'active' : ''}`} onClick={() => setActiveTab('Overview')}>
                        <FiHome className="td-nav-icon" /> Dashboard
                    </li>
                    <li className={`td-nav-item ${activeTab === 'Offerings' ? 'active' : ''}`} onClick={() => setActiveTab('Offerings')}>
                        <FiGrid className="td-nav-icon" /> Offerings
                    </li>
                    <li className={`td-nav-item ${activeTab === 'Requests' ? 'active' : ''}`} onClick={() => setActiveTab('Requests')}>
                        <FiUsers className="td-nav-icon" /> Requests
                    </li>
                    <li className={`td-nav-item ${activeTab === 'Bookings' ? 'active' : ''}`} onClick={() => setActiveTab('Bookings')}>
                        <FiCalendar className="td-nav-icon" /> Bookings
                    </li>
                    <li className={`td-nav-item ${activeTab === 'Reviews' ? 'active' : ''}`} onClick={() => setActiveTab('Reviews')}>
                        <FiStar className="td-nav-icon" /> Reviews
                    </li>
                    <li className={`td-nav-item ${activeTab === 'Trust' ? 'active' : ''}`} onClick={() => setActiveTab('Trust')}>
                        <FiShield className="td-nav-icon" /> Trust & Badge
                    </li>
                    <li className={`td-nav-item ${activeTab === 'Subscription' ? 'active' : ''}`} onClick={() => setActiveTab('Subscription')}>
                        <FiTrendingUp className="td-nav-icon" /> Subscription
                    </li>
                    <li className={`td-nav-item ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => setActiveTab('Profile')}>
                        <FiUsers className="td-nav-icon" /> My Profile
                    </li>
                    <li className={`td-nav-item ${activeTab === 'RequestService' ? 'active' : ''}`} onClick={() => setActiveTab('RequestService')}>
                        <FiSend className="td-nav-icon" /> Request Service
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="td-main-content">
                <header className="td-header">
                    <div className="td-header-title">
                        <h1>{activeTab}</h1>
                    </div>
                    <div className="td-profile-actions">
                        <button className="td-notification-btn">
                            <FiMessageCircle />
                            <span className="td-badge-dot"></span>
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="Profile"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontWeight: '600' }}>{providerData.name}</span>
                        </div>
                    </div>
                </header>

                <div className="td-content-body">
                    {renderContent()}
                </div>

                {/* Offering Modal */}
                <Modal
                    isOpen={isOfferingModalOpen}
                    onClose={() => setIsOfferingModalOpen(false)}
                    title={editingOffering ? "Edit Offering" : "Add New Offering"}
                >
                    <form className="td-form" onSubmit={handleSaveOffering}>
                        <div className="td-form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="td-input"
                                value={offeringForm.title}
                                onChange={e => setOfferingForm({ ...offeringForm, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="td-form-group">
                            <label>Price (Rs.)</label>
                            <input
                                type="number"
                                className="td-input"
                                value={offeringForm.price}
                                onChange={e => setOfferingForm({ ...offeringForm, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="td-form-group">
                            <label>Description</label>
                            <textarea
                                className="td-input"
                                value={offeringForm.desc}
                                onChange={e => setOfferingForm({ ...offeringForm, desc: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="td-btn-primary">Save Offering</button>
                    </form>
                </Modal>

                {/* Subscription Modal */}
                <Modal
                    isOpen={isSubModalOpen}
                    onClose={() => setIsSubModalOpen(false)}
                    title="Upgrade to Pro Subscription"
                >
                    <form className="td-form" onSubmit={handleSubscription}>
                        <p>Unlock premium features and reach more customers in Kohat.</p>
                        <div className="td-form-group">
                            <label>Business Name</label>
                            <input type="text" className="td-input" value={providerData.name} readOnly />
                        </div>
                        <div className="td-form-group">
                            <label>Select Plan</label>
                            <select className="td-input">
                                <option>Gold Plan - Rs. 5000/year</option>
                                <option>Silver Plan - Rs. 3000/year</option>
                            </select>
                        </div>
                        <div className="td-form-group">
                            <label>Payment Method</label>
                            <select className="td-input">
                                <option>EasyPaisa / JazzCash</option>
                                <option>Bank Transfer</option>
                            </select>
                        </div>
                        <button type="submit" className="td-btn-primary">Submit Request</button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};
