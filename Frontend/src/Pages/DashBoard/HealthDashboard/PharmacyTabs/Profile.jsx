import React, { useState, useRef } from "react";
import { updatePharmacyProfile } from "../../../../ApiCalls/HealthDashboardApiCall";
import { FiHome, FiInfo, FiPhone, FiMapPin, FiCheckCircle, FiUser, FiFileText, FiCamera } from "react-icons/fi";

const Profile = ({ data }) => {
    const fileInputRef = useRef(null);
    const [basicInfo, setBasicInfo] = useState(data.basicInfo || {
        serviceName: data.basicInfo?.serviceName || "",
        img: data.img || "",
        tagline: data.Desc || "",
        address: data.Address || "",
    });


    const [about, setAbout] = useState(data.about || {
        description: data.About || "",
        yearsOfService: "",
        ownerName: "",
        licenseNumber: ""
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(basicInfo.img);
    const [isSaving, setIsSaving] = useState(false);

    const handleBasicChange = (e) => {
        setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    };

    const handleAboutChange = (e) => {
        setAbout({ ...about, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append("basicInfo", JSON.stringify(basicInfo));
        formData.append("about", JSON.stringify(about));
        if (logoFile) {
            formData.append("img", logoFile);
        }

        updatePharmacyProfile(formData, () => setIsSaving(false));
    };

    return (
        <div className="hlth-ds-tab-content">
            <form onSubmit={handleSubmit}>
                <section className="hlth-ds-form-section animate-up">
                    <div className="section-header">
                        <FiHome className="section-icon" />
                        <h3>Basic Information</h3>
                    </div>

                    {/* Logo Upload Section */}
                    <div className="hlth-ds-logo-upload-container">
                        <div className="logo-preview-wrapper" onClick={() => fileInputRef.current.click()}>
                            {logoPreview ? (
                                <img src={logoPreview} alt="Pharmacy Logo" className="logo-preview-img" />
                            ) : (
                                <div className="logo-placeholder">
                                    <FiCamera />
                                    <span>Upload Logo</span>
                                </div>
                            )}
                            <div className="upload-overlay">
                                <FiCamera />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleLogoChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                        <div className="upload-info">
                            <h4>Pharmacy Logo</h4>
                            <p>JPG, PNG or GIF. Max size 2MB.</p>
                        </div>
                    </div>

                    <div className="hlth-ds-grid">
                        <div className="hlth-ds-input-group">
                            <label>Pharmacy Name</label>
                            <input name="serviceName" value={basicInfo.serviceName} onChange={handleBasicChange} required placeholder="e.g. City Care Pharmacy" />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label>Tagline</label>
                            <input name="tagline" value={basicInfo.tagline} onChange={handleBasicChange} placeholder="e.g. Your Health, Our Priority" />
                        </div>
                        <div className="hlth-ds-input-group hlth-ds-full-row">
                            <label><FiMapPin /> Full Address Details</label>
                            <textarea name="address" value={basicInfo.address} onChange={handleBasicChange} placeholder="Street address, building number, nearby landmarks..."></textarea>
                        </div>
                    </div>
                </section>

                <section className="hlth-ds-form-section animate-up" style={{ animationDelay: "0.1s" }}>
                    <div className="section-header">
                        <FiInfo className="section-icon" />
                        <h3>About Pharmacy</h3>
                    </div>
                    <div className="hlth-ds-grid">
                        <div className="hlth-ds-input-group hlth-ds-full-row">
                            <label>Professional Description</label>
                            <textarea name="description" value={about.description} onChange={handleAboutChange} placeholder="Describe your pharmacy, expertise, and facilities..."></textarea>
                        </div>
                        <div className="hlth-ds-input-group">
                            <label><FiCheckCircle /> Years of Service</label>
                            <input name="yearsOfService" value={about.yearsOfService} onChange={handleAboutChange} placeholder="e.g. 15 Years" />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label><FiUser /> Owner Name</label>
                            <input name="ownerName" value={basicInfo?.adminName} onChange={handleAboutChange} placeholder="Full legal name of owner" readOnly />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label><FiFileText /> License Number</label>
                            <input name="licenseNumber" value={about.licenseNumber} onChange={handleAboutChange} placeholder="e.g. PH-12345-KPK" />
                        </div>
                    </div>
                </section>

                <div className="hlth-ds-actions-bar animate-up" style={{ animationDelay: "0.2s" }}>
                    <button type="submit" className="hlth-ds-btn-save" disabled={isSaving}>
                        {isSaving ? "Saving Progress..." : "Save All Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
