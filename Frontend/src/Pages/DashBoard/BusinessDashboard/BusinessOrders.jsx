import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const BusinessOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/business/orders/get-orders', { withCredentials: true });
            if (res.data.success) setOrders(res.data.orders);
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await axios.put(`/business/orders/update-status/${id}`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success("Order status updated");
                fetchOrders();
            }
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Received': return '#7f8c8d'; // Gray
            case 'Under Review': return '#3498db'; // Blue
            case 'Pending': return '#f39c12'; // Orange
            case 'Approved': return '#2ecc71'; // Green
            case 'On The Way': return '#5DADE2'; // Light Blue
            case 'Delivered': return '#1e8449'; // Dark Green
            case 'Rejected': return '#e74c3c'; // Red
            case 'Canceled': return '#922b21'; // Dark Red
            case 'Suspended': return '#f1c40f'; // Yellow
            default: return '#95a5a6';
        }
    };

    const getAvailableActions = (status) => {
        switch (status) {
            case 'Received': return ['Under Review', 'Approved', 'Rejected'];
            case 'Under Review': return ['Approved', 'Pending', 'Rejected'];
            case 'Pending': return ['Approved', 'Rejected', 'Canceled'];
            case 'Approved': return ['On The Way', 'Suspended', 'Canceled'];
            case 'On The Way': return ['Delivered', 'Suspended', 'Canceled'];
            case 'Suspended': return ['Under Review', 'Canceled'];
            case 'Delivered':
            case 'Rejected':
            case 'Canceled':
                return []; // Terminal states
            default: return [];
        }
    };

    if (loading) return <div>Loading Orders...</div>;

    return (
        <div className="fd-card">
            <h2 className="fd-section-title">Order Management</h2>
            <div className="fd-orders-list">
                {orders.map(o => (
                    <div className="fd-order-card" key={o._id} style={{ borderLeft: `5px solid ${getStatusColor(o.status)}` }}>
                        <div className="fd-order-header">
                            <h4>Order #{o._id.slice(-6)}</h4>
                            <span className="fd-status-pill" style={{ backgroundColor: getStatusColor(o.status), color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '0.85rem' }}>
                                {o.status}
                            </span>
                        </div>
                        <div className="fd-order-body">
                            <p><strong>Customer:</strong> {o.customerName}</p>
                            <p><strong>Phone:</strong> {o.customerPhone}</p>
                            <p><strong>Location:</strong> {o.location || "N/A"}</p>
                            <p><strong>Notes:</strong> {o.notes || "None"}</p>
                            <p><strong>Items:</strong> {o.items.map(i => `${i.quantity}x ${i.productName}`).join(", ")}</p>
                            <p className="fd-total-price">Total: Rs. {o.totalAmount}</p>

                            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <strong style={{ fontSize: '0.9rem', color: '#555' }}>Status History:</strong>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: '5px 0 0 0', fontSize: '0.8rem', color: '#777' }}>
                                    {o.statusHistory && o.statusHistory.map((historyItem, idx) => (
                                        <li key={idx} style={{ marginBottom: '3px' }}>
                                            → <strong>{historyItem.status}</strong>
                                            <span style={{ fontSize: '0.75rem', marginLeft: '5px' }}>
                                                ({new Date(historyItem.changedAt).toLocaleString()}) - by {historyItem.changedBy}
                                            </span>
                                        </li>
                                    ))}
                                    {(!o.statusHistory || o.statusHistory.length === 0) && <li>No history available</li>}
                                </ul>
                            </div>

                            {/* Review Display Section */}
                            {o.review && (
                                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#eafaf1', borderLeft: '4px solid #2ecc71', borderRadius: '4px' }}>
                                    <h5 style={{ margin: '0 0 5px 0', color: '#27ae60', fontSize: '1rem' }}>
                                        ★ Customer Review ({o.review.rating}/5)
                                    </h5>
                                    {o.review.comment && (
                                        <p style={{ margin: '0 0 5px 0', fontStyle: 'italic', color: '#555', fontSize: '0.9rem' }}>
                                            "{o.review.comment}"
                                        </p>
                                    )}
                                    <small style={{ color: '#888', fontSize: '0.75rem' }}>
                                        Left on {new Date(o.review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                            )}

                        </div>
                        <div className="fd-order-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                            {getAvailableActions(o.status).map(action => (
                                <button
                                    key={action}
                                    onClick={() => updateStatus(o._id, action)}
                                    style={{
                                        padding: '6px 12px',
                                        border: `1px solid ${getStatusColor(action)}`,
                                        backgroundColor: 'white',
                                        color: getStatusColor(action),
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = getStatusColor(action);
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.color = getStatusColor(action);
                                    }}
                                >
                                    Mark as {action}
                                </button>
                            ))}
                            {getAvailableActions(o.status).length === 0 && (
                                <span style={{ color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>No further actions available</span>
                            )}
                        </div>
                    </div>
                ))}
                {orders.length === 0 && <p>No orders found.</p>}
            </div>
        </div>
    );
};
