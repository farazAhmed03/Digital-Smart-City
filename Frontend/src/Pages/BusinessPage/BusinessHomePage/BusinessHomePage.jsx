import { useEffect, useState } from "react";
import "../../CatagoriesHomePgs.css";
import "./BusinessHomePage.css";
import { useNavigate } from "react-router-dom";
import { businessCategories } from "../../../Store/Business_store";
import { BusinessRegisterForm } from "../BusinessRegistration";

export const BusinessHomePage = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    const navigate = useNavigate();
    const [showForm, setShowform] = useState(false);

    return (
        <div className="business-home-wrapper">
            {showForm ? (
                <BusinessRegisterForm setShowform={setShowform} />
            ) : (
                <section className="pg-sec">
                    <div className="business-actions-container">
                        <button onClick={() => setShowform(true)} className="business-btn btn-register">Business Registration</button>
                        <button onClick={() => navigate("admin-login")} className="business-btn btn-login">Admin Login</button>
                    </div>

                    <div className="content-cont">
                        <h1>Connect with Top <strong>Businesses</strong> in Kohat</h1>
                        <p className="pg-desc">
                            Find the best shops, offices, service providers, and professionals in <b>Kohat</b>.
                            Whether you are looking for retail therapy, corporate services, or skilled freelancers,
                            we connect you with the right businesses.
                        </p>

                        <div className="card-Container">
                            {businessCategories.map((v, i) => (
                                <div className="card" key={i} style={{ width: "280px", overflow: "hidden", padding: "0" }}>
                                    <div style={{ height: "160px", overflow: "hidden" }}>
                                        <img
                                            src={v.coverImage || "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"}
                                            alt={v.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <h2 className="Cata_Title" style={{ fontSize: "1.3rem", margin: "10px 0" }}>{v.title}</h2>
                                        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "15px" }}>{v.description}</p>
                                        <button className="pg-crd-btn" onClick={() => navigate(v.link)}>{v.btn}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
