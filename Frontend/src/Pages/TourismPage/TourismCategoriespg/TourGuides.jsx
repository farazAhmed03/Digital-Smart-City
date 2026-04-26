import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { TourGuidesList, TourGuidesCardsData } from "../../../Store/Tourism_store";
import { TourismLandingPage } from "../Landingpage/TourismLandingpage";
import { FaStar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import "./TourismCategories.css";
import { getMergedData, getSelectedItem } from "../../../utils/dataMerger";

export const TourGuides = () => {
    useEffect(() => window.scrollTo(0, 0), []);

    const [cards, setCards] = useState(() => getMergedData(TourGuidesCardsData, "Tourism", "Tour Guides"));
    const [showList, setShowList] = useState(false);

    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const id = query.get("id");

    const handleCardClick = (cardId) => {
        navigate(`?id=${cardId}`);
    };

    const isActive = (cardId) => String(cardId) === String(id);

    const selectedGuide = getSelectedItem(TourGuidesCardsData, "Tourism", "Tour Guides", id);

    return (
        <>
            {id && selectedGuide ? (
                <TourismLandingPage listing={selectedGuide} />
            ) : (
                <section className="tr-Tourism-Cata-Pg-Sec">
                    <div className={showList ? "tr-lft-sec tr-showList" : "tr-lft-sec"}>
                        <h2 className="tr-sector" onClick={() => navigate(`/tourism`)}>
                            Tourism
                        </h2>
                        <div className="tr-institute-hd-lst">
                            <h2 className="tr-institute-hd">Professional Guides</h2>
                            <ul className="tr-institute-lst">
                                {getMergedData(TourGuidesList, "Tourism", "Tour Guides").map((guide) => (
                                    <li
                                        key={guide.id}
                                        onClick={() => handleCardClick(guide.id)}
                                        className={isActive(guide.id) ? "active" : ""}
                                    >
                                        {guide.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="tr-main-sec">
                        <div className="tr-showLstBtn" onClick={() => setShowList(!showList)}>
                            {showList ? <>&times;</> : <>&#9776;</>}
                        </div>

                        <div className="tr-cata-pg-banner">
                            <h1 className="tr-tr-cata-pg-main-hd">Professional Tour Guides</h1>
                            <p>Hire experienced local guides to explore the best of Kohat.</p>
                            <SearchBar SearchedInst={setCards} AllInst={TourGuidesCardsData} />
                        </div>

                        <div className="tr-cata-card-cont">
                            {cards.map((guide) => (
                                <div
                                    className="tr-card tr-premium-card"
                                    key={guide.id}
                                    onClick={() => navigate(`/tourism/landing`, { state: { listing: guide } })}
                                >
                                    <div className="tr-card-img-container">
                                        <img src={guide.img || guide.bgImage} alt={guide.name} />
                                        <div className="tr-card-rating">
                                            <FaStar className="tr-star-icon" />
                                            <span>{guide.rating || "4.8"}</span>
                                            <small>({guide.reviewsCount || "30"} reviews)</small>
                                        </div>
                                    </div>
                                    <div className="tr-card-content">
                                        <div className="tr-card-header">
                                            <h3>{guide.name}</h3>
                                            <span className="tr-card-city"><FaMapMarkerAlt /> {guide.commonInfo?.basicInfo?.city || "Kohat"}</span>
                                        </div>

                                        <div className="tr-card-tagline">
                                            <FaUserTie /> <span>{guide.tagline}</span>
                                        </div>

                                        <div className="tr-card-details-grid">
                                            <div className="tr-detail-item">
                                                <FaPhoneAlt />
                                                <span>{guide.contact?.phone}</span>
                                            </div>
                                            <div className="tr-detail-item">
                                                <FaEnvelope />
                                                <span>{guide.contact?.email}</span>
                                            </div>
                                        </div>

                                        <p className="tr-card-short-desc">{guide.commonInfo?.basicInfo?.shortIntroduction || "Experienced local guide specializing in cultural and adventure tours."}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};
