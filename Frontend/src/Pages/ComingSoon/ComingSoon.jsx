import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ComingSoon.css";

const ComingSoon = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="cs-simple-container">
            <div className="cs-simple-content">
                {/* Left Section: Simple Text */}
                <div className="cs-simple-text">
                    <h1 className="cs-simple-title">Coming Soon</h1>
                    <p className="cs-simple-subtitle">
                        We are currently building this section for you. 
                        It will be ready very soon!
                    </p>
                    <button className="cs-simple-btn" onClick={() => navigate("/")}>
                        Go Back
                    </button>
                </div>

                {/* Right: Simple Visual with Two Layers */}
                <div className="cs-simple-visual">
                    <div className="cs-visual-layer cs-layer-1"></div>
                    <div className="cs-visual-layer cs-layer-2"></div>
                    <div className="cs-indicator cs-status-ind">Status: Building</div>
                    
                    <svg className="cs-simple-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        {/* Background Blob Layer */}
                        <path fill="#1f8e5c" d="M44.7,-76.4C58.1,-69.1,69.5,-57.4,76.6,-43.6C83.7,-29.8,86.5,-14.9,86.2,-0.2C85.8,14.6,82.4,29.2,74.7,42.1C67.1,55,55.1,66.1,41.2,73.6C27.3,81.1,13.7,85,0.1,84.9C-13.4,84.7,-26.8,80.5,-39.8,73.2C-52.7,65.8,-65.2,55.3,-72.9,42.4C-80.6,29.5,-83.5,14.2,-83.7,-1C-84,-16.2,-81.6,-31.4,-73.8,-44.1C-66,-56.9,-53,-67.2,-39.3,-74.1C-25.6,-81,-12.8,-84.5,1.1,-86.3C14.9,-88.2,29.9,-88.3,44.7,-76.4Z" transform="translate(100 100)" opacity="0.05" />
                        
                        {/* Primary Illustration */}
                        <path d="M40 160H160" stroke="#1f8e5c" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                        <path d="M70 160V60" stroke="#1f8e5c" strokeWidth="6" strokeLinecap="round" />
                        <path d="M70 70H140" stroke="#1f8e5c" strokeWidth="6" strokeLinecap="round" />
                        <path d="M130 70V100" stroke="#1f8e5c" strokeWidth="2" strokeLinecap="round" />
                        <rect x="115" y="100" width="30" height="30" rx="4" fill="#1f8e5c">
                            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 10" dur="2s" repeatCount="indefinite" additive="sum"/>
                        </rect>
                    </svg>
                    
                    <div className="cs-indicator cs-progress-ind">Progress: 90%</div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
