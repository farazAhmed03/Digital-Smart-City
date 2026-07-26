import { useEffect, useState } from "react";
import "../../CatagoriesHomePgs.css";
import "./EduHomePage.css";
import { useNavigate } from "react-router-dom";
import { categories } from "../../../Store/Edu_store";
import { ServiceProviderRegForm } from "../../../components/Forms/SPRegForm/SPRegForm";

export const EduHomePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    const [showForm, setShowform] = useState(false);

    return (
        <div className="EduHomePremium">
            {showForm ? (
                <div className="FormContainerSection">
                    <ServiceProviderRegForm setShowform={setShowform} forcedCategory="Education" />
                </div>
            ) : (
                <>
                    {/* HERO SECTION */}
                    <header className="EduHeroPremium">
                        <div className="HeroOverlay">
                            <div className="HeroContent">
                                <span className="HeroBadge">✨ Kohat's Trusted Education Portal</span>
                                <h1>Building Bridges to <strong>Academic Excellence</strong></h1>
                                <p className="HeroLead">
                                    The most comprehensive directory of schools, colleges, and professional
                                    institutes in Kohat. Find your path to success today.
                                </p>

                                <div className="HeroBtnGroup">
                                    <button className="btn-primary-premium" onClick={() => navigate("/edu/admin")}>
                                        Admin Login
                                    </button>
                                    <button className="btn-glass" onClick={() => setShowform(true)}>
                                        Partner With Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* CATEGORIES SECTION */}
                    <main id="categories" className="EduCategoriesPremium">
                        <div className="SectionHeader">
                            <span className="SubTitle">Our Directory</span>
                            <h2>Academic <strong>Categories</strong></h2>
                            <p>Choose your level of interest to see available options</p>
                        </div>

                        <section className="CategoriesGridPremium">
                            {categories.map((v, i) => (
                                <div 
                                    className="CategoryCardPremium" 
                                    key={i} 
                                    onClick={() => navigate(v.link)}
                                >
                                    <div className="CategoryThumb">
                                        <img src="https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg" alt={v.title} />
                                        <div className="CardTag">{v.title}</div>
                                    </div>
                                    <div className="CategoryDetails">
                                        <h3>{v.title}</h3>
                                        <p>{v.description}</p>
                                        <div className="CardFooter">
                                            <span>Explore Now</span>
                                            <i className="arrow-icon">→</i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </main>

                    {/* CTA SECTION */}
                    <section className="PartnerCtaEdu">
                        <div className="CtaContentWrapper">
                            <div className="CtaText">
                                <h2>Ready to showcase your institute?</h2>
                                <p>Join the largest educational network in Kohat and reach thousands of prospective students.</p>
                            </div>
                            <button className="cta-btn-modern" onClick={() => { setShowform(true); window.scrollTo(0, 0); }}>
                                Register Your Institute
                            </button>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};