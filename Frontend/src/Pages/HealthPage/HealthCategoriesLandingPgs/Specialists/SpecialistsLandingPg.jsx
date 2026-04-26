import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SpecialistsLandingPg.css';
import { GetServicesWholeData, BookAppointment, AddReviewApi } from '../../../../ApiCalls/ApiCalls';
import { toast } from 'react-toastify';
import {
    ShieldCheck,
    Calendar,
    User,
    Stethoscope,
    ClipboardCheck,
    Award,
    Star,
    GraduationCap,
    BookOpen,
    Phone,
    Mail,
    MapPin,
    Clock,
    Video,
    Send,
    CheckCircle,
    ChevronLeft
} from 'lucide-react';
import { AppContext } from '../../../../Store/AppContext';
import AutofillNote from '../../../../components/AutofillNote/AutofillNote';

export const SpecialistsLandingPg = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const [pageData, setPageData] = useState(null);

    // Form states for two different forms
    const [clinicFormData, setClinicFormData] = useState({
        patientName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: '',
        serviceType: "SPECIALIST",
        consultationType: "IN-CLINIC"
    });

    const [onlineFormData, setOnlineFormData] = useState({
        patientName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: '',
        serviceType: "SPECIALIST",
        consultationType: "ONLINE"
    });

    const [isClinicSuccess, setIsClinicSuccess] = useState(false);
    const [isOnlineSuccess, setIsOnlineSuccess] = useState(false);

    // Review Form State
    const [reviewForm, setReviewForm] = useState({
        user: userData?.fullName || '',
        comment: '',
        rating: 0,
        serviceType: "Specialist"
    });
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

    // Refs for scrolling
    const contactSectionRef = useRef(null);
    const aboutSectionRef = useRef(null);

    useEffect(() => {
        if (userData) {
            const initialData = {
                patientName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                message: '',
                serviceType: "SPECIALIST"
            };
            setClinicFormData(prev => ({ ...prev, ...initialData, consultationType: "IN-CLINIC" }));
            setOnlineFormData(prev => ({ ...prev, ...initialData, consultationType: "ONLINE" }));
            setReviewForm(prev => ({ ...prev, user: userData.fullName || '' }));
        }
    }, [userData]);

    useEffect(() => {
        window.scrollTo(0, 0);
        GetServicesWholeData(id, setPageData, "SPECIALIST");
    }, [id]);

    const handleClinicInputChange = (e) => {
        const { name, value } = e.target;
        setClinicFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOnlineInputChange = (e) => {
        const { name, value } = e.target;
        setOnlineFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBooking = async (e, type) => {
        e.preventDefault();
        const formData = type === 'clinic' ? clinicFormData : onlineFormData;
        const setSuccess = type === 'clinic' ? setIsClinicSuccess : setIsOnlineSuccess;

        const bookingData = {
            ...formData,
            specialistId: id
        };

        try {
            const response = await BookAppointment(id, bookingData, e);
            // Assuming BookAppointment handles toast or returns truthy on success
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);

            // Reset message field
            if (type === 'clinic') {
                setClinicFormData(prev => ({ ...prev, message: '' }));
            } else {
                setOnlineFormData(prev => ({ ...prev, message: '' }));
            }
        } catch (err) {
            toast.error("Error sending booking request. Please try again.");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.comment.trim()) return;

        setIsReviewSubmitting(true);
        await AddReviewApi(id, reviewForm, (newReviews, newRatingData) => {
            setPageData(prev => ({
                ...prev,
                detailedReviews: newReviews,
                ratingData: newRatingData
            }));
            setReviewForm({ ...reviewForm, comment: '', rating: 5 });
        });
        setIsReviewSubmitting(false);
    };

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!pageData) {
        return <div className="splst-loading-state">Loading Specialist Profile...</div>;
    }

    const ratings = pageData.ratingData || {};
    const avgRating = Number(ratings.average || 0).toFixed(1);
    const totalReviews = ratings.totalReviews || 0;

    const renderAbout = () => {
        const about = pageData.about || pageData.About;
        if (!about) {
            return "Dr. " + (pageData.basicInfo?.adminName || "Specialist") + " is a highly skilled professional dedicated to providing the best healthcare services in Kohat.";
        }
        if (typeof about === 'string') return about;
        if (typeof about === 'object') return about.description || about.About || "Doctor profile information is being updated.";
        return String(about);
    };

    const basicInfo = pageData.basicInfo || {};

    return (
        <div className="splst-hlth-single-container">

            {/* Hero Section */}
            <header className="splst-hero">
                <div className="splst-hero__pattern">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="splst-hero__plus-icon">
                    <svg width="220" height="220" viewBox="0 0 100 100" fill="white">
                        <path d="M45 10 h10 v35 h35 v10 h-35 v35 h-10 v-35 h-35 v-10 h35z" />
                    </svg>
                </div>

                <div className="splst-hero__container">
                    {/* Avatar */}
                    <div className="splst-hero__avatar-wrapper splst-anim-scale-in">
                        <div className="splst-hero__avatar">
                            <img
                                src={basicInfo.img || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=200&h=200"}
                                alt={basicInfo.adminName}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="splst-hero__content splst-anim-fade-up splst-delay-1">
                        <div className="splst-hero__badge splst-anim-fade-up splst-delay-1">
                            <ShieldCheck size={14} /> <span>Board Certified</span>
                        </div>
                        <h1 className="splst-hero__name splst-font-heading splst-anim-fade-up splst-delay-2">
                            {basicInfo.adminName || "Specialist Name"}
                        </h1>
                        <p className="splst-hero__specialty splst-anim-fade-up splst-delay-3">
                            {basicInfo.specialization || "Senior Specialist"}
                        </p>
                        <p className="splst-hero__clinic splst-anim-fade-up splst-delay-3">
                            {basicInfo.serviceName || "Kohat Medical Center"}
                        </p>
                        <p className="splst-hero__tagline splst-anim-fade-up splst-delay-4">
                            {renderAbout().substring(0, 150)}...
                        </p>

                        <div className="splst-hero__actions splst-anim-fade-up splst-delay-5">
                            <button
                                className="splst-btn splst-btn--primary"
                                onClick={() => scrollToSection(contactSectionRef)}
                            >
                                <Calendar size={16} /> Book Appointment
                            </button>
                            <button
                                className="splst-btn splst-btn--secondary"
                                onClick={() => scrollToSection(aboutSectionRef)}
                            >
                                Learn More
                            </button>
                            <button
                                className="splst-btn splst-btn--secondary"
                                onClick={() => navigate(-1)}
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <section className="splst-stats-bar">
                <div className="splst-stats-bar__container">
                    <div className="splst-stat-card splst-anim-fade-up splst-delay-3">
                        <div className="splst-stat-card__value">{basicInfo.experience || "10+"}</div>
                        <div className="splst-stat-card__label">Years Experience</div>
                    </div>
                    <div className="splst-stat-card splst-anim-fade-up splst-delay-4">
                        <div className="splst-stat-card__value">{pageData.Services?.length || "5"}</div>
                        <div className="splst-stat-card__label">Services Offered</div>
                    </div>
                    <div className="splst-stat-card splst-anim-fade-up splst-delay-5">
                        <div className="splst-stat-card__value">★ {totalReviews > 0 ? avgRating : "New"}</div>
                        <div className="splst-stat-card__label">Patient Rating</div>
                    </div>
                    <div className="splst-stat-card splst-anim-fade-up splst-delay-6">
                        <div className="splst-stat-card__value">PKR {basicInfo.consultationFee || basicInfo.fee || "1000"}</div>
                        <div className="splst-stat-card__label">Consultation Fee</div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section ref={aboutSectionRef} className="splst-section splst-section--bg-light">
                <div className="splst-max-w-container splst-grid-2-cols">
                    <div className="splst-anim-fade-up splst-delay-2">
                        <div className="splst-section-title-wrapper">
                            <div className="splst-section-icon-box">
                                <User size={20} />
                            </div>
                            <h2 className="splst-section-title">About Me</h2>
                        </div>
                        <p className="splst-about-text">
                            {renderAbout()}
                        </p>
                        <div className="splst-pill-container">
                            <span className="splst-pill">
                                <Stethoscope size={13} /> Health Consultation
                            </span>
                            <span className="splst-pill">
                                <ClipboardCheck size={13} /> Verified Specialist
                            </span>
                            {basicInfo.verified && (
                                <span className="splst-pill">
                                    <ShieldCheck size={13} /> Board Certified
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="splst-anim-fade-up splst-delay-4">
                        <div className="splst-recognition-card">
                            <h3><Award size={18} color="var(--splst-primary-color)" /> Recognition</h3>
                            <ul className="splst-recognition-list">
                                <li className="splst-recognition-item"><Star size={14} color="var(--splst-primary-color)" /> Gold Medalist</li>
                                <li className="splst-recognition-item"><Star size={14} color="var(--splst-primary-color)" /> Top Rated Specialist</li>
                                <li className="splst-recognition-item"><Star size={14} color="var(--splst-primary-color)" /> Verified Professional</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education Section */}
            <section className="splst-section splst-section--bg-white">
                <div className="splst-max-w-container">
                    <div className="splst-anim-fade-up">
                        <div className="splst-section-title-wrapper">
                            <div className="splst-section-icon-box">
                                <GraduationCap size={20} />
                            </div>
                            <h2 className="splst-section-title">Education & Qualifications</h2>
                        </div>
                        <p className="splst-section-subtitle">Professional medical training and credentials</p>
                    </div>

                    <div className="splst-qualification-grid">
                        {pageData.education?.length > 0 ? (
                            pageData.education.map((e, i) => (
                                <div key={i} className={`splst-qual-card splst-anim-fade-up splst-delay-${(i % 3) + 2} ${i >= 2 ? 'splst-qual-card--alt' : ''}`}>
                                    <div className="splst-qual-card__icon">
                                        {i >= 2 ? <Award size={20} /> : <BookOpen size={20} />}
                                    </div>
                                    <div className="splst-qual-card__content">
                                        <h3 className="splst-qual-card__title">{e.degree}</h3>
                                        <p className="splst-qual-card__institution">{e.institution}</p>
                                        <p className="splst-qual-card__year">{e.year}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="splst-qual-card splst-anim-fade-up splst-delay-2">
                                    <div className="splst-qual-card__icon"><BookOpen size={20} /></div>
                                    <div className="splst-qual-card__content">
                                        <h3 className="splst-qual-card__title">MBBS Degree</h3>
                                        <p className="splst-qual-card__institution">Leading Medical University</p>
                                        <p className="splst-qual-card__year">Prequalified</p>
                                    </div>
                                </div>
                                <div className="splst-qual-card splst-qual-card--alt splst-anim-fade-up splst-delay-3">
                                    <div className="splst-qual-card__icon"><Award size={20} /></div>
                                    <div className="splst-qual-card__content">
                                        <h3 className="splst-qual-card__title">Specialization</h3>
                                        <p className="splst-qual-card__institution">Renowned Institution</p>
                                        <p className="splst-qual-card__year">Board Certified</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            {
                (pageData.Services?.length > 0) ?
                    pageData.Services.map((service, index) => {
                        const isInactive = service.status === "INACTIVE";
                        return (
                            <section key={index} className={`splst-section splst-section--bg-white ${isInactive ? 'splst-service--inactive' : ''}`}>
                                <div className="splst-max-w-container">
                                    {index === 0 && (
                                        <div className="splst-forms-header splst-anim-fade-up">
                                            <h2 style={{ color: 'var(--splst-dark-color)' }}>Services</h2>
                                            <p style={{ color: 'var(--splst-text-muted)' }}>Professional health consultation and specialized care</p>
                                        </div>
                                    )}

                                    <div className="splst-grid-2-cols">
                                        <div className="splst-service-card splst-anim-fade-up splst-delay-2">
                                            <div className="splst-service-card__header">
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <h3 className="splst-service-card__title">{service.title}</h3>
                                                        <span className={`splst-status-badge ${service.status?.toLowerCase() || 'active'}`}>
                                                            {service.status === "INACTIVE" ? "Closed" : "Available"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Stethoscope size={24} color="var(--splst-primary-color)" />
                                            </div>
                                            <p className="splst-service-card__desc">
                                                {service.description}
                                            </p>
                                            <div className="splst-service-card__footer">
                                                <div>
                                                    <p className="splst-service-card__meta-label">Duration</p>
                                                    <p className="splst-service-card__meta-value">{service.duration}</p>
                                                </div>
                                                <div>
                                                    <p className="splst-service-card__meta-label">Fee</p>
                                                    <p className="splst-service-card__meta-value splst-service-card__price">PKR {service.fee || service.price || "1000"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="splst-booking-cta splst-anim-fade-up splst-delay-4">
                                            <h3>{isInactive ? "Service Temporarily Closed" : "Ready to book?"}</h3>
                                            <button
                                                className="splst-btn splst-btn--primary splst-btn--full"
                                                onClick={() => scrollToSection(contactSectionRef)}
                                                disabled={isInactive}
                                            >
                                                <Calendar size={16} /> {isInactive ? "Unavailable" : "Schedule Now"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })
                    :
                    <></>
            }

            {/* Patient Reviews Section */}
            <section className="splst-section splst-section--bg-light">
                <div className="splst-max-w-container">
                    <div className="splst-section-title-wrapper splst-anim-fade-up">
                        <div className="splst-section-icon-box">
                            <Star size={20} />
                        </div>
                        <h2 className="splst-section-title">Patient Reviews</h2>
                    </div>
                    <p className="splst-section-subtitle splst-anim-fade-up">Recent experiences shared by patients</p>

                    <div className="splst-grid-2-cols">
                        {userData ? (
                            <div className="splst-review-form-card splst-anim-fade-up">
                                <h3>Share Your Experience</h3>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="splst-form-group">
                                        <label className="splst-form-label">Review Rating</label>
                                        <div className="splst-star-selector">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={24}
                                                    className={star <= reviewForm.rating ? "active" : ""}
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                    fill={star <= reviewForm.rating ? "var(--splst-primary-color)" : "none"}
                                                    stroke={star <= reviewForm.rating ? "var(--splst-primary-color)" : "#ccc"}
                                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="splst-form-group">
                                        <label className="splst-form-label">Your Comment</label>
                                        <textarea
                                            rows="3"
                                            className="splst-form-input"
                                            placeholder="Tell us about your visit..."
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="splst-btn splst-btn--primary" disabled={isReviewSubmitting}>
                                        {isReviewSubmitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="splst-review-form-card splst-anim-fade-up" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                                <div className="splst-section-icon-box" style={{ background: '#f8f9fa' }}>
                                    <User size={24} color="var(--splst-text-muted)" />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Want to leave a review?</h3>
                                    <p style={{ color: 'var(--splst-text-muted)', fontSize: '0.875rem' }}>Only registered patients can share their experiences.</p>
                                </div>
                                <button className="splst-btn splst-btn--secondary" style={{ borderColor: 'var(--splst-primary-color)', color: 'var(--splst-primary-color)' }} onClick={() => navigate('/user/login')}>
                                    Login to Continue
                                </button>
                            </div>
                        )}

                        <div className="splst-reviews-display-list">
                            {pageData.detailedReviews?.length > 0 ? (
                                pageData.detailedReviews.slice().reverse().map((rev, i) => (
                                    <div key={i} className="splst-review-card splst-anim-fade-up">
                                        <div className="splst-review-header">
                                            <div className="splst-reviewer-info">
                                                <div className="splst-reviewer-avatar">{rev.user?.charAt(0) || "P"}</div>
                                                <strong>{rev.user || "Patient"}</strong>
                                            </div>
                                            <div className="splst-review-stars">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star key={idx} size={14} fill={idx < (rev.rating || 5) ? "#fbbf24" : "none"} stroke="#fbbf24" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="splst-review-comment">"{rev.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="splst-review-card" style={{ textAlign: 'center' }}>
                                    <p className="splst-review-comment">No reviews yet. Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & Hours Section */}
            <section ref={contactSectionRef} className="splst-section splst-section--bg-light">
                <div className="splst-max-w-container">
                    <div className="splst-forms-header splst-anim-fade-up">
                        <h2 style={{ color: 'var(--splst-dark-color)' }}>Get in Touch</h2>
                        <p style={{ color: 'var(--splst-text-muted)' }}>Schedule a consultation or reach out with questions</p>
                    </div>

                    <div className="splst-contact-grid">
                        <div className="splst-contact-card splst-anim-fade-up splst-delay-2">
                            <div className="splst-contact-card__icon"><Phone size={20} /></div>
                            <div>
                                <h4 className="splst-contact-card__title">Phone</h4>
                                <p className="splst-contact-card__text">{basicInfo.phone || "+92 300 1234567"}</p>
                            </div>
                        </div>
                        <div className="splst-contact-card splst-anim-fade-up splst-delay-4">
                            <div className="splst-contact-card__icon"><Mail size={20} /></div>
                            <div>
                                <h4 className="splst-contact-card__title">Email</h4>
                                <p className="splst-contact-card__text">{basicInfo.email || "doctor@kohatmedical.com"}</p>
                            </div>
                        </div>
                        <div className="splst-contact-card splst-anim-fade-up splst-delay-6">
                            <div className="splst-contact-card__icon"><MapPin size={20} /></div>
                            <div>
                                <h4 className="splst-contact-card__title">Clinic</h4>
                                <p className="splst-contact-card__text">{basicInfo.address || basicInfo.clinicName || "Kohat, KPK"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Office Hours */}
                    <div className="splst-hours-card splst-anim-fade-up splst-delay-7">
                        <h3 className="splst-hours-card__title"><Clock size={18} color="var(--splst-primary-color)" /> Office Hours</h3>
                        <div className="splst-hours-grid">
                            {pageData.Timings ? (
                                Object.entries(pageData.Timings).map(([day, time], i) => (
                                    <div key={i} className="splst-hours-item">
                                        <div className="splst-hours-item__day">{day}</div>
                                        <div className="splst-hours-item__time">{time}</div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="splst-hours-item">
                                        <div className="splst-hours-item__day">Mon - Fri</div>
                                        <div className="splst-hours-item__time">5:00 PM - 9:00 PM</div>
                                    </div>
                                    <div className="splst-hours-item">
                                        <div className="splst-hours-item__day">Saturday</div>
                                        <div className="splst-hours-item__time">6:00 PM - 10:00 PM</div>
                                    </div>
                                    <div className="splst-hours-item">
                                        <div className="splst-hours-item__day">Sunday</div>
                                        <div className="splst-hours-item__time">Closed</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Forms */}
            <section className="splst-section splst-forms-section">
                <div className="splst-max-w-container">
                    <div className="splst-forms-header splst-anim-fade-up">
                        <h2>Book Your Consultation</h2>
                        <p>Choose between in-clinic or online consultation</p>
                    </div>

                    <div className="splst-grid-2-cols">
                        {/* In-Clinic Form */}
                        <div className="splst-form-card splst-anim-fade-up splst-delay-2">
                            <div className="splst-form-card__header">
                                <div className="splst-form-card__icon"><Calendar size={20} /></div>
                                <h3 className="splst-form-card__title">In-Clinic Appointment</h3>
                            </div>
                            <form onSubmit={(e) => handleBooking(e, 'clinic')}>
                                <AutofillNote />
                                <div className="splst-form-group">
                                    <label className="splst-form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        className="splst-form-input"
                                        required
                                        placeholder="Your name"
                                        value={clinicFormData.patientName}
                                        onChange={handleClinicInputChange}
                                    />
                                </div>
                                <div className="splst-form-group">
                                    <label className="splst-form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="splst-form-input"
                                        required
                                        placeholder="Your phone"
                                        value={clinicFormData.phone}
                                        onChange={handleClinicInputChange}
                                    />
                                </div>
                                <div className="splst-form-group">
                                    <label className="splst-form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="splst-form-input"
                                        required
                                        placeholder="your@email.com"
                                        value={clinicFormData.email}
                                        onChange={handleClinicInputChange}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="splst-form-group">
                                        <label className="splst-form-label">Preferred Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            className="splst-form-input"
                                            required
                                            value={clinicFormData.date}
                                            onChange={handleClinicInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="splst-form-group">
                                    <label className="splst-form-label">Reason for Visit</label>
                                    <textarea
                                        name="message"
                                        rows="3"
                                        className="splst-form-input"
                                        placeholder="Briefly describe your concerns"
                                        value={clinicFormData.message}
                                        onChange={handleClinicInputChange}
                                    ></textarea>
                                </div>
                                <button type="submit" className="splst-btn splst-btn--primary splst-btn--full">
                                    <CheckCircle size={16} /> Book Appointment
                                </button>
                                {isClinicSuccess && (
                                    <div className="splst-form-success">✓ Appointment request submitted successfully!</div>
                                )}
                            </form>
                        </div>

                        {/* Online Form */}
                        {(() => {
                            const onlineService = pageData.Services?.find(s => s.serviceKey === "ONLINE_CONSULTATION");
                            const isOnlineInactive = onlineService?.status === "INACTIVE";
                            
                            return (
                                <div className={`splst-form-card splst-anim-fade-up splst-delay-4 ${isOnlineInactive ? 'splst-form--disabled' : ''}`}>
                                    <div className="splst-form-card__header">
                                        <div className="splst-form-card__icon"><Video size={20} /></div>
                                        <h3 className="splst-form-card__title">Online Consultation</h3>
                                        {isOnlineInactive && (
                                            <span className="splst-status-badge inactive" style={{ marginLeft: 'auto' }}>Closed</span>
                                        )}
                                    </div>
                                    
                                    {isOnlineInactive ? (
                                        <div className="splst-unavailable-msg">
                                            <div className="splst-unavailable-icon">⚠️</div>
                                            <p>Online consultation is currently unavailable for this doctor.</p>
                                            <p className="splst-unavailable-sub">Please book an in-clinic appointment or check back later.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => handleBooking(e, 'online')}>
                                            <AutofillNote />
                                            <div className="splst-form-group">
                                                <label className="splst-form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="patientName"
                                                    className="splst-form-input"
                                                    required
                                                    placeholder="Your name"
                                                    value={onlineFormData.patientName}
                                                    onChange={handleOnlineInputChange}
                                                />
                                            </div>
                                            <div className="splst-form-group">
                                                <label className="splst-form-label">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="splst-form-input"
                                                    required
                                                    placeholder="Your phone"
                                                    value={onlineFormData.phone}
                                                    onChange={handleOnlineInputChange}
                                                />
                                            </div>
                                            <div className="splst-form-group">
                                                <label className="splst-form-label">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="splst-form-input"
                                                    required
                                                    placeholder="your@email.com"
                                                    value={onlineFormData.email}
                                                    onChange={handleOnlineInputChange}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="splst-form-group">
                                                    <label className="splst-form-label">Preferred Date</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        className="splst-form-input"
                                                        required
                                                        value={onlineFormData.date}
                                                        onChange={handleOnlineInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="splst-form-group">
                                                <label className="splst-form-label">Health Concern</label>
                                                <textarea
                                                    name="message"
                                                    rows="3"
                                                    className="splst-form-input"
                                                    placeholder="Describe your health concern in detail"
                                                    value={onlineFormData.message}
                                                    onChange={handleOnlineInputChange}
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="splst-btn splst-btn--primary splst-btn--full">
                                                <Send size={16} /> Schedule Consultation
                                            </button>
                                            {isOnlineSuccess && (
                                                <div className="splst-form-success">✓ Consultation request submitted successfully!</div>
                                            )}
                                        </form>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </div>
                
                <style jsx="true">{`
                    .splst-status-badge {
                        font-size: 11px;
                        padding: 2px 10px;
                        border-radius: 12px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .splst-status-badge.active {
                        background: #e1f5fe;
                        color: #0288d1;
                    }
                    .splst-status-badge.inactive {
                        background: #ffebee;
                        color: #d32f2f;
                    }
                    .splst-service--inactive {
                        opacity: 0.8;
                    }
                    .splst-form--disabled {
                        position: relative;
                        background: #fdfdfd !important;
                        border: 1px dashed #e0e0e0 !important;
                        box-shadow: none !important;
                    }
                    .splst-unavailable-msg {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 40px 20px;
                        text-align: center;
                        min-height: 300px;
                    }
                    .splst-unavailable-icon {
                        font-size: 40px;
                        margin-bottom: 20px;
                    }
                    .splst-unavailable-msg p {
                        color: #333;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }
                    .splst-unavailable-sub {
                        font-size: 14px;
                        color: #666 !important;
                        font-weight: 400 !important;
                    }
                `}</style>
            </section>

            {/* Footer */}
            <footer className="splst-footer">
                <p>© 2025 Dr. {basicInfo.adminName || "Specialist"} {basicInfo.specialization} · All rights reserved</p>
            </footer>
        </div>
    );
};

export default SpecialistsLandingPg;
