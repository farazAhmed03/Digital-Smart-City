
import React from 'react';
import "../ProviderDashboard.css";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ProviderSupport = () => {
    return (
        <div className="dashboard-content-card">
            <div className="card-header">
                <h2>Help & Support</h2>
            </div>
            <div className="support-content">
                <p>Facing issues with your profile? Contact our support team directly.</p>

                <div className="contact-methods" style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div className="method-card" style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', textAlign: 'center', minWidth: '200px' }}>
                        <FaWhatsapp size={40} color="#25D366" />
                        <h3>WhatsApp Success</h3>
                        <p>+92 300 0000000</p>
                        <button className="btn-secondary" style={{ marginTop: '10px' }}>Chat Now</button>
                    </div>

                    <div className="method-card" style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', textAlign: 'center', minWidth: '200px' }}>
                        <FaPhoneAlt size={40} color="#3498db" />
                        <h3>Call Support</h3>
                        <p>0922-555555</p>
                        <button className="btn-secondary" style={{ marginTop: '10px' }}>Call Now</button>
                    </div>

                    <div className="method-card" style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', textAlign: 'center', minWidth: '200px' }}>
                        <FaEnvelope size={40} color="#e74c3c" />
                        <h3>Email Us</h3>
                        <p>support@digitalkohat.com</p>
                        <button className="btn-secondary" style={{ marginTop: '10px' }}>Send Email</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderSupport;
