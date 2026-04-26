import { useEffect } from "react";
import "./Aboutus.css";
import femaleImg from "../../components/imgs/female.jpg";
import maleImg from "../../components/imgs/male.jpg";

import {
  FaUsers,
  FaCity,
  FaClipboardCheck,
  FaLaptopCode,
  FaHandsHelping,
  FaShieldAlt,
  FaHospital,
  FaPlane,
  FaUtensils,
  FaGraduationCap,
  FaStore,
  FaUsersCog,
  FaCloud,
  FaDatabase,
  FaGlobe
} from "react-icons/fa";


import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

/* ✅ LOCAL IMAGES */
import aboutImg from "../../components/imgs/aboutimg.jpg";
import visionImg from "../../components/imgs/vision.jpg";
import missionImg from "../../components/imgs/mission.jpg";

export const Aboutus = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".fade-section").forEach(el =>
      observer.observe(el)
    );

    return () => observer.disconnect();
  }, []);

  const valuesData = [
    { icon: <FaUsers />, title: "Citizen-Centric", desc: "We prioritize citizens' needs, ensuring transparency and easy access to all services." },
    { icon: <FaCity />, title: "Smart City Governance", desc: "Our platform connects city departments and streamlines processes efficiently." },
    { icon: <FaClipboardCheck />, title: "Accountability", desc: "We monitor and evaluate services to ensure quality, transparency, and trust." },
    { icon: <FaLaptopCode />, title: "Technology Driven", desc: "We leverage technology to innovate and provide seamless digital experiences." },
    { icon: <FaHandsHelping />, title: "Collaboration", desc: "We empower citizens with real-time data and access to services." },
    { icon: <FaShieldAlt />, title: "Safety & Privacy", desc: "Our platform is secure, ensuring citizens' data privacy and safety." }
  ];

  const hubData = [
    { icon: <FaHospital />, label: "Health", className: "n1" },
    { icon: <FaUtensils />, label: "Food", className: "n2" },
    { icon: <FaPlane />, label: "Tourism", className: "n3" },
    { icon: <FaStore />, label: "Business", className: "n4" },
    { icon: <FaGraduationCap />, label: "Education", className: "n5" },
    { icon: <FaUsersCog />, label: "Team", className: "n6" }
  ];

  return (
    <div className="aboutus-section">
      <Navbar />

      {/* ================= ABOUT HERO ================= */}
      <section className="about-hero fade-section">
        <div className="zebra-lines"></div>

        {/* Scattered Floating Icons */}
        <div className="scattered-icons">
          <FaCity />
          <FaCloud />
          <FaDatabase />
          <FaGlobe />
          <FaLaptopCode />
          <FaHandsHelping />
          <FaShieldAlt />
        </div>

        <div className="about-hero-content">
          <div className="about-text">
            <h2>ABOUT US</h2>
            <p>
              We are the architects of Digital Smart Cities Hub, transforming cities into smart, connected ecosystems. Our platform centralizes all city services in one reliable digital hub.
            </p>
          </div>

          <div className="about-image">
            <img
              src={aboutImg}
              alt="About Us"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================= VISION ================= */}
      <div className="section vision-section fade-section">
        <div className="vision-blur-icons">
          <FaCity />
          <FaCloud />
          <FaDatabase />
          <FaGlobe />
          <FaLaptopCode />
        </div>
        <div className="section-text">
          <h2>VISION</h2>
          <p>
            We envision digitally connected cities where citizens enjoy seamless access to services, improved governance, and enhanced quality of life through innovation and technology.
          </p>
        </div>
        <div className="section-image">
          <img
            src={visionImg}
            alt="Vision"
            loading="lazy"
          />
        </div>
      </div>

      {/* ================= MISSION ================= */}
      <div className="section mission-section fade-section">
        <div className="mission-blur-icons">
          <FaCity />
          <FaCloud />
          <FaDatabase />
          <FaGlobe />
          <FaLaptopCode />
        </div>
        <div className="section-image">
          <img
            src={missionImg}
            alt="Mission"
            loading="lazy"
          />
        </div>
        <div className="section-text">
          <h2>MISSION</h2>
          <p>
            Our mission is to create a centralized Digital Information Gateway for each community. Through collaboration with governments, we collect, verify, and present all essential city data in one place.
          </p>
        </div>
      </div>
<h2 className="org-heading">
  <span className="org-line"></span>
  TEAM MEMBERS
</h2>

