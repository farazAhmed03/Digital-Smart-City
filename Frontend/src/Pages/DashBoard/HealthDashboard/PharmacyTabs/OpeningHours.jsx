import React, { useState } from "react";
import { updateSpecialistTimings } from "../../../../ApiCalls/HealthDashboardApiCall";
import { Clock, Save, Info, CheckCircle2 } from "lucide-react";

const OpeningHours = ({ data }) => {
    const [timings, setTimings] = useState(data.Timings || {
        monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: ""
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setTimings({ ...timings, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        updateSpecialistTimings(timings, (updated) => {
            setTimings(updated);
            setIsSaving(false);
        });
    };

    const days = [
        "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
    ];

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <Clock className="header-icon" />
                    <h3>Service Hours & Availability</h3>
                </div>
            </div>

            <section className="hlth-ds-form-section animate-up">
                <div className="section-header" style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', padding: '1rem', marginBottom: '2rem' }}>
                    <Info size={20} color="#16a34a" />
                    <p style={{ color: '#166534', fontWeight: 500, margin: 0 }}>Define your pharmacy's operational hours for each day. Use "Closed" for holidays.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="hlth-ds-timing-grid animate-fade">
                        {days.map(day => (
                            <div key={day} className="hlth-ds-timing-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <label style={{ fontWeight: 700, textTransform: 'capitalize' }}>{day}</label>
                                <input
                                    name={day}
                                    value={timings[day] || ""}
                                    onChange={handleChange}
                                    placeholder="e.g. 8:00 AM - 10:00 PM"
                                    className="hlth-ds-input"
                                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="hlth-ds-actions-bar no-border" style={{ marginTop: "2rem", borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                        <button type="submit" className="hlth-ds-btn-save" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 2rem' }}>
                            {isSaving ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Save size={18} /> Update Opening Hours
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default OpeningHours;
