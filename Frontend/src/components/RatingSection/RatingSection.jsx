import { FaStar, FaUserCircle } from "react-icons/fa";
import "./RatingSection.css";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { ChangeRatingData } from "../../ApiCalls/ApiCalls";
import { AppContext } from "../../Store/AppContext";

export const RatingSection = ({ ratingData: initialRatingData, reviews: initialReviews, id, cata }) => {
    const { userData } = useContext(AppContext);
    const [selectedRating, setSelectedRating] = useState(0);
    const [comment, setComment] = useState("");
    const [name, setName] = useState(userData?.fullName || "");
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [ratingData, setRatingData] = useState(initialRatingData);
    const [reviews, setReviews] = useState(initialReviews || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate star breakdown statistics
    const stats = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews?.filter(r => Math.round(r.rating) === stars).length || 0;
        const percentage = reviews?.length > 0 ? (count / reviews.length) * 100 : 0;
        return { stars, count, percentage };
    });

    const handleRating = (star) => setSelectedRating(star);

    const calculateRating = () => {
        if (!selectedRating) return toast.warning("Select at least one star!");
        if (isSubmitting) return;

        setIsSubmitting(true);
        ChangeRatingData(
            { rating: selectedRating, name, comment, id, coll: cata },
            id,
            (newRatingData, newReviews) => {
                setRatingSubmitted(true);
                setRatingData(newRatingData);
                setReviews(newReviews);
                setIsSubmitting(false);
                toast.success("Review submitted! Thank you. ✅");
            },
            cata
        );
    };

    const renderStars = (avg, size = 18) => {
        const fullStars = Math.floor(avg);
        const halfStar = avg - fullStars >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <div className="starsDisplayWrapper">
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} color="#FFB800" size={size} />
                ))}
                {[...Array(halfStar)].map((_, i) => (
                    <FaStar
                        key={`half-${i}`}
                        color="#FFB800"
                        size={size}
                        style={{ clipPath: "inset(0 50% 0 0)" }}
                    />
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaStar key={`empty-${i}`} color="#E2E8F0" size={size} />
                ))}
            </div>
        );
    };

    return (
        <section className="rating-section-modern">
            <div className="rating-dashboard-container">
                
                {/* 1. SUMMARY CARD */}
                <div className="rating-summary-card">
                    <h2 className="dashboard-title">Customer Reviews</h2>
                    <div className="summary-main-metrics">
                        <div className="avg-display-box">
                            <span className="big-avg-num">{Number(ratingData?.average || 0).toFixed(1)}</span>
                            {renderStars(ratingData?.average || 0, 24)}
                            <span className="total-count-label">{ratingData?.totalReviews || 0} reviews</span>
                        </div>
                        <div className="star-breakdown-bars">
                            {stats.map(s => (
                                <div key={s.stars} className="breakdown-row">
                                    <span className="row-star-label">{s.stars} stars</span>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: `${s.percentage}%` }}></div>
                                    </div>
                                    <span className="row-count-val">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. FORM CARD */}
                <div className="rating-form-card">
                    {!ratingSubmitted ? (
                        <>
                            <h3 className="form-title">Write a Review</h3>
                            <div className="interactive-stars-selection">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={selectedRating >= star ? "star-btn active" : "star-btn"}
                                        onClick={() => handleRating(star)}
                                        size={32}
                                    />
                                ))}
                            </div>
                            <div className="form-inputs-group">
                                <input 
                                    type="text" 
                                    className="modern-input" 
                                    placeholder="Your Name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <textarea 
                                    className="modern-textarea" 
                                    placeholder="How was your experience? (Optional)"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="3"
                                ></textarea>
                                <button 
                                    className="modern-submit-btn" 
                                    onClick={calculateRating}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Posting..." : "Post Review"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="success-lottie-placeholder">
                            <div className="check-icon-circle">✓</div>
                            <h4>Thank you for your feedback!</h4>
                            <p>Your review helps others make better decisions.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. REVIEWS FEED */}
            <div className="reviews-feed-container">
                <div className="feed-header">
                    <h3 className="feed-title">All Reviews</h3>
                    <div className="feed-sort-indicator">Showing latest first</div>
                </div>
                
                {reviews && reviews.length > 0 ? (
                    <div className="reviews-grid">
                        {reviews.slice().reverse().map((rev, index) => (
                            <div key={index} className="modern-review-card">
                                <div className="rev-card-top">
                                    <div className="rev-user-id">
                                        <FaUserCircle className="user-icon" size={40} />
                                        <div className="user-name-meta">
                                            <span className="user-displayName">{rev.name}</span>
                                            <span className="user-date-label">
                                                {rev.date ? new Date(rev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Guest'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rev-stars-box">
                                        {renderStars(rev.rating, 14)}
                                    </div>
                                </div>
                                <p className="rev-text-body">{rev.comment || "No written feedback provided."}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-feed-state">
                        <h4>Be the first to review!</h4>
                        <p>No detailed reviews yet. Share your experience to help the community.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
;