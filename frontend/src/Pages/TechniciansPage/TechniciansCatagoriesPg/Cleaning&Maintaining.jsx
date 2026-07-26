import React, { useEffect, useState } from "react";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import "./TechiciansCataPgs.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
// IMPORT CLEANING & MAINTENANCE STORE
import { CM_ExpertCrdDta, CM_ExpertDetails, CleaningMaintExperts } from "../../../Store/Techcn_Store";

export const CleanMaintCata = () => {

    // Scroll to top on page load
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // States
    let [showList, setShowlist] = useState(false);
    let [userTags, setUsertags] = useState(false);
    let [Crdsdta, setCrdsdta] = useState(CM_ExpertCrdDta);

    // Navigation
    const navigate = useNavigate();

    // Query parameter
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const id = query.get("id");

    return (
        <section className="Tech-Cata-Pg-Sec">
            {/* Page Banner */}
            <div className="Tech-cata-pg-banner">
                <h1 className="tech-cata-h1">Find Cleaning & Maintenance Experts</h1>
                <p className="tech-cata-p">
                    Professional cleaning and maintenance services for homes and offices.
                </p>

                <SearchBar SearchedInst={setCrdsdta} AllInst={CM_ExpertCrdDta} />

                <div className="Usr-Icon-TagsCont">
                    <span className="usrIcon" onClick={() => setUsertags(!userTags)}>
                        <FaUser />
                    </span>
                    <ul className={userTags ? "tags-cont flexDsply" : "tags-cont"}>
                        <li>Dashboard</li>
                        <li>Appointments</li>
                        <li>Booking</li>
                        <li>Dashboard</li>
                        <li>Appointments</li>
                        <li>Booking</li>
                    </ul>
                </div>
            </div>

            {/* Main Body */}
            <div className="tech-cata-fltr-crdsCont">

                {/* Toggle Button */}
                <div className="tech-toggle-btn" onClick={() => setShowlist(!showList)}>
                    {showList ? <p style={{ fontSize: "2rem", padding: "6px" }}>&times;</p> : <>&#9776;</>}
                </div>

                {/* Sidebar */}
                <div className={showList ? "tech-cata-fltr display" : "tech-cata-fltr"}>
                    <h2 className="sector-hdng" onClick={() => navigate("/tech")}>Technicians</h2>
                    <ul className="list">
                        {CleaningMaintExperts.map((v, i) => (
                            <li key={i} onClick={() => { navigate(`/tech/clean-maint?id=${v.id}`); setShowlist(false); }}>
                                {v.ExpertName}
                            </li>
                        ))}
                        <li onClick={() => { navigate("/tech/clean-maint"); setShowlist(false); }}>Back To Cards</li>
                        <li className="user-tag" onClick={() => setShowlist(false)}>Dashboard</li>
                        <li className="user-tag" onClick={() => setShowlist(false)}>Appointment</li>
                        <li className="user-tag" onClick={() => setShowlist(false)}>Bookings</li>
                    </ul>
                </div>

                {/* Cards / Details */}
                <div className="tech-cata-crdCont">

                    {id ? (
                        // -------------------- DETAILS PAGE --------------------
                        CM_ExpertDetails.filter(v => v.id === Number(id)).map((v, i) => (
                            <div className="resume-box" key={i}>
                                <div>
                                    <img src={v.img} alt="Profile" className="profile-img" />
                                    <h1>{v.Title}</h1>
                                    <div className="role">Professional Cleaning & Maintenance Expert</div>
                                </div>

                                <div className="section">
                                    <h3>Contact</h3>
                                    {v.Contact_Info.map((c, i) => (
                                        <React.Fragment key={i}>
                                            <p>Address : {c.Address}</p>
                                            <p>Email : {c.Email}</p>
                                            <p>Phone : {c.Phone}</p>
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="section">
                                    <h3>Services</h3>
                                    <ul>
                                        {v.Services.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>

                                <div className="section">
                                    <h3>Rates</h3>
                                    <p>Call-out fee: {v.Rates["CallOut_fee"]}</p>
                                    <p>Hourly: {v.Rates["Hourly"]}</p>
                                </div>

                                <div className="section">
                                    <h3>Experience</h3>
                                    <p>{v.Experience}</p>
                                </div>

                                <button className="preview-btn">Preview / Print</button>
                            </div>
                        ))
                    ) : (
                        // -------------------- CARD VIEW --------------------
                        <div className="cata-card-cont">
                            {Crdsdta.map((v, i) => (
                                <div className="cata-pg-card" key={i}>
                                    <img src={v.img} alt="Cleaning Expert" />
                                    <div className="cata-pg-card-content">
                                        <h3>{v.InstName}</h3>
                                        <p>{v.Desc}</p>
                                        <button
                                            className="cata-pg-card-btn"
                                            onClick={() => navigate(`/tech/clean-maint?id=${v.id}`)}
                                        >
                                            {v.btn_txt}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </section>
    );
};
