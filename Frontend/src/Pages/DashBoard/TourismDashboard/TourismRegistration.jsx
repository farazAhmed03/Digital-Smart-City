import React, { useState } from 'react';
import './TourismDashboard.css'; // Reusing premium styles
import { FiUser, FiBriefcase, FiCheck, FiMapPin, FiPhone, FiUpload, FiShield } from 'react-icons/fi';

const RegistrationStep = ({ step, currentStep, icon, label }) => {
    return (
        <div className={`tr-step ${currentStep >= step ? 'active' : ''}`}>
            <div className="tr-step-icon">{currentStep > step ? <FiCheck /> : icon}</div>
            <span>{label}</span>
        </div>
    );
};

export const TourismRegistration = () => {
    const [userType, setUserType] = useState('citizen'); // 'citizen' or 'provider'
    const [providerStep, setProviderStep] = useState(1);

    // Form States
    const [formData, setFormData] = useState({
        name: '', mobile: '', email: '', businessName: '', category: '', address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderCitizenForm = () => (
        <div className="tr-form-container">
            <h3>Create Citizen Account</h3>
            <p>Join Digital Kohat to save places and review businesses.</p>
            <form className="tr-form">
                <div className="tr-form-group">
                    <label>Full Name</label>
                    <input type="text" className="tr-input" placeholder="Enter your name" name="name" onChange={handleChange} />
                </div>
                <div className="tr-form-group">
                    <label>Mobile Number (OTP Verification)</label>
                    <input type="tel" className="tr-input" placeholder="03XX-XXXXXXX" name="mobile" onChange={handleChange} />
                </div>
                <div className="tr-form-group">
                    <label>Email (Optional)</label>
                    <input type="email" className="tr-input" placeholder="email@example.com" name="email" onChange={handleChange} />
                </div>
                <button type="button" className="tr-btn-primary full-width">Sign Up Free</button>
            </form>
        </div>
    );

    const renderProviderForm = () => {
        switch (providerStep) {
            case 1:
                return (
                    <div className="tr-form-slide">
                        <h3>Step 1: Account Details</h3>
                        <div className="tr-form-group">
                            <label>Owner Name</label>
                            <input type="text" className="tr-input" />
                        </div>
                        <div className="tr-form-group">
                            <label>Mobile Number</label>
                            <input type="tel" className="tr-input" />
                        </div>
                        <div className="tr-form-group">
                            <label>Password</label>
                            <input type="password" className="tr-input" />
                        </div>
                        <button className="tr-btn-primary" onClick={() => setProviderStep(2)}>Next: Business Details</button>
                    </div>
                );
            case 2:
                return (
                    <div className="tr-form-slide">
                        <h3>Step 2: Business Info</h3>
                        <div className="tr-form-group">
                            <label>Business Name</label>
                            <input type="text" className="tr-input" />
                        </div>
                        <div className="tr-form-group">
                            <label>Category</label>
                            <select className="tr-input">
                                <option>Tour Guide</option>
                                <option>Hotel / Guest House</option>
                                <option>Travel Agency</option>
                            </select>
                        </div>
                        <div className="tr-form-group">
                            <label>Address</label>
                            <textarea className="tr-input" rows="2"></textarea>
                        </div>
                        <div className="tr-buttons-row">
                            <button className="tr-btn-secondary" onClick={() => setProviderStep(1)}>Back</button>
                            <button className="tr-btn-primary" onClick={() => setProviderStep(3)}>Next: Documents</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="tr-form-slide">
                        <h3>Step 3: Trust & Verification</h3>
                        <p className="tr-info-text">Documents are kept private and used only for verification.</p>
                        <div className="tr-upload-box">
                            <FiUpload className="tr-upload-icon" />
                            <p>Upload Owner CNIC (Front/Back)</p>
                        </div>
                        <div className="tr-upload-box">
                            <FiUpload className="tr-upload-icon" />
                            <p>Upload License / Registration (If any)</p>
                        </div>
                        <div className="tr-buttons-row">
                            <button className="tr-btn-secondary" onClick={() => setProviderStep(2)}>Back</button>
                            <button className="tr-btn-primary" onClick={() => setProviderStep(4)}>Submit for Review</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="tr-success-slide">
                        <div className="tr-success-icon"><FiCheck /></div>
                        <h3>Application Submitted!</h3>
                        <p>Your profile is now live in <strong>Trial Mode</strong>.</p>
                        <p>Our team will verify your documents in the background.</p>
                        <button className="tr-btn-primary full-width">Go to Dashboard</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="tr-page-wrapper">
            <header className="td-header">
                <div className="td-header-title">
                    <h1>DSCH Registration</h1>
                </div>
            </header>

            <div className="tr-container">
                {/* Toggle Type */}
                <div className="tr-toggle-container">
                    <button
                        className={`tr-toggle-btn ${userType === 'citizen' ? 'active' : ''}`}
                        onClick={() => setUserType('citizen')}
                    >
                        <FiUser /> Citizen / Tourist
                    </button>
                    <button
                        className={`tr-toggle-btn ${userType === 'provider' ? 'active' : ''}`}
                        onClick={() => { setUserType('provider'); setProviderStep(1); }}
                    >
                        <FiBriefcase /> Service Provider
                    </button>
                </div>

                <div className="tr-content-box">
                    {userType === 'provider' && (
                        <div className="tr-stepper">
                            <RegistrationStep step={1} currentStep={providerStep} icon={<FiUser />} label="Account" />
                            <RegistrationStep step={2} currentStep={providerStep} icon={<FiBriefcase />} label="Business" />
                            <RegistrationStep step={3} currentStep={providerStep} icon={<FiShield />} label="Docs" />
                        </div>
                    )}

                    {userType === 'citizen' ? renderCitizenForm() : renderProviderForm()}
                </div>

                <div className="tr-feature-cards">
                    <div className="tr-feature-card">
                        <FiCheck className="feature-icon" />
                        <h4>Free to Start</h4>
                        <p>Both users and providers start for free.</p>
                    </div>
                    <div className="tr-feature-card">
                        <FiShield className="feature-icon" />
                        <h4>Trusted Platform</h4>
                        <p>Verified businesses for safety.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
