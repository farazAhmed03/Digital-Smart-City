
import React from 'react';
import "../ProviderDashboard.css";

const ProviderSubscription = () => {
    return (
        <div className="dashboard-content-card">
            <div className="card-header">
                <h2>Subscription Plan</h2>
            </div>
            <div className="subscription-details">
                <div className="plan-card active-plan">
                    <h3>Premium Business Listing</h3>
                    <h1 style={{ color: '#32b57e' }}>Rs. 2500 <small style={{ fontSize: '1rem', color: '#666' }}>/ year</small></h1>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                        <li>✅ Verified Badge</li>
                        <li>✅ Top Search Ranking</li>
                        <li>✅ 10 Product Photos</li>
                        <li>✅ Social Media Links</li>
                    </ul>
                    <button className="btn-primary" disabled>Current Plan</button>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>Renews on: 1st Jan 2027</p>
                </div>
            </div>
        </div>
    );
};

export default ProviderSubscription;
