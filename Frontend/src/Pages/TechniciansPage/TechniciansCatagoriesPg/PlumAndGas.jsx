import React, { useEffect, useState } from "react";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import "./TechiciansCataPgs.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

// IMPORT UPDATED STORE (Plumbing & Gas)
import { PG_ExpertCrdDta, PG_ExpertDetails, PlumbingGasExperts } from "../../../Store/Techcn_Store";

export const PlumbingGasCata = () => {

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // States
    let [showList, setShowlist] = useState(false);
    let [userTags, setUsertags] = useState(false);
    let [Crdsdta, setCrdsdta] = useState(PG_ExpertCrdDta);

    // Navigation
    const navigate = useNavigate();

    // Query param
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const id = query.get("id");

    return (
        <section className="Tech-Cata-Pg-Sec">

            {/* Page Banner */}
            <div className="Tech-cata-pg-banner">
                <h1 className="tech-cata-h1">Find Expert Plumbing & Gas Technicians</h1>
                <p className="tech-cata-p">
                    Professional plumbing and gas maintenance services available at your convenience.
                </p>

                <SearchBar SearchedInst={setCrdsdta} AllInst={PG_ExpertCrdDta} />

                <div className="Usr-Icon-TagsCont">
                    <span className="usrIcon" onClick={() => { setUsertags(!userTags) }}>
                        <FaUser />
                    </span>

                    <ul className={(userTags) ? "tags-cont flexDsply" : "tags-cont"}>
                        <li>Dashboard</li>
                        <li>Appointments</li>
                        <li>Booking</li>
                        <li>Dashboard</li>
                        <li>Appointments</li>
                        <li>Booking</li>
                    </ul>
                </div>
            </div>

            {/* Page Body */}
            <div className="tech-cata-fltr-crdsCont">

                {/* Toggle Button */}
                <div className="tech-toggle-btn" onClick={() => { setShowlist(!showList) }}>
                    {showList ? (
                        <p style={{ fontSize: "2rem", padding: "6px" }}>&times;</p>
                    ) : (
                        <>&#9776;</>
                    )}
                </div>

                {/* Sidebar */}
                <div className={(showList) ? "tech-cata-fltr display" : "tech-cata-fltr"}>
                    <h2 className="sector-hdng" onClick={() => { navigate("/tech") }}>
                        Technicians
                    </h2>

                    {/* Show Plumbing & Gas Expert List */}
                    <ul className="list">
                        {PlumbingGasExperts.map((v, i) => {
                            return (
                                <li
                                    onClick={() => {
                                        navigate(`/tech/Plumb-Gas?id=${v.id}`);
                                        setShowlist(false);
                                    }}
                                    key={i}
                                >
                                    {v.ExpertName}
                                </li>
                            );
                        })}

                        <li onClick={() => { navigate("/tech/Plumb-Gas"); setShowlist(false); }}>
                            Back To Cards
                        </li>

                        <li className="user-tag" onClick={() => { setShowlist(false); }}>Dashboard</li>
                        <li className="user-tag" onClick={() => { setShowlist(false); }}>Appointment</li>
                        <li className="user-tag" onClick={() => { setShowlist(false); }}>Bookings</li>
                    </ul>
                </div>

                {/* Cards OR Resume Page */}
                <div className="tech-cata-crdCont">

                    {id ? (
                        // --------------------  DETAILS PAGE --------------------
                        PG_ExpertDetails.filter((v) => v.id === Number(id)).map((v, i) => {
                            return (
                                <div className="resume-box" key={i}>

                                    <div>
                                        <img src={v.img} alt="Profile" className="profile-img" />
                                        <h1>{v.Title}</h1>
                                        <div className="role">Certified Plumbing & Gas Technician</div>
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
                                            {v.Services.map((s, i) => (
                                                <li key={i}>{s}</li>
                                            ))}
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
                            );
                        })
                    ) : (
                        // --------------------  CARD LIST --------------------
                        <div className="cata-card-cont">
                            {Crdsdta.map((v, i) => (
                                <div className="cata-pg-card" key={i}>
                                    <img src={v.img} alt="Plumbing/Gas Expert" />

                                    <div className="cata-pg-card-content">
                                        <h3>{v.InstName}</h3>
                                        <p>{v.Desc}</p>
                                        <button
                                            onClick={() => {
                                                navigate(`/tech/Plumb-Gas?id=${v.id}`);
                                            }}
                                            className="cata-pg-card-btn"
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
