import "./CollegesPg.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaChevronRight, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { GetServicesCardsFromDB } from "../../../ApiCalls/ApiCalls";

export const CollegesPage = () => {
    let [CollegeCrds, setCollegeCrds] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        GetServicesCardsFromDB(setCollegeCrds, "COLLEGE");
    }, []);

    if (CollegeCrds === undefined) {
        return (
            <div className="clg-loading-full">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="clg-page-wrapper">
            
            {/* 1. HERO AREA - Aesthetics First */}
            <section className="clg-hero-minimal">
                <div className="clg-hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
                
                <div className="clg-hero-inner">
                    <h1>Discover Top Rated Colleges</h1>
                    <p>Unlock your academic potential with the premier higher education institutions in Kohat.</p>
                    
                    <div className="clg-glass-search">
                        <FaSearch className="clg-search-icon" />
                        <input type="text" placeholder="Search college name..." />
                        <button>Search</button>
                    </div>
                </div>
            </section>

            {/* 2. ALL COLLEGES GRID */}
            <section className="clg-listing-minimal">
                <div className="clg-container">
                    <div className="clg-grid-3">
                        {CollegeCrds.length > 0 ? (
                            CollegeCrds.map((v, i) => (
                                <div className="clg-simple-card" key={i} onClick={() => navigate(`/edu/colleges/${v.id}`)}>
                                    <div className="clg-simple-img">
                                        <img src={v.img} alt={v.serviceName} />
                                    </div>
                                    <div className="clg-simple-info">
                                        <h3>{v.serviceName || v.InstName}</h3>
                                        <p><FaMapMarkerAlt /> Kohat, Pakistan</p>
                                        <button className="clg-view-btn">
                                            View Details <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="clg-no-results">
                                <h3>Curating Top Colleges</h3>
                                <p>Our directory of premier higher education institutions is currently being updated. Stay tuned for new additions coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
};