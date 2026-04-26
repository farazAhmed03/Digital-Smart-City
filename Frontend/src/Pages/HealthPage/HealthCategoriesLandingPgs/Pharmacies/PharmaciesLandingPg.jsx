import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PharmaciesLandingPg.css';
import { GetServicesWholeData, AddReviewApi } from '../../../../ApiCalls/ApiCalls';
import { placePharmacyOrder } from '../../../../ApiCalls/HealthDashboardApiCall';
import {
    Star,
    MapPin,
    Clock,
    Phone,
    CheckCircle2,
    Package,
    Truck,
    Search,
    FileText,
    User,
    Plus,
    ArrowLeft,
    Info,
    Activity
} from 'lucide-react';
import { AppContext } from '../../../../Store/AppContext';
import AutofillNote from '../../../../components/AutofillNote/AutofillNote';
import { toast } from 'react-toastify';

export const PharmaciesLandingPg = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    // Page Data State
    const [pageData, setPageData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
    const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);

    // Order Form State
    const [orderData, setOrderData] = useState({
        customerName: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        prescription: null,
        message: ''
    });

    // Review Form State
    const [reviewForm, setReviewForm] = useState({
        user: userData?.fullName || '',
        comment: '',
        rating: 0,
        serviceType: "Pharmacy"
    });

    // Auto-fill order and review data when user data is available
    useEffect(() => {
        if (userData) {
            setOrderData(prev => ({
                ...prev,
                customerName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                whatsappNumber: userData.phone || ''
            }));
            setReviewForm(prev => ({ ...prev, user: userData.fullName || '' }));
        }
    }, [userData]);

    // Fetch Pharmacy Data
    useEffect(() => {
        window.scrollTo(0, 0);
        GetServicesWholeData(id, setPageData, "PHARMACY");
    }, [id]);

    // Handle Input for Order Form
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'prescription') {
            setOrderData({ ...orderData, [name]: files[0] });
        } else {
            setOrderData({ ...orderData, [name]: value });
        }
    };

    // Submit Pharmacy Order
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setIsOrderSubmitting(true);
        const success = await placePharmacyOrder(id, orderData);
        if (success) {
            setOrderData({
                customerName: userData?.fullName || '',
                email: userData?.email || '',
                phone: userData?.phone || '',
                whatsappNumber: userData?.phone || '',
                prescription: null,
                message: ''
            });
            // Clear file input manually
            const fileInput = document.getElementById('prescription-upload');
            if (fileInput) fileInput.value = "";
        }
        setIsOrderSubmitting(false);
    };

    // Submit Patient Review
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (reviewForm.rating === 0) {
            toast.warning("Please select a star rating.");
            return;
        }
        if (!reviewForm.comment.trim()) return;

        setIsReviewSubmitting(true);
        await AddReviewApi(id, reviewForm, (newReviews, newRatingData) => {
            setPageData(prev => ({
                ...prev,
                detailedReviews: newReviews,
                ratingData: newRatingData
            }));
            setReviewForm({ ...reviewForm, comment: '', rating: 0 });
        });
        setIsReviewSubmitting(false);
    };

    if (!pageData) {
        return (
            <div className="phrm-hlth-single-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Activity className="animate-pulse" size={48} color="#1f8e5c" />
                    <p style={{ marginTop: '1rem', fontWeight: 600 }}>Loading Pharmacy Information...</p>
                </div>
            </div>
        );
    }

    // Filter medicines based on search term
    const filteredMedicines = pageData.Medicines?.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="phrm-hlth-single-container">
            {/* Hero Section */}
            <header className="phrm-hero">
                <div className="phrm-hero__pattern"></div>
                <Plus className="phrm-hero__plus-icon" size={120} />

                <div className="phrm-hero__container">
                    <div className="phrm-hero__avatar-wrapper phrm-anim-scale-in">
                        <div className="phrm-hero__avatar">
                            <img
                                src={pageData.basicInfo?.img || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=300&h=300"}
                                alt={pageData.basicInfo?.serviceName}
                            />
                        </div>
                    </div>

                    <div className="phrm-hero__content phrm-anim-fade-up">
                        <div className="phrm-hero__badge">
                            <CheckCircle2 size={14} /> Registered Pharmacy
                        </div>
                        <h1 className="phrm-hero__name">{pageData.basicInfo?.serviceName}</h1>
                        <p className="phrm-hero__tagline">{pageData.basicInfo?.tagline || "Your Trusted Healthcare Partner in Kohat"}</p>

                        <div className="phrm-hero__meta">
                            <span><MapPin size={18} /> {pageData.basicInfo?.address || "Kohat, KPK"}</span>
                            <span><Star size={18} fill="#fbbf24" stroke="#fbbf24" /> {pageData.ratingData?.average || "New"} ({pageData.ratingData?.totalReviews || 0} Reviews)</span>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button onClick={() => navigate(-1)} className="phrm-btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ArrowLeft size={18} /> Go Back
                            </button>
                            <a href="#order-section" className="phrm-btn phrm-btn--primary" style={{ width: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={18} /> Order Now
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Stats Bar */}
            <section className="phrm-stats-bar">
                <div className="phrm-stats-bar__container">
                    <div className="phrm-stat-card phrm-anim-fade-up phrm-delay-1">
                        <span className="phrm-stat-card__value">{pageData.about?.yearsOfService || "5+"}</span>
                        <span className="phrm-stat-card__label">Years of Service</span>
                    </div>
                    <div className="phrm-stat-card phrm-anim-fade-up phrm-delay-2">
                        <span className="phrm-stat-card__value">{pageData.Medicines?.length || 0}</span>
                        <span className="phrm-stat-card__label">Items in Inventory</span>
                    </div>
                    <div className="phrm-stat-card phrm-anim-fade-up phrm-delay-3">
                        <span className="phrm-stat-card__value">{pageData.ratingData?.average || "5.0"}</span>
                        <span className="phrm-stat-card__label">Average Rating</span>
                    </div>
                    <div className="phrm-stat-card phrm-anim-fade-up phrm-delay-4">
                        <span className="phrm-stat-card__value">100%</span>
                        <span className="phrm-stat-card__label">Authentic Medicine</span>
                    </div>
                </div>
            </section>

            <div className="phrm-main-grid">
                {/* Main Content Areas */}
                <div className="phrm-content-column">
                    {/* About Section */}
                    <section className="phrm-card phrm-anim-fade-up">
                        <h3><Info size={24} color="var(--phrm-primary-color)" /> About Pharmacy</h3>
                        <p style={{ lineHeight: 1.7, color: 'var(--phrm-text-dim)' }}>
                            {pageData.about?.description || (pageData.basicInfo?.serviceName + " is a leading healthcare provider in Kohat, offering a wide range of authentic medicines, healthcare products, and consultation services. We are committed to your health and wellness.")}
                        </p>
                    </section>

                    {/* Inventory Table */}
                    <section className="phrm-card phrm-anim-fade-up">
                        <div className="phrm-inventory-header">
                            <h3><Package size={24} color="var(--phrm-primary-color)" /> Medicine Inventory</h3>
                            <div className="phrm-search-box">
                                <Search className="search-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="phrm-table-wrapper">
                            <table className="phrm-table">
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th>Category</th>
                                        <th>Price (PKR)</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedicines.length > 0 ? (
                                        filteredMedicines.map((med, i) => (
                                            <tr key={i}>
                                                <td className="phrm-med-name">{med.name}</td>
                                                <td>{med.category || "General"}</td>
                                                <td style={{ fontWeight: 600 }}>{med.price || "N/A"}</td>
                                                <td>
                                                    <span className={`phrm-stock-badge ${med.stock === "In Stock" ? "in-stock" : "out-stock"}`}>
                                                        {med.stock || "In Stock"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--phrm-text-muted)', fontStyle: 'italic' }}>
                                                {searchTerm ? `No results found for "${searchTerm}"` : "No medicines listed yet."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Services Grid */}
                    <section className="phrm-card phrm-anim-fade-up">
                        <h3><Activity size={24} color="phrm-primary-color" /> Services Offered</h3>
                        <div className="phrm-services-grid">
                            {pageData.services?.length > 0 ? (
                                pageData.services.map((service, i) => (
                                    <div className="phrm-service-card" key={i}>
                                        <div className="phrm-service-icon"><CheckCircle2 size={24} /></div>
                                        <div>
                                            <h4>{service.name}</h4>
                                            <p>{service.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="phrm-service-card">
                                        <div className="phrm-service-icon"><Package size={24} /></div>
                                        <h4>Prescription Refills</h4>
                                        <p>Quick and easy refills for all your chronic medications.</p>
                                    </div>
                                    <div className="phrm-service-card">
                                        <div className="phrm-service-icon"><Truck size={24} /></div>
                                        <h4>Home Delivery</h4>
                                        <p>Fast and secure medicine delivery at your doorstep in Kohat.</p>
                                    </div>
                                    <div className="phrm-service-card">
                                        <div className="phrm-service-icon"><User size={24} /></div>
                                        <h4>Pharmacist Consultation</h4>
                                        <p>Professional advice on dosage and side effects.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Reviews Section */}
                    <section className="phrm-card phrm-anim-fade-up">
                        <h3><Star size={24} color="#fbbf24" /> Patient Reviews</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                            {/* Review Form */}
                            {userData ? (
                                <div className="phrm-review-form-card">
                                    <h4 style={{ marginBottom: '1.5rem' }}>Rate Your Experience</h4>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="phrm-star-selector">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={28}
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                    fill={star <= reviewForm.rating ? "#fbbf24" : "none"}
                                                    stroke={star <= reviewForm.rating ? "#fbbf24" : "#ccc"}
                                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                                />
                                            ))}
                                        </div>
                                        <div className="phrm-form-group">
                                            <textarea
                                                className="phrm-form-input"
                                                placeholder="What did you like about this pharmacy?"
                                                rows="3"
                                                value={reviewForm.comment}
                                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="phrm-btn phrm-btn--primary" style={{ width: 'auto' }} disabled={isReviewSubmitting}>
                                            {isReviewSubmitting ? "Posting..." : "Post Review"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="phrm-review-form-card" style={{ textAlign: 'center', background: '#f8fafc' }}>
                                    <User size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p style={{ fontWeight: 600 }}>Login to review this pharmacy</p>
                                    <button className="phrm-btn" style={{ width: 'auto', background: 'white', border: '1px solid #ddd', marginTop: '1rem' }} onClick={() => navigate('/user/login')}>
                                        Login Now
                                    </button>
                                </div>
                            )}

                            {/* Reviews Display */}
                            <div className="phrm-review-list">
                                {pageData.detailedReviews?.length > 0 ? (
                                    pageData.detailedReviews.slice().reverse().map((rev, i) => (
                                        <div className="phrm-review-item" key={i}>
                                            <div className="phrm-review-header">
                                                <div className="phrm-reviewer">
                                                    <div className="phrm-reviewer-avatar">{rev.user?.charAt(0) || "P"}</div>
                                                    <strong>{rev.user || "Patient"}</strong>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} size={14} fill={idx < (rev.rating || 5) ? "#fbbf24" : "none"} stroke="#fbbf24" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--phrm-text-dim)' }}>"{rev.comment}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <p style={{ color: 'var(--phrm-text-muted)' }}>No reviews yet. Be the first to share your feedback!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Areas */}
                <div className="phrm-sidebar-column">
                    <section className="phrm-card phrm-anim-fade-up">
                        <h3><Phone size={20} color="var(--phrm-primary-color)" /> Pharmacy Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                            <div>
                                <label className="phrm-form-label">Phone Number</label>
                                <p style={{ fontWeight: 600 }}>{pageData.basicInfo?.contactNumber || "+92 300 1234567"}</p>
                            </div>
                            <div>
                                <label className="phrm-form-label">Physical Address</label>
                                <p style={{ fontWeight: 600 }}>{pageData.basicInfo?.address || "Kohat, KPK"}</p>
                            </div>
                        </div>
                    </section>

                    <section className="phrm-card phrm-anim-fade-up">
                        <h3><Clock size={20} color="var(--phrm-primary-color)" /> Opening Hours</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {pageData.Timings ? (
                                Object.entries(pageData.Timings).map(([day, time], i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontWeight: 500 }}>{day}</span>
                                        <span style={{ fontWeight: 600, color: time === "Closed" ? "#ef4444" : "var(--phrm-primary-color)" }}>{time}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--phrm-text-muted)' }}>Timing information not available.</p>
                            )}
                        </div>
                    </section>

                    <section id="order-section" className="phrm-card phrm-anim-fade-up" style={{ background: '#f0fdf4', borderColor: 'rgba(31, 142, 92, 0.1)' }}>
                        <h3 style={{ marginBottom: '1rem' }}><FileText size={20} color="var(--phrm-primary-color)" /> Order Medicines</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--phrm-text-dim)', marginBottom: '1.5rem' }}>Upload prescription or list items below to place an order.</p>

                        <form onSubmit={handleOrderSubmit}>
                            <AutofillNote />
                            <div className="phrm-form-group">
                                <label className="phrm-form-label">Your Name</label>
                                <input
                                    className="phrm-form-input"
                                    type="text"
                                    name="customerName"
                                    placeholder="Full Name"
                                    value={orderData.customerName}
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                             <div className="phrm-form-group">
                                <label className="phrm-form-label">Phone Number</label>
                                <input
                                    className="phrm-form-input"
                                    type="tel"
                                    name="phone"
                                    placeholder="Your primary phone"
                                    value={orderData.phone}
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="phrm-form-group">
                                <label className="phrm-form-label">WhatsApp Number</label>
                                <input
                                    className="phrm-form-input"
                                    type="tel"
                                    name="whatsappNumber"
                                    placeholder="+92 3XX XXXXXXX"
                                    value={orderData.whatsappNumber}
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="phrm-form-group">
                                <label className="phrm-form-label">Prescription (Optional)</label>
                                <input
                                    id="prescription-upload"
                                    type="file"
                                    name="prescription"
                                    accept="image/*,.pdf"
                                    onChange={handleInputChange}
                                    style={{ fontSize: '0.75rem' }}
                                />
                            </div>
                            <div className="phrm-form-group">
                                <label className="phrm-form-label">Message / Items List</label>
                                <textarea
                                    className="phrm-form-input"
                                    name="message"
                                    placeholder="e.g. 1x Panadol, 1x Arinac..."
                                    rows="4"
                                    value={orderData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="phrm-btn phrm-btn--primary" disabled={isOrderSubmitting}>
                                {isOrderSubmitting ? "Placing Order..." : "Place Order Request"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};