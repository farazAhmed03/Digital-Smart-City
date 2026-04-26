import { useEffect, useState } from "react";
import "./TourismHome.css";
import { useNavigate } from "react-router-dom";
import { tourismCategories } from "../../../Store/Tourism_store";
import { SignUpForm } from "../../../components/SignUpForm/SignUpForm";

export const TourismHome = () => {
  const navigate = useNavigate();
  const [showForm, setShowform] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const userListings = JSON.parse(localStorage.getItem("tourismListings")) || [];

    
    setAllCategories([...tourismCategories, ...userListings]);
  }, [showForm]);

  const handleCardClick = (category) => {
    //direct access
    navigate(category.link || `/tourism/${category.id}`, {
      state: { category },
    });
  };

  return (
    <>
      {/* {showForm ? (
        <SignUpForm setShowform={setShowform} />
      ) : ( */}
      <section className="tourism-home">
        {/* Registration Buttons - Commented for direct access
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
            <button
              className="tourism-register-btn"
              onClick={() => {
                setShowform(true);
              }}
            >
              Registration
            </button>
          </div>
          */}

        <div className="tourism-content">
          <h1>
            Let's Explore Best Tourism In <strong>Kohat</strong>
          </h1>
          <p className="tourism-description">
            Discover beautiful places, historical sites, hotels, restaurants, and parks in Kohat.
          </p>

          <div className="tourism-card-grid">
            {allCategories.map((v, i) => (
              <div
                className="tourism-card"
                key={i}
                onClick={() => handleCardClick(v)}
                style={{
                  backgroundImage: `url(${v.bgImage || v.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="tourism-card-overlay"></div>



                <h2 className="tourism-card-title">{v.title}</h2>
                <p className="tourism-card-desc">{v.description}</p>
                <button className="tourism-card-btn">{v.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* )} */}
    </>
  );
};
