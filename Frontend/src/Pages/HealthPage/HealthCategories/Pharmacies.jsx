import "./HealthCatagories.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import { GetServicesCardsFromDB } from "../../../ApiCalls/ApiCalls";

export const PharmaciesPage = () => {

    const [specialists, setSpecialists] = useState([]);
    const [showList, setShowlist] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        GetServicesCardsFromDB(setSpecialists, "PHARMACY");
    }, []);

    const showRating = (v) => {
        const rd = v?.ratingData;

        // No rating yet
        if (!rd || !rd.totalReviews || rd.totalReviews === 0) {
            return (
                <div className="hlth-starsCont">
                    <span className="hlth-newBadge">New</span>
                </div>
            );
        }

        const avg = Number(rd.average || 0);
        const totalReviews = Number(rd.totalReviews || 0);

        const fullStars = Math.floor(avg);
        const emptyStars = 5 - fullStars;

        return (
            <div className="hlth-starsCont">
                {Array.from({ length: fullStars }).map((_, i) => (
                    <FaStar key={`full-${i}`} className="hlth-starFilled" />
                ))}

                {Array.from({ length: emptyStars }).map((_, i) => (
                    <FaRegStar key={`empty-${i}`} className="hlth-starEmpty" />
                ))}

                <span className="hlth-ratingText">
                    {avg.toFixed(1)} <span className="hlth-reviewsCount">({totalReviews})</span>
                </span>
            </div>
        );
    };

    return (
        <>
            <section className="hlth-health-cata-pg-sec">

                {/* LEFT LIST */}
                <div className={(showList) ? "hlth-lft-sec hlth-showList" : "hlth-lft-sec"}>

                    <h2 className="hlth-sector" onClick={() => navigate(`/health`)}>
                        Health
                    </h2>

                    <div className="hlth-institute-hd-lst">

                        <h2 className="hlth-institute-hd">Pharmacies</h2>

                        <ul className="hlth-institute-lst">

                            {
                                specialists?.length > 0
                                    ?
                                    specialists.map((v, i) => (
                                        <li
                                            key={v.id || i}
                                            onClick={() => {
                                                navigate(`/health/pharmacies/${v.id}`);
                                                setShowlist(false);
                                            }}
                                        >
                                            {v?.serviceName || "No Name"}
                                        </li>
                                    ))
                                    :
                                    <li>No Pharmacies Found</li>
                            }

                        </ul>

                    </div>

                </div>

                {/* MAIN */}
                <div className="hlth-main-sec">

                    <div
                        className="hlth-showLstBtn"
                        onClick={() => setShowlist(!showList)}
                    >
                        {(showList) ? <>&times;</> : <>&#9776;</>}
                    </div>

                    <div className="hlth-cata-pg-banner">

                        <h1 className="hlth-cata-pg-main-hd">
                            Top Rated Pharmacies in Your City
                        </h1>

                        <p>
                            Find reliable pharmacies and medical stores near you.
                        </p>

                        <SearchBar
                            SearchedInst={setSpecialists}
                            AllInst={specialists}
                        />

                    </div>

                    {/* CARDS */}

                    <div className="hlth-cata-card-cont">

                        {
                            specialists?.length > 0
                                ?
                                specialists.map((v, i) => (
                                    <div
                                        key={v.id || i}
                                        className="hlth-cata-pg-card"
                                        onClick={() =>
                                            navigate(`/health/pharmacies/${v.id}`)
                                        }
                                    >

                                        <img
                                            src={v?.img || "/placeholder.jpg"}
                                            alt="Pharmacy"
                                        />

                                        <div className="hlth-cata-pg-card-content">

                                            {showRating(v)}

                                            <h3>
                                                {v?.serviceName || "No Name"}
                                            </h3>

                                            <p>
                                                {typeof v?.Desc === "object"
                                                    ? v?.Desc?.description || "No Description Available"
                                                    : v?.Desc || "No Description Available"}
                                            </p>

                                            <button
                                                className="hlth-cata-pg-card-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/health/pharmacies/${v.id}`);
                                                }}
                                            >
                                                View Pharmacy
                                            </button>

                                        </div>

                                    </div>
                                ))
                                :
                                <p style={{ textAlign: "center", width: "100%" }}>
                                    Loading or No Data Found...
                                </p>
                        }

                    </div>

                </div>

            </section>
        </>
    );
};