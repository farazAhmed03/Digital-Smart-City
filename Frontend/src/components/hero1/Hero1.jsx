import React, { useEffect, useState } from "react";
import "./Hero1.css";
import { useNavigate } from "react-router-dom";

import heroImg1 from "../imgs/hero1.png";
import heroImg2 from "../imgs/hero2.svg";
import heroImg3 from "../imgs/slide2.png";
import aboutImg from "../imgs/slide3.png";

const Hero1 = () => {
  const navigate = useNavigate();
  const slides = [
    {
      img: heroImg1,
      subtitle: "ALL ESSENTIAL SERVICES",
      title: "One Smart Platform",
      btn: "Get Started",
    },
    {
      img: heroImg2,
      subtitle: "CONNECTING KOHAT DIGITALLY",
      title: "Empowering Every Citizen",
      btn: "Join Now",
    },
    {
      img: heroImg3,
      subtitle: "DISCOVER & GROW",
      title: "Your City, Your Future",
      btn: "Explore",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === current ? "active" : ""}`}
          >
            {/* 🔹 Blurred image background */}
            <div
              className="hero-bg"
              style={{ backgroundImage: `url(${slide.img})` }}
            ></div>

            {/* 🔹 Glass overlay */}
            <div className="hero-glass"></div>

            {/* 🔹 Text content */}
            <div className="hero-overlay">
              <div className="hero-content">
                <h3 className="hero-subtitle">{slide.subtitle}</h3>
                <h1 className="hero-title">{slide.title}</h1>
                <button 
                  className="hero-bttn" 
                  onClick={() => navigate("/user/register")}
                >
                  {slide.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== About Section ===== */}
      <div className="about-section">
        <div className="about-content animate-slide-left">
          <h2>
            <span className="barr"></span> ABOUT US
          </h2>
          <p>
            Digital Smart Cities Hub is the first Digital Service Hub of Khyber
            Pakhtunkhwa (KP). Starting from Kohat, our first project is Digital
            Kohat. Our journey begins here but our vision goes beyond one city.
            We aim to build a regional digital ecosystem that connects people,
            businesses, and services across Pakistan.
          </p>
        </div>

        <div className="about-image animate-slide-right">
          <img src={aboutImg} alt="About Digital Smart Cities" />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
