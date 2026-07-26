import React from "react";
import "./Hero2.css";

const Hero2 = () => {
  return (
    <section className="how-it-works">
      <h2 className="titlee">HOW IT WORKS</h2>

      <div className="roadmap">
        <svg
          className="road-svg"
          viewBox="0 0 1000 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,150 C150,50 350,250 500,150 C650,50 850,250 1000,150"
            stroke="#555"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
            className="road-path"
          />
          <path
            d="M0,150 C150,50 350,250 500,150 C650,50 850,250 1000,150"
            stroke="white"
            strokeWidth="6"
            strokeDasharray="20 20"
            fill="none"
            strokeLinecap="round"
            className="road-dash"
          />
        </svg>

        <div className="step step1">
          <div className="circle green">1</div>
          <h3>Sign up</h3>
          <p>Create your account for free.</p>
        </div>

        <div className="step step2">
          <div className="circle purple">2</div>
          <h3>Choose a Service</h3>
          <p>Schools, hospitals, or restaurants, etc.</p>
        </div>

        <div className="step step3">
          <div className="circle blue">3</div>
          <h3>Book</h3>
          <p>Book what you need in seconds.</p>
        </div>

        <div className="step step4">
          <div className="circle orange">4</div>
          <h3>Manage</h3>
          <p>Manage everything easily, all from one dashboard.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
