import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BusinessReviews.css";

const StarDisplay = ({ rating }) => {
    return (
        <div className="br-stars">
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className={s <= Math.round(rating) ? "br-star filled" : "br-star"}>★</span>
            ))}
            <span className="br-rating-num">({rating})</span>
        </div>
    );
};

export const BusinessReviews = () => {
    const [productReviews, setProductReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("/business/reviews/business-dashboard");
                if (res.data.success) {
                    setProductReviews(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load reviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const toggleExpand = (productName) => {
        setExpanded(prev => ({ ...prev, [productName]: !prev[productName] }));
    };

    if (loading) return <div className="br-loading">Loading reviews...</div>;

    if (productReviews.length === 0) {
        return (
            <div className="br-empty">
                <div className="br-empty-icon">⭐</div>
                <h3>No Reviews Yet</h3>
                <p>Customer reviews will appear here after orders are delivered and reviewed.</p>
            </div>
        );
    }

    return (
        <div className="br-container">
            <div className="br-header">
                <h2>Customer Reviews</h2>
                <p>All reviews grouped by product</p>
            </div>
            <div className="br-products-list">
                {productReviews.map((product, idx) => (
                    <div key={idx} className="br-product-card">
                        <div className="br-product-header" onClick={() => toggleExpand(product.productName)}>
                            <div className="br-product-info">
                                <h3 className="br-product-name">{product.productName}</h3>
                                <div className="br-product-meta">
                                    <StarDisplay rating={product.averageRating} />
                                    <span className="br-review-count">{product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}</span>
                                </div>
                            </div>
                            <button className="br-expand-btn">
                                {expanded[product.productName] ? "▲ Hide" : "▼ Show"} Reviews
                            </button>
                        </div>

                        {expanded[product.productName] && (
                            <div className="br-reviews-list">
                                {product.reviews.map((r, i) => (
                                    <div key={i} className="br-review-item">
                                        <div className="br-review-header">
                                            <div className="br-reviewer-avatar">
                                                {r.customerName?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <span className="br-reviewer-name">{r.customerName}</span>
                                                <span className="br-review-date">
                                                    {new Date(r.createdAt).toLocaleDateString("en-PK", {
                                                        year: "numeric", month: "short", day: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                            <StarDisplay rating={r.rating} />
                                        </div>
                                        {r.comment && <p className="br-review-comment">"{r.comment}"</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
