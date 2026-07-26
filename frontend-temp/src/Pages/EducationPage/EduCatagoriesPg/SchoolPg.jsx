import "./SchoolPg.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaChevronRight, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { GetServicesCardsFromDB } from "../../../ApiCalls/ApiCalls";

export const SchoolPage = () => {
    let [SchoolCrds, setSchoolCrds] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        GetServicesCardsFromDB(setSchoolCrds, "SCHOOL");
    }, []);

    if (SchoolCrds === undefined) {
        return (
            <div className="sch-loading-full">
                <div className="loader"></div>
                <p>Loading Schools...</p>
            </div>
        );
    }

    return (
        <div className="sch-page-wrapper">
            
            {/* 1. HERO AREA - Aesthetics First */}
            <section className="sch-hero-minimal">
                <div className="sch-hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
                
                <div className="sch-hero-inner">
                    <h1>Find the Right School for Your Child</h1>
                    <p>Discover premier educational institutions in Kohat through our curated directory.</p>
                    
                    <div className="sch-glass-search">
                        <FaSearch className="sch-search-icon" />
                        <input type="text" placeholder="Search school name..." />
                        <button>Search</button>
                    </div>
                </div>
            </section>

            {/* 2. ALL SCHOOLS GRID */}
            <section className="sch-listing-minimal">
                <div className="sch-container">
                    <div className="sch-grid-3">
                        {SchoolCrds.length > 0 ? (
                            SchoolCrds.map((v, i) => (
                                <div className="sch-simple-card" key={i} onClick={() => navigate(`/edu/schools/${v.id}`)}>
                                    <div className="sch-simple-img">
                                        <img src={v.img} alt={v.serviceName} />
                                    </div>
                                    <div className="sch-simple-info">
                                        <h3>{v.serviceName || v.InstName}</h3>
                                        <p><FaMapMarkerAlt /> Kohat, Pakistan</p>
                                        <button className="sch-view-btn">
                                            View Details <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="sch-no-results">
                                <h3>Directory Opening Soon</h3>
                                <p>We are currently onboarding premier schools in Kohat. Please check back soon as we expand our educational directory.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};