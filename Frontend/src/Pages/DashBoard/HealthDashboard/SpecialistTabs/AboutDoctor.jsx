import { useState } from "react";
import { updateSpecialistProfile } from "../../../../ApiCalls/HealthDashboardApiCall";
import { FiAward, FiCheckCircle, FiInfo } from "react-icons/fi";

const AboutDoctor = ({ data }) => {
    const [about, setAbout] = useState(data.about || {
        description: "",
        qualifications: "",
        yearsOfExperience: "",
        awards: []
    });

    const [isSaving, setIsSaving] = useState(false);
    const [newAward, setNewAward] = useState("");

    const handleChange = (e) => {
        setAbout({ ...about, [e.target.name]: e.target.value });
    };

    const addAward = () => {
        if (newAward.trim()) {
            setAbout({ ...about, awards: [...about.awards, newAward.trim()] });
            setNewAward("");
        }
    };

    const removeAward = (index) => {
        const updatedAwards = about.awards.filter((_, i) => i !== index);
        setAbout({ ...about, awards: updatedAwards });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        updateSpecialistProfile({ about }, () => setIsSaving(false));
    };

    return (
        <div className="hlth-ds-tab-content">
            <form onSubmit={handleSubmit}>
                <section className="hlth-ds-form-section animate-up">
                    <div className="section-header">
                        <FiInfo className="section-icon" />
                        <h3>Professional Bio</h3>
                    </div>
                    <div className="hlth-ds-input-group hlth-ds-full-row">
                        <label>Description / Detailed Bio</label>
                        <textarea
                            name="description"
                            value={about.description}
                            onChange={handleChange}
                            placeholder="Describe your medical journey, philosophy, and expertise..."
                            rows="6"
                        ></textarea>
                    </div>
                </section>

                <section className="hlth-ds-form-section animate-up" style={{ animationDelay: "0.1s" }}>
                    <div className="section-header">
                        <FiCheckCircle className="section-icon" />
                        <h3>Experience & Qualifications</h3>
                    </div>
                    <div className="hlth-ds-grid">
                        <div className="hlth-ds-input-group">
                            <label>Years of Practice</label>
                            <input name="yearsOfExperience" value={about.yearsOfExperience} onChange={handleChange} placeholder="e.g. 12 Years" />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label>Primary Qualification</label>
                            <input name="qualifications" value={about.qualifications} onChange={handleChange} placeholder="e.g. MBBS, FCPS Cardiology" />
                        </div>
                    </div>
                </section>

                <section className="hlth-ds-form-section animate-up" style={{ animationDelay: "0.2s" }}>
                    <div className="section-header">
                        <FiAward className="section-icon" />
                        <h3>Awards & Achievements</h3>
                    </div>
                    <div className="hlth-ds-input-group hlth-ds-full-row">
                        <div className="hlth-ds-search-bar" style={{ width: "100%", marginBottom: "15px" }}>
                            <input
                                type="text"
                                placeholder="Add a new award or certification..."
                                value={newAward}
                                onChange={(e) => setNewAward(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAward())}
                            />
                            <button type="button" onClick={addAward} className="hlth-ds-btn-add" style={{ padding: "8px 15px" }}>Add</button>
                        </div>
                        <div className="hlth-ds-awards-list">
                            {about.awards.map((award, index) => (
                                <div key={index} className="hlth-ds-award-tag">
                                    <span>{award}</span>
                                    <button type="button" onClick={() => removeAward(index)}>&times;</button>
                                </div>
                            ))}
                            {about.awards.length === 0 && <p className="hlth-ds-empty-small">No awards added yet.</p>}
                        </div>
                    </div>
                </section>

                <div className="hlth-ds-actions-bar animate-up" style={{ animationDelay: "0.3s" }}>
                    <button type="submit" className="hlth-ds-btn-save" disabled={isSaving}>
                        {isSaving ? "Saving Details..." : "Save Bio & About"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutDoctor;
