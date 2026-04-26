
import React from 'react';
import "../ProviderDashboard.css"; // Reuse dashboard styles

const ProviderServices = () => {
    return (
        <div className="dashboard-content-card">
            <div className="card-header">
                <h2>Services & Offers</h2>
                <button className="btn-primary">Add New Service</button>
            </div>
            <div className="services-list">
                <div className="service-item">
                    <h4>Home Delivery</h4>
                    <p>Free home delivery on orders above 2000 PKR.</p>
                    <span className="status-badge active">Active</span>
                </div>
                <div className="service-item">
                    <h4>Discount Sale</h4>
                    <p>Flat 20% off on all summer collection.</p>
                    <span className="status-badge active">Active</span>
                </div>
                <div className="empty-state-message">
                    <p>You can add more services or promotional offers here.</p>
                </div>
            </div>
        </div>
    );
};

export default ProviderServices;
