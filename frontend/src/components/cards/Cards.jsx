import { services } from "../../Store/WebServices";
import "./Cards.css";
import { useNavigate } from "react-router-dom";
// import { services } from "../../Store/Edu_store";
const Cards = () => {
  // We use Navigate to redirect to other page
  const navigate = useNavigate();
  return (

    <section className="services-section">
      <h2 className="services-title">
        <span className="bar"></span> SERVICES
      </h2>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={service.img} alt={service.title} className="service-img" />
            <div className="card-content">
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <button className="learn-btn" onClick={() => navigate((service.link) ? service.link : "*")}>Learn more...</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cards;
