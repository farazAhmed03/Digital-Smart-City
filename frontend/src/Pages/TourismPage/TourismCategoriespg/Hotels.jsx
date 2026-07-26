import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { HotelsList, HotelCardsData } from "../../../Store/Tourism_store";
import { TourismLandingPage } from "../Landingpage/TourismLandingpage";
import { FaStar, FaClock, FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./TourismCategories.css";
import { getMergedData, getSelectedItem } from "../../../utils/dataMerger";

export const Hotels = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [cards, setCards] = useState(() => getMergedData(HotelCardsData, "Tourism", "Hotels"));
  const [showList, setShowList] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id"); // currently selected hotel id

  const handleCardClick = (cardId) => {
    navigate(`?id=${cardId}`);
  };

  // Helper to check if item is active
  const isActive = (cardId) => String(cardId) === String(id);

  const selectedHotel = getSelectedItem(HotelCardsData, "Tourism", "Hotels", id);

  return (
    <>
      {id && selectedHotel ? (
        <TourismLandingPage listing={selectedHotel} />
      ) : (
        <section className="tr-Tourism-Cata-Pg-Sec">
          {/* Sidebar */}
          <div className={showList ? "tr-lft-sec tr-showList" : "tr-lft-sec"}>
            <h2 className="tr-sector" onClick={() => navigate(`/tourism`)}>
              Tourism
            </h2>
            <div className="tr-institute-hd-lst">
              <h2 className="tr-institute-hd">Hotels & Stays</h2>
              <ul className="tr-institute-lst">
                {getMergedData(HotelsList, "Tourism", "Hotels").map((hotel) => (
                  <li
                    key={hotel.id}
                    onClick={() => handleCardClick(hotel.id)}
                    className={isActive(hotel.id) ? "active" : ""}
                  >
                    {hotel.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="tr-main-sec">
            <div className="tr-showLstBtn" onClick={() => setShowList(!showList)}>
              {showList ? <>&times;</> : <>&#9776;</>}
            </div>

            <div className="tr-cata-pg-banner">
              <h1 className="tr-tr-cata-pg-main-hd">Best Hotels & Stays in Kohat</h1>
              <p>Find the most comfortable hotels, guest houses, and stays in Kohat.</p>
              <SearchBar SearchedInst={setCards} AllInst={HotelCardsData} />
            </div>

            <div className="tr-cata-card-cont">
              {cards.map((hotel) => (
                <div
                  className="tr-card tr-premium-card"
                  key={hotel.id}
                  onClick={() => navigate(`/tourism/landing`, { state: { listing: hotel } })}
                >
                  <div className="tr-card-img-container">
                    <img src={hotel.img || hotel.bgImage} alt={hotel.name} />
                    <div className="tr-card-rating">
                      <FaStar className="tr-star-icon" />
                      <span>{hotel.rating || "4.5"}</span>
                      <small>({hotel.reviewsCount || "120"} reviews)</small>
                    </div>
                  </div>
                  <div className="tr-card-content">
                    <div className="tr-card-header">
                      <h3>{hotel.name}</h3>
                      <span className="tr-card-city"><FaMapMarkerAlt /> {hotel.commonInfo?.basicInfo?.city || "Kohat"}</span>
                    </div>

                    <div className="tr-card-details-grid">
                      <div className="tr-detail-item">
                        <FaClock />
                        <span>Available 24/7</span>
                      </div>
                      <div className="tr-detail-item">
                        <FaTicketAlt />
                        <span>{hotel.commonInfo?.visitingInfo?.entryFee || "Book Room"}</span>
                      </div>
                    </div>

                    <p className="tr-card-short-desc">{hotel.commonInfo?.basicInfo?.shortIntroduction || "Luxury stay experience in the heart of the city."}</p>
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