<div className="org-tree">

  {/* LEVEL 1 */}                                             
  <div className="org-node single">
    <div className="person-card">
      <div className="card-bar"></div>
      <img src={femaleImg} alt="Sahiba Akber" />
      <h4>Sahiba Akber</h4>
      <p>Founder</p>
    </div>
  </div>                                               

  {/* Horizontal line below Sahiba */}
  <div className="line-horizontal"></div>

  {/* LEVEL 2 - two members with vertical lines from horizontal */}
  <div className="org-node two">
    <div className="child-block">
      <div className="line-vertical"></div>
      <div className="person-card">
        <div className="card-bar"></div>
        <img src={maleImg} alt="Syed Bilal Ahmed" />
        <h4>Syed Bilal Ahmed</h4>
        <p>HR</p>
      </div>
    </div>
    <div className="child-block">
      <div className="line-vertical"></div>
      <div className="person-card">
        <div className="card-bar"></div>
        <img src={maleImg} alt="Saqlain Muzaffar" />
        <h4>Saqlain Muzaffar</h4>
        <p>Project Manager</p>
      </div>
    </div>
  </div>

  {/* Horizontal line below Level 2 */}
  <div className="line-horizontal"></div>

  {/* LEVEL 3 - two designers */}
  <div className="org-node two">
    <div className="child-block">
      <div className="line-vertical"></div>
      <div className="person-card">
        <div className="card-bar"></div>
        <img src={femaleImg} alt="Humna Nadeem" />
        <h4>Humna Nadeem</h4>
        <p>Graphic Designer</p>
      </div>
    </div>
    <div className="child-block">
      <div className="line-vertical"></div>
      <div className="person-card">
        <div className="card-bar"></div>
        <img src={femaleImg} alt="Abeera Bangash" />
        <h4>Abeera Bangash</h4>
        <p>Graphic Designer</p>
      </div>
    </div>
  </div>

  {/* Horizontal line below designers */}
  <div className="line-horizontal"></div>

  {/* LEVEL 4 - 4 frontend developers */}
 <div className="org-node four">
  {["Humna Nadeem", "Awais Anwar", "Syed Sahil Shah", "Syed Bilal Ahmed"].map((name, i) => (
    <div key={i} className="child-block">
      <div className="line-vertical tall"></div>
      <div className="person-card">
        <div className="card-bar"></div>
        <img
          src={name === "Humna Nadeem" ? femaleImg : maleImg}
          alt={name}
        />
        <h4>{name}</h4>
        <p>Frontend Developer</p>
      </div>
    </div>
  ))}
</div>

  {/* Horizontal line below frontend */}
  <div className="line-horizontal"></div>

  {/* LEVEL 5 - 4 backend developers */}
  <div className="org-node four">
    {["Awais Anwar", "Sadiq Shah", "Sahil Shah", "Saqlain"].map((name, i) => (
      <div key={i} className="child-block">
        <div className="line-vertical tall"></div>
        <div className="person-card">
          <div className="card-bar"></div>
          <img src={maleImg} alt={name} />
          <h4>{name}</h4>
          <p>Backend Developer</p>
        </div>
      </div>
    ))}
  </div>

  {/* Optional left vertical line next to entire tree */}
  <div className="line-vertical left-side"></div>

</div>
<br /><br /><br />
      {/* ================= VALUES ================= */}
      <div className="values-section fade-section">
        <h2>VALUES</h2>
        <div className="values-grid">
          {valuesData.map((value, index) => (
            <div className="value-card" key={index}>
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= HUB ================= */}
      <div className="hub-section fade-section">
        <h2>What We Deal With?</h2>
        <div className="hub-container">
          <div className="hub-center">
            <FaCity />
            <span>Digital Smart Cities Hub</span>
            <div className="hub-pulse"></div>
          </div>

          {hubData.map((hub, index) => (
            <HubNode
              key={index}
              icon={hub.icon}
              label={hub.label}
              className={hub.className}
            />
          ))}

          <span className="hub-line l1"></span>
          <span className="hub-line l2"></span>
          <span className="hub-line l3"></span>
          <span className="hub-line l4"></span>
          <span className="hub-line l5"></span>
          <span className="hub-line l6"></span>
        </div>
      </div>
<br /><br />

<br /><br /> <br />
      <Footer />
    </div>
  );
};

const HubNode = ({ icon, label, className }) => (
  <div className={`hub-node ${className}`}>
    {icon}
    <span>{label}</span>
  </div>
);