import { useEffect, useState } from "react";
import "./TourismCategories.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useLocation, useNavigate } from "react-router-dom";
import { RestaurantsList, RestaurantsCardsData } from "../../../Store/Tourism_store";
import { TourismLandingPage } from "../Landingpage/TourismLandingpage";
import { FaStar, FaClock, FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import { getMergedData, getSelectedItem } from "../../../utils/dataMerger";

export const Restaurants = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [restaurantCards, setRestaurantCards] = useState(() => getMergedData(RestaurantsCardsData, "Tourism", "Restaurants"));
  const [showList, setShowList] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");

  const handleItemClick = (restaurantId, index) => {
    navigate(`?id=${restaurantId}`);
    setActiveItem(index);
  };

  const selectedRestaurant = getSelectedItem(RestaurantsCardsData, "Tourism", "Restaurants", id);

  return (
    <>
      {id && selectedRestaurant ? (
        <TourismLandingPage listing={selectedRestaurant} />
      ) : (
        <section className="tr-Tourism-Cata-Pg-Sec">
          {/* LEFT SIDEBAR */}
          <div className={showList ? "tr-lft-sec tr-showList" : "tr-lft-sec"}>
            <h2 className="tr-sector" onClick={() => navigate(`/tourism`)}>
              Tourism
            </h2>
            <div
              className="tr-institute-hd-lst">
              <h2 className="tr-institute-hd">Restaurants</h2>
              <ul className="tr-institute-lst">
                {getMergedData(RestaurantsList, "Tourism", "Restaurants").map((item, i) => (
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
              <h1 className="tr-tr-cata-pg-main-hd">Top Restaurants in Kohat</h1>
              <p>Discover the best local cuisine and dining spots in Kohat.</p>
              <SearchBar SearchedInst={setRestaurantCards} AllInst={RestaurantsCardsData} />
            </div>

            <div className="tr-cata-card-cont">
              {restaurantCards.map((restaurant) => (
                <div className="tr-card tr-premium-card" key={restaurant.id}>
                  <div className="tr-card-img-container">
                    <img src={restaurant.img || restaurant.bgImage} alt={restaurant.name} />
                    <div className="tr-card-rating">
                      <FaStar className="tr-star-icon" />
                      <span>{restaurant.rating || "4.5"}</span>
                      <small>({restaurant.reviewsCount || "120"} reviews)</small>
                    </div>
                  </div>
                  <div className="tr-card-content">
                    <div className="tr-card-header">
                      <h3>{restaurant.name}</h3>
                      <span className="tr-card-city"><FaMapMarkerAlt /> {restaurant.commonInfo?.basicInfo?.city || "Kohat"}</span>
                    </div>

                    <div className="tr-card-details-grid">
                      <div className="tr-detail-item">
                        <FaClock />
                        <span>{restaurant.commonInfo?.visitingInfo?.openingTime || "Open Now"}</span>
                      </div>
                      <div className="tr-detail-item">
                        <FaTicketAlt />
                        <span>{restaurant.commonInfo?.visitingInfo?.entryFee || "View Menu"}</span>
                      </div>
                    </div>

                    <p className="tr-card-short-desc">{restaurant.commonInfo?.basicInfo?.shortIntroduction || "Delicious local and traditional food in Kohat."}</p>

                    <button
                      onClick={() => navigate(`/tourism/landing`, { state: { listing: restaurant } })}
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
