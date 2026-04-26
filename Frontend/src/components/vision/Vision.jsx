import React from "react";
import "./Vision.css";
import { FaLightbulb, FaFlagCheckered } from "react-icons/fa";

const Vision = () => {
  return (
    <section className="dkv-vision-section dkv-column-layout">
      
      {/* ===== VISION ===== */}
      <div className="dkv-vm-block dkv-animate-slide-left dkv-equal-block">
        <div className="dkv-vm-icon">
          <FaLightbulb />
        </div>
        <div className="dkv-vm-text">
          <h2>
            <span className="dkv-vm-bar"></span> OUR VISION
          </h2>
          <p>
            To become the leading digital gateway that connects communities
            with essential public services—simple, fast, and accessible for
            everyone.
          </p>
        </div>
      </div>

      <div className="dkv-vm-separator"></div>

      {/* ===== MISSION ===== */}
      <div className="dkv-vm-block dkv-animate-slide-right dkv-equal-block">
        <div className="dkv-vm-icon">
          <FaFlagCheckered />
        </div>
        <div className="dkv-vm-text">
          <h2>
            <span className="dkv-vm-bar"></span> OUR MISSION
          </h2>
          <p>
            Our mission is to build a centralized Digital Information Gateway
            for every community we serve. Through close collaboration with
            local governments, we collect, verify, and present essential city
            data in one place—removing the frustration of multiple systems.
            We empower governments with smart management tools and citizens
            with fast, simple access to public services, while continuously
            innovating to enhance their digital experience.
          </p>
        </div>
      </div>

    </section>
  );
};

export default Vision;