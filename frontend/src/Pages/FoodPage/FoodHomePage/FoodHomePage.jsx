import { useEffect, useState } from "react";
import "../../CatagoriesHomePgs.css";
import "./FoodHomePage.css";
import { useNavigate } from "react-router-dom";
import { FoodRegForm } from "../../../components/Forms/FoodRegForm/FoodRegForm";
import { Food_categories } from "../../../Store/Food_store";

export const FoodHomePage = () => {

    // To show page from the top:
    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    // Navigate use to redirect to other pages:
    const navigate = useNavigate();

    // useState to open the Form
    let [showForm, setShowform] = useState(false);

    return (
        <section className="FoodHomePremium">
            {/* LUXURY HERO SECTION */}
            <header className="FoodHeroPremium">
                <div className="HeroOverlay">
                    <div className="HeroContent">
                        <span className="fd-HeroBadge">KPK's Premier Food Network</span>
                        <h1>Taste the Essence of <strong>KPK Heritage</strong></h1>
                        <p className="HeroLead">
                            From the spicy streets of Peshawar to the cozy cafes of Kohat,
                            discover the culinary crown jewels of Khyber Pakhtunkhwa.
                        </p>
                        <div className="HeroBtnGroup">
                            <button className="btn-primary" onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}>
                                Explore Cuisines
                            </button>
                            <button className="btn-secondary" onClick={() => setShowform(!showForm)}>
                                {showForm ? "Close Registration" : "Join as Merchant"}
                            </button>
                            <button className="fd-hero-admin-login-btn" onClick={() => navigate('/food/admin')}>
                                Admin Login
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MERCHANT REGISTRATION SECTION (Conditional) */}
            {showForm && (
                <section className="MerchantSection">
                    <div className="MerchantContainer">
                        <div className="MerchantCard">
                            <div className="MerchantInfo">
                                <span className="MerchantEyebrow">Business Partnership</span>
                                <h2>Elevate Your Culinary <strong>Legacy</strong></h2>
                                <p>
                                    Join Digital KPK&apos;s premium food network and connect with
                                    thousands of food enthusiasts. Scale your operations with an
                                    enterprise-grade partner experience.
                                </p>
                                <ul className="MerchantPerks">
                                    <li>Real-time order dashboard</li>
                                    <li>AI-powered demand insights</li>
                                    <li>Provincial brand visibility</li>
                                </ul>
                                <div className="MerchantDivider" />
                                <div className="MerchantExisting">
                                    <p>Already an established partner?</p>
                                    <button
                                        className="MerchantDashboardLink"
                                        onClick={() => navigate('/food/admin')}
                                    >
                                        Merchant Dashboard →
                                    </button>
                                </div>
                            </div>
                            <FoodRegForm setShowform={setShowform} />
                        </div>
                    </div>
                </section>
            )}

            {/* BROWSE CATEGORIES */}
            <main id="categories" className="FoodCategoriesPremium">
                <div className="SectionTitleCenter">
                    <h2>Browse by <strong>Expertise</strong></h2>
                    <p>Select a category to find the best dining spots tailored to your mood.</p>
                </div>

                <section className="fd-CategoriesGridPremium">
                    {Food_categories.map((v, i) => (
                        <div className="fd-CategoryCardPremium" key={i} onClick={() => navigate(v.link)}>
                            <div className="CategoryThumb">
                                <img src={v.img} alt={v.title} />
                                <div className="CategoryIcon">
                                    {v.icon}
                                </div>
                            </div>
                            <div className="CategoryDetails">
                                <h3>{v.title}</h3>
                                <p>{v.description}</p>
                                <button className="explore-btn">{v.btn}</button>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            {/* PARTNER BANNER (If form is not open) */}
            {!showForm && (
                <section className="fd-PartnerCta">
                    <div className="fd-CtaContent">
                        <h2>Your Restaurant Deserves the <strong>Spotlight</strong></h2>
                        <p>Partner with us today and take your culinary business to new heights.</p>
                        <button className="cta-btn" onClick={() => {
                            setShowform(true);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}>
                            Get Started Now
                        </button>
                    </div>
                </section>
            )}
        </section>
    );
};
