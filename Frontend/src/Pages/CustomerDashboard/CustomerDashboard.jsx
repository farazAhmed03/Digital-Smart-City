import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AppContext } from '../../Store/AppContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './CustomerDashboard.css';

export const CustomerDashboard = () => {
    const { customer, logout, loading } = useContext(AppContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading && !customer) {
            navigate('/customer/login');
        } else if (customer) {
            fetchOrders();
        }
    }, [customer, loading, navigate]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/business/orders/my-orders');
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleAction = async (orderId, actionType) => {
        try {
            let notes = undefined;

            if (actionType === 'Cancel') {
                const confirm = await Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to cancel this order.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#e74c3c',
                    confirmButtonText: 'Yes, cancel it!'
                });
                if (!confirm.isConfirmed) return;
            } else if (actionType === 'Edit') {
                const { value: newNotes } = await Swal.fire({
                    title: 'Edit Order Notes',
                    input: 'textarea',
                    inputLabel: 'Update delivery notes or location instructions',
                    inputPlaceholder: 'Type your message here...',
                    showCancelButton: true
                });
                if (newNotes == null) return;
                notes = newNotes;
            }

            const res = await axios.post('/business/orders/customer-update', {
                orderId,
                action: actionType,
                notes
            });

            if (res.data.success) {
                Swal.fire('Success!', res.data.message, 'success');
                fetchOrders(); // Refresh orders
            } else {
                Swal.fire('Error', res.data.message, 'error');
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to update order', 'error');
        }
    };

    const handleLeaveReview = async (orderId, businessId) => {
        const { value: formValues } = await Swal.fire({
            title: 'Leave a Review',
            html:
                `<div style="text-align: left;">` +
                `<p style="margin-bottom: 15px; text-align: center;">How was your experience?</p>` +
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
                    orderId,
                    rating: formValues.rating,
                    comment: formValues.comment
                });

                if (res.data.success) {
                    Swal.fire('Thank You!', 'Your review has been submitted successfully.', 'success');
                    fetchOrders();
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

    if (loading || fetching) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="cust-dashboard-container">
                <div className="cust-dashboard-header">
                    <h2>Welcome, {customer?.name}</h2>
                    <button className="cust-logout-btn" onClick={logout}>Logout</button>
                </div>

                <div className="cust-orders-section">
                    <h3>Your Orders</h3>
                    {orders.length === 0 ? (
                        <p className="no-orders-msg">You haven't placed any orders yet.</p>
                    ) : (
                        <div className="cust-orders-grid">
                            {orders.map(order => (
                                <div key={order._id} className="cust-order-card" style={{ borderTop: `4px solid ${getStatusColor(order.status)}` }}>
                                    <div className="cust-order-header">
                                        <span className="order-id">#{order._id.slice(-8)}</span>
                                        <span className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="cust-order-body">
                                        <p><strong>Business:</strong> {order.businessId?.businessName || 'Unknown'}</p>
                                        <p><strong>Items:</strong> {order.items.map(i => `${i.quantity}x ${i.productName}`).join(", ")}</p>
                                        <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
                                        <p><strong>Location:</strong> {order.location || 'Not provided'}</p>
                                        <p><strong>Notes:</strong> {order.notes || 'None'}</p>
                                        <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="cust-order-actions">
                                        {(order.status === 'Received' || order.status === 'Under Review') && (
                                            <>
                                                <button className="action-btn edit" onClick={() => handleAction(order._id, 'Edit')}>
                                                    Edit Notes
                                                </button>
                                                <button className="action-btn cancel" onClick={() => handleAction(order._id, 'Cancel')}>
                                                    Cancel Order
                                                </button>
                                            </>
                                        )}

                                        {order.status === 'Delivered' && !order.isReviewed && (
                                            <button className="action-btn review" onClick={() => handleLeaveReview(order._id, order.businessId?._id)}>
                                                ★ Leave Review
                                            </button>
                                        )}

                                        {order.status === 'Delivered' && order.isReviewed && (
                                            <span className="reviewed-badge">✓ Reviewed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};
