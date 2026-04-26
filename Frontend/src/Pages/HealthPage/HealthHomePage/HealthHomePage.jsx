import { useEffect, useState } from "react";
import "./HealthHomePage.css";
import { useNavigate } from "react-router-dom";
import { healthCategories } from "../../../Store/Hospital_store";
import { ServiceProviderRegForm } from "../../../components/Forms/SPRegForm/SPRegForm";

export const HealthHomePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    const [showForm, setShowform] = useState(false);

    return (
        <div className="health-home-premium">
            {showForm ? (
                <div className="health-form-container">
                    <ServiceProviderRegForm setShowform={setShowform} forcedCategory="Health" />
                </div>
            ) : (
                <>
                    {/* HERO SECTION */}
                    <header className="health-hero-premium">
                        <div className="health-hero-overlay">
                            <div className="health-hero-content">
                                <span className="health-hero-badge">✨ Kohat's Trusted Health Portal</span>
                                <h1>Providing Access to <strong>Quality Healthcare</strong></h1>
                                <p className="health-hero-lead">
                                    The most comprehensive directory of specialists, pharmacies, and 
                                    emergency services in Kohat. Your health is our priority.
                                </p>

                                <div className="health-hero-btn-group">
                                    <button className="health-btn-primary" onClick={() => navigate("/health/admin")}>
                                        Admin Login
                                    </button>
                                    <button className="health-btn-glass" onClick={() => setShowform(true)}>
                                        Partner With Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* CATEGORIES SECTION */}
                    <main id="health-categories" className="health-categories-premium">
                        <div className="health-section-header">
                            <span className="health-subtitle">Our Directory</span>
                            <h2>Medical <strong>Categories</strong></h2>
                            <p>Select a category to find the medical services you need</p>
                        </div>

                        <section className="health-categories-grid">
                            {healthCategories.map((v, i) => (
                                <div 
                                    className={`health-category-card ${(v.title === "Emergency" || v.title === "Pharmacies") ? "coming-soon" : ""}`} 
                                    key={i} 
                                    onClick={() => (v.title === "Emergency" || v.title === "Pharmacies") ? navigate("/health/coming-soon") : navigate(v.link)}
                                >
                                    <div className="health-category-thumb">
                                        <img src={v.image || "https://images.pexels.com/photos/40568/hospital-medical-healthcare-doctor-40568.jpeg"} alt={v.title} />
                                        <div className="health-card-tag">{v.title}</div>
                                    </div>
                                    <div className="health-category-details">
                                        <h3>{v.title}</h3>
                                        <p>{v.description}</p>
                                        <div className="health-card-footer">
                                            <span>{(v.title === "Emergency" || v.title === "Pharmacies") ? "Coming Soon" : "Explore Now"}</span>
                                            <i className="health-arrow-icon">→</i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </main>

                    {/* CTA SECTION */}
                    <section className="health-partner-cta">
                        <div className="health-cta-wrapper">
                            <div className="health-cta-text">
                                <h2>Ready to showcase your services?</h2>
                                <p>Join the largest healthcare network in Kohat and reach more patients in need.</p>
                            </div>
                            <button className="health-cta-btn" onClick={() => { setShowform(true); window.scrollTo(0, 0); }}>
                                Register Your Service
                            </button>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};
