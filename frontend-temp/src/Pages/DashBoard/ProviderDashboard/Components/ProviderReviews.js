
import React from 'react';
import "../ProviderDashboard.css";
import { FaStar } from 'react-icons/fa';

const ProviderReviews = () => {
    return (
        <div className="dashboard-content-card">
            <div className="card-header">
                <h2>Customer Reviews</h2>
                <span>Overall Rating: 4.8 <FaStar color="gold" /></span>
            </div>
            <div className="reviews-list">
                <div className="review-item" style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                    <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>Ali Khan</strong>
                        <span>2 days ago</span>
                    </div>
                    <div style={{ color: 'gold', margin: '5px 0' }}>⭐⭐⭐⭐⭐</div>
                    <p>Great service and quality products. Highly recommended!</p>
                </div>
                <div className="review-item" style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                    <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>Sara Ahmed</strong>
                        <span>1 week ago</span>
                    </div>
                    <div style={{ color: 'gold', margin: '5px 0' }}>⭐⭐⭐⭐☆</div>
                    <p>Good experience, but delivery was slightly late.</p>
                </div>
            </div>
        </div>
    );
};

export default ProviderReviews;
