import { useEffect, useState } from "react";
import "./TourismCategories.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useLocation, useNavigate } from "react-router-dom";
import { NatureList, NatureCardsData } from "../../../Store/Tourism_store";
import { TourismLandingPage } from "../Landingpage/TourismLandingpage";
import { FaStar, FaClock, FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import { getMergedData, getSelectedItem } from "../../../utils/dataMerger";

export const Parks = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [natureCards, setNatureCards] = useState(() => getMergedData(NatureCardsData, "Tourism", "Parks"));
  const [showList, setShowList] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");

  const handleItemClick = (placeId, index) => {
    navigate(`?id=${placeId}`);
    setActiveItem(index);
  };

  const selectedNature = getSelectedItem(NatureCardsData, "Tourism", "Parks", id);

  return (
    <>
      {id && selectedNature ? (
        <TourismLandingPage listing={selectedNature} />
      ) : (
        <section className="tr-Tourism-Cata-Pg-Sec">
          {/* LEFT SIDEBAR */}
          <div className={showList ? "tr-lft-sec tr-showList" : "tr-lft-sec"}>
            <h2 className="tr-sector" onClick={() => navigate(`/tourism`)}>
              Tourism
            </h2>
            <div className="tr-institute-hd-lst">
              <h2 className="tr-institute-hd">Parks & Nature</h2>
              <ul className="tr-institute-lst">
                {getMergedData(NatureList, "Tourism", "Parks").map((item, i) => (
                  <li
                    key={item.id}
                    className={activeItem === i ? "active" : ""}
                    onClick={() => handleItemClick(item.id, i)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="tr-main-sec">
            <div className="tr-showLstBtn" onClick={() => setShowList(!showList)}>
              {showList ? <>&times;</> : <>&#9776;</>}
            </div>

            <div className="tr-cata-pg-banner">
              <h1 className="tr-tr-cata-pg-main-hd">Best Parks & Nature Spots in Kohat</h1>
              <p>Relax and enjoy nature in Kohat's parks and natural spots.</p>
              <SearchBar SearchedInst={setNatureCards} AllInst={NatureCardsData} />
            </div>

            <div className="tr-cata-card-cont">
              {natureCards.map((place) => (
                <div className="tr-card tr-premium-card" key={place.id}>
                  <div className="tr-card-img-container">
                    <img src={place.img || place.bgImage} alt={place.name} />
                    <div className="tr-card-rating">
                      <FaStar className="tr-star-icon" />
                      <span>{place.rating || "4.5"}</span>
                      <small>({place.reviewsCount || "120"} reviews)</small>
                    </div>
                  </div>
                  <div className="tr-card-content">
                    <div className="tr-card-header">
                      <h3>{place.name}</h3>
                      <span className="tr-card-city"><FaMapMarkerAlt /> {place.commonInfo?.basicInfo?.city || "Kohat"}</span>
                    </div>

                    <div className="tr-card-details-grid">
                      <div className="tr-detail-item">
                        <FaClock />
                        <span>{place.commonInfo?.visitingInfo?.openingTime || "N/A"} - {place.commonInfo?.visitingInfo?.closingTime || "N/A"}</span>
                      </div>
                      <div className="tr-detail-item">
                        <FaTicketAlt />
                        <span>{place.commonInfo?.visitingInfo?.entryFee || "Free"}</span>
                      </div>
                    </div>

                    <p className="tr-card-short-desc">{place.commonInfo?.basicInfo?.shortIntroduction || "Relax and enjoy nature in this beautiful spot."}</p>

                    <button
                      onClick={() => navigate(`/tourism/landing`, { state: { listing: place } })}
                      className="tr-explore-btn"
                    >
                      Explore Destination
                    </button>
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
