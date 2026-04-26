import React, { useState, useRef } from "react";
import { updateSpecialistProfile } from "../../../../ApiCalls/HealthDashboardApiCall";
import { FiHome, FiCheckCircle, FiUser, FiPhone, FiMapPin, FiCamera, FiBriefcase } from "react-icons/fi";

const SpecialistProfile = ({ data }) => {
    const fileInputRef = useRef(null);
    const [basicInfo, setBasicInfo] = useState(data.basicInfo || {
        adminName: data.adminName || "",
        serviceName: data.basicInfo?.serviceName || "",
        img: data?.basicInfo?.img || "",
        verified: data.basicInfo?.verified || false,
        specialization: data.basicInfo?.specialization || "",
        experience: data.basicInfo?.experience || "",
        address: data.basicInfo?.address || "",
        phone: data.basicInfo?.phone || ""
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(basicInfo.img);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBasicInfo({ ...basicInfo, [name]: type === 'checkbox' ? checked : value });
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
        // Since the backend handles 'basicInfo' as a JSON string if sent via FormData
        formData.append("basicInfo", JSON.stringify({
            ...basicInfo,
            serviceName: basicInfo.adminName // keep sync
        }));
        if (logoFile) {
            formData.append("doctorLogo", logoFile); // Backend uses doctorLogo for specialists
        }

        updateSpecialistProfile(formData, () => setIsSaving(false));
    };

    return (
        <div className="hlth-ds-tab-content">
            <form onSubmit={handleSubmit}>
                <section className="hlth-ds-form-section animate-up">
                    <div className="section-header">
                        <FiHome className="section-icon" />
                        <h3>Doctor's Basic Info</h3>
                    </div>

                    <div className="hlth-ds-logo-upload-container">
                        <div className="logo-preview-wrapper" onClick={() => fileInputRef.current.click()}>
                            {logoPreview ? (
                                <img src={logoPreview} alt="Doctor" className="logo-preview-img" />
                            ) : (
                                <div className="logo-placeholder">
                                    <FiCamera />
                                    <span>Upload Photo</span>
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
                            <h4>Profile Picture</h4>
                            <p>Professional headshots recommended. Max 2MB.</p>
                        </div>
                    </div>

                    <div className="hlth-ds-grid">
                        <div className="hlth-ds-input-group">
                            <label><FiUser /> Full Name</label>
                            <input name="adminName" value={basicInfo.adminName} onChange={handleChange} required placeholder="Dr. John Doe" />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label><FiCheckCircle /> Verification Status</label>
                            <div className="hlth-ds-checkbox-wrapper">
                                <input type="checkbox" name="verified" checked={basicInfo.verified} onChange={handleChange} id="verified-chk" />
                                <label htmlFor="verified-chk">Show Verification Badge</label>
                            </div>
                        </div>
                        <div className="hlth-ds-input-group">
                            <label><FiBriefcase /> Specialization</label>
                            <input name="specialization" value={basicInfo.specialization} onChange={handleChange} placeholder="e.g. Cardiologist" />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label>Experience (Years)</label>
                            <input name="experience" value={basicInfo.experience} onChange={handleChange} placeholder="e.g. 15+" />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label><FiPhone /> Clinic Contact</label>
                            <input name="phone" value={basicInfo.phone} onChange={handleChange} placeholder="+92 XXX XXXXXXX" />
                        </div>
                        <div className="hlth-ds-input-group hlth-ds-full-row">
                            <label><FiMapPin /> Clinic Address</label>
                            <textarea name="address" value={basicInfo.address} onChange={handleChange} placeholder="Full address of your clinic/hospital..."></textarea>
                        </div>
                    </div>
                </section>

                <div className="hlth-ds-actions-bar animate-up" style={{ animationDelay: "0.2s" }}>
                    <button type="submit" className="hlth-ds-btn-save" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Profile Details"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SpecialistProfile;
