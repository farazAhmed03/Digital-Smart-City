import React from "react";
import "./Whychooseus.css";
import { FaUsers, FaStopwatch, FaHeadset, FaShieldAlt } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="why-section" id="why">
      <div className="why-container">
        <h2 className="title">Why Choose Us</h2>
        <p className="why-text">
          Choosing the right platform matters, and we’re here to make your
          experience simple, reliable, and secure. With seamless access,
          trusted data protection, and dedicated support, we ensure every
          service you use feels effortless and connected.
        </p>

        <div className="why-cards">
          <div className="why-card">
            <FaUsers className="why-icon" />
            <h4>One Account for All Services</h4>
          </div>

          <div className="why-card">
            <FaStopwatch className="why-icon" />
            <h4>Fast & Easy Access</h4>
          </div>

          <div className="why-card">
            <FaHeadset className="why-icon" />
            <h4>24/7 Support</h4>
          </div>

          <div className="why-card">
            <FaShieldAlt className="why-icon" />
            <h4>Secure Data & Privacy</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
