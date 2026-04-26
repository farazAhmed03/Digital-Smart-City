import React, { useState } from "react";
import { deleteHealthReview } from "../../../../ApiCalls/HealthDashboardApiCall";
import { Star, Trash2, MessageSquare, User } from "lucide-react";

const ManageReviews = ({ data }) => {
    const [reviews, setReviews] = useState(data.Reviews || []);

    const handleDelete = (id) => {
        if(window.confirm("Permanently delete this review?")) {
            deleteHealthReview(id, setReviews);
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <Star className="header-icon" color="#fbbf24" fill="#fbbf24" />
                    <h3>Customer & Patient Feedback</h3>
                </div>
            </div>

            <div className="hlth-ds-reviews-list animate-fade">
                {reviews.length > 0 ? reviews.slice().reverse().map(rev => (
                    <div key={rev._id} className="hlth-ds-review-card">
                        <div className="hlth-ds-review-header">
                            <div className="rev-user-info">
                                <div className="user-avatar" style={{ background: 'var(--hlth-primary-color)', color: 'white' }}>
                                    <User size={16} />
                                </div>
                                <div className="user-meta">
                                    <strong>{rev.user || "Anonymous User"}</strong>
                                    <span className="hlth-ds-date">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently"}</span>
                                </div>
                            </div>
                            <div className="rev-rating" style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < (rev.rating || 5) ? "#fbbf24" : "none"} stroke="#fbbf24" />
                                ))}
                            </div>
                        </div>
                        <div className="hlth-ds-comment-body">
                            <MessageSquare className="quote-icon" size={16} color="var(--hlth-primary-color)" />
                            <p>"{rev.comment}"</p>
                        </div>
                        <div className="hlth-ds-review-actions">
                            <button onClick={() => handleDelete(rev._id)} className="hlth-ds-action-btn delete" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <Trash2 size={14} /> Remove Review
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="hlth-ds-empty hlth-ds-full-row">
                        <Star size={48} style={{ opacity: 0.1, marginBottom: "1rem" }} />
                        <p>No reviews yet. Feedback will appear here as users rate your pharmacy.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageReviews;
