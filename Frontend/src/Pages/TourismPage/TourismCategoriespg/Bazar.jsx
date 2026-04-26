import { useEffect, useState } from "react";
import "./TourismCategories.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useLocation, useNavigate } from "react-router-dom";
import { BazarList, BazarCardsData } from "../../../Store/Tourism_store";
import { TourismLandingPage } from "../Landingpage/TourismLandingpage";
import { FaStar, FaClock, FaTicketAlt, FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import { getMergedData, getSelectedItem } from "../../../utils/dataMerger";

export const Bazar = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [bazarCards, setBazarCards] = useState(() => getMergedData(BazarCardsData, "Tourism", "Bazar"));
  const [filteredCards, setFilteredCards] = useState([]);
  const [showList, setShowList] = useState(false);
  const [activeBazar, setActiveBazar] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");

  const categories = ["All", "General", "Meat", "Cosmetic", "Cloth", "Shoes", "Super Market"];

  useEffect(() => {
    const merged = getMergedData(BazarCardsData, "Tourism", "Bazar");
    setBazarCards(merged);
    setFilteredCards(merged);

    // Set active item if ID is present
    if (id) {
      const index = merged.findIndex(b => b.id.toString() === id.toString());
      if (index !== -1) setActiveBazar(index);
    }
  }, [id]);

  useEffect(() => {
    let result = bazarCards;
    if (selectedCategory !== "All") {
      result = bazarCards.filter(card => card.category === selectedCategory);
    }
    setFilteredCards(result);
  }, [selectedCategory, bazarCards]);

  const handleBazarClick = (bazarId, index) => {
    navigate(`?id=${bazarId}`);
    setActiveBazar(index);
    if (window.innerWidth <= 965) setShowList(false);
  };

  const selectedBazar = getSelectedItem(BazarCardsData, "Tourism", "Bazar", id);

  return (
    <>
      {id && selectedBazar ? (
        <TourismLandingPage listing={selectedBazar} />
      ) : (
        <section className="tr-Tourism-Cata-Pg-Sec">
          {/* LEFT SIDEBAR */}
          <div className={showList ? "tr-lft-sec tr-showList" : "tr-lft-sec"}>
            <h2 className="tr-sector" onClick={() => navigate(`/tourism`)}>
              Tourism
            </h2>

            {/* Filter Section */}
            <div className="tr-institute-hd-lst">
              <h2 className="tr-institute-hd"><FaFilter style={{ fontSize: '16px', marginRight: '8px' }} /> Categories</h2>
              <ul className="tr-institute-lst">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={selectedCategory === cat ? "active" : ""}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat} {cat !== "All" && cat !== "General" ? "Shops" : cat === "All" ? "" : "Bazars"}
                  </li>
                ))}
              </ul>
            </div>

            <div className="tr-institute-hd-lst" style={{ marginTop: '20px' }}>
              <h2 className="tr-institute-hd">Local Bazars</h2>
              <ul className="tr-institute-lst">
                {getMergedData(BazarList, "Tourism", "Bazar").map((bazar, i) => (
                  <li
                    key={bazar.id}
                    className={activeBazar === i ? "active" : ""}
                    onClick={() => handleBazarClick(bazar.id, i)}
                  >
                    {bazar.name}
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
              <h1 className="tr-tr-cata-pg-main-hd">Traditional Bazars of Kohat</h1>
              <p>
                Explore the vibrant markets, local handicrafts, and cultural shopping hubs.
              </p>
              <SearchBar SearchedInst={setFilteredCards} AllInst={bazarCards} />
            </div>

            <div className="tr-cata-card-cont">
              {filteredCards.length > 0 ? (
                filteredCards.map((bazar) => (
                  <div
                    className="tr-card tr-premium-card"
                    key={bazar.id}
                    onClick={() => handleBazarClick(bazar.id)}
                  >
                    <div className="tr-card-img-container">
                      <img src={bazar.img || bazar.bgImage} alt={bazar.name} />
                      <div className="tr-card-rating">
                        <FaStar className="tr-star-icon" />
                        <span>{bazar.rating || "4.8"}</span>
                        <small>({bazar.reviewsCount || "250"}+ reviews)</small>
                      </div>
                    </div>
                    <div className="tr-card-content">
                      <div className="tr-card-header">
                        <h3>{bazar.name}</h3>
                        <span className="tr-card-city"><FaMapMarkerAlt /> {bazar.commonInfo?.basicInfo?.city || "Kohat"}</span>
                      </div>

                      <div className="tr-card-details-grid">
                        <div className="tr-detail-item">
                          <FaClock />
                          <span>{bazar.commonInfo?.visitingInfo?.openingTime} - {bazar.commonInfo?.visitingInfo?.closingTime}</span>
                        </div>
                        <div className="tr-detail-item">
                          <FaTicketAlt />
                          <span>{bazar.commonInfo?.visitingInfo?.entryFee}</span>
                        </div>
                      </div>

                      <p className="tr-card-short-desc">
                        {bazar.commonInfo?.basicInfo?.shortIntroduction}
                      </p>
                      <button className="tr-explore-btn" onClick={(e) => {
                        e.stopPropagation();
                        handleBazarClick(bazar.id);
                      }}>Explore Full Data</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', width: '100%', padding: '50px', color: '#666' }}>
                  <h3>No items found in this category.</h3>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Bazar;
