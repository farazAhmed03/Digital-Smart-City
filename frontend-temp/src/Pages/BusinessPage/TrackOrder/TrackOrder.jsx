import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './TrackOrder.css';

export const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) {
            setError('Please enter a valid Order ID');
            return;
        }

        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const res = await axios.get(`/business/reviews/track/${orderId.trim()}`);
            if (res.data.success) {
                setOrderData(res.data.data);
            } else {
                setError(res.data.message || 'Order not found.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Could not find an order with that ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveReview = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Leave a Review',
            html:
                `<div style="text-align: left;">` +
                `<p style="margin-bottom: 15px; text-align: center;">How was your experience with <strong>${orderData.businessId?.businessName || 'this business'}</strong>?</p>` +
                `<label style="font-size: 0.9em; font-weight: bold; margin-bottom: 5px; display: block;">Rating (1 to 5 Stars) *</label>` +
                `<input id="swal-rating" class="swal2-input" type="number" min="1" max="5" placeholder="e.g. 5" style="margin: 0 auto 15px auto; width: 90%;">` +
                `<label style="font-size: 0.9em; font-weight: bold; margin-bottom: 5px; display: block;">Comment (Optional)</label>` +
                `<textarea id="swal-comment" class="swal2-textarea" placeholder="Tell us about the product and delivery..." style="margin: 0 auto; width: 90%;"></textarea>` +
                `</div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Submit Review',
            confirmButtonColor: '#32b57e',
            preConfirm: () => {
                const ratingStr = document.getElementById('swal-rating').value;
                const comment = document.getElementById('swal-comment').value.trim();

                const rating = parseInt(ratingStr, 10);
                if (isNaN(rating) || rating < 1 || rating > 5) {
                    Swal.showValidationMessage('Please provide a valid rating between 1 and 5');
                    return false;
                }

                return { rating, comment };
            }
        });

        if (formValues) {
            try {
                const res = await axios.post('/business/reviews/add', {
                    orderId: orderData._id,
                    rating: formValues.rating,
                    comment: formValues.comment
                });

                if (res.data.success) {
                    Swal.fire('Thank You!', 'Your review has been submitted successfully.', 'success');
                    // Update local state to hide the review button
                    setOrderData({ ...orderData, isReviewed: true });
                } else {
                    Swal.fire('Error', res.data.message, 'error');
                }
            } catch (err) {
                Swal.fire('Error', err.response?.data?.message || 'Failed to submit review.', 'error');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Received': return '#7f8c8d';
            case 'Under Review': return '#3498db';
            case 'Pending': return '#f39c12';
            case 'Approved': return '#2ecc71';
            case 'On The Way': return '#5DADE2';
            case 'Delivered': return '#1e8449';
            case 'Rejected': return '#e74c3c';
            case 'Canceled': return '#922b21';
            case 'Suspended': return '#f1c40f';
            default: return '#95a5a6';
        }
    };

    return (
        <div className="track-order-container">
            <div className="track-order-box">
                <h2>Track Your Order</h2>
                <p>Enter your tracking ID to view the live status of your order.</p>

                <form onSubmit={handleTrack} className="track-form">
                    <input
                        type="text"
                        placeholder="Enter Order ID (e.g. 64a7f...)"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="track-input"
                    />
                    <button type="submit" className="track-btn" disabled={loading}>
                        {loading ? 'Searching...' : 'Track Order'}
                    </button>
                </form>

                {error && <div className="track-error">{error}</div>}

                {orderData && (
                    <div className="track-result">
                        <div className="track-header" style={{ borderBottom: `3px solid ${getStatusColor(orderData.status)}` }}>
                            <h3>Order #{orderData._id.slice(-6)}</h3>
                            <span className="track-status-pill" style={{ backgroundColor: getStatusColor(orderData.status) }}>
                                {orderData.status}
                            </span>
                        </div>

                        <div className="track-details">
                            <p><strong>Business:</strong> {orderData.businessId?.businessName || 'Unknown'}</p>
                            <p><strong>Items:</strong> {orderData.items.map(i => `${i.quantity}x ${i.productName}`).join(", ")}</p>
                            <p><strong>Total Amount:</strong> Rs. {orderData.totalAmount}</p>
                            <p><strong>Placed On:</strong> {new Date(orderData.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="track-history">
                            <h4>Status Timeline</h4>
                            <ul>
                                {orderData.statusHistory && orderData.statusHistory.map((h, idx) => (
                                    <li key={idx}>
                                        <span className="history-dot" style={{ backgroundColor: getStatusColor(h.status) }}></span>
                                        <strong>{h.status}</strong> - {new Date(h.changedAt).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {orderData.status === 'Delivered' && !orderData.isReviewed && (
                            <div className="track-review-section">
                                <h3>Order Delivered!</h3>
                                <p>We hope you enjoy your purchase. Please take a moment to leave a review for the business.</p>
                                <button onClick={handleLeaveReview} className="track-review-btn">
                                    ★ Leave a Review
                                </button>
                            </div>
                        )}

                        {orderData.status === 'Delivered' && orderData.isReviewed && (
                            <div className="track-review-section success">
                                <h3>Thank you!</h3>
                                <p>You have successfully reviewed this order.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
