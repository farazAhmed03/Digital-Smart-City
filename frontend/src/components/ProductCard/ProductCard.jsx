import React, { useContext } from 'react';
import './ProductCard.css';
import { FaShoppingCart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AppContext } from "../../Store/AppContext";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product, reviews = [] }) => {
    const { customer } = useContext(AppContext);
    const navigate = useNavigate();

    // Calculate average rating for this product
    const avgRating = reviews.length
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map(s => (
            <span key={s} style={{ color: s <= Math.round(rating) ? '#f5a623' : '#ddd', fontSize: '0.9rem' }}>&#9733;</span>
        ));
    };

    const showReviewsModal = (e) => {
        e.stopPropagation();
        if (reviews.length === 0) return;
        const starsHtml = (rating) => [1, 2, 3, 4, 5].map(s => `<span style="color:${s <= rating ? '#f5a623' : '#ddd'}">★</span>`).join('');
        const reviewsHtml = reviews.map(r => `
            <div style="border-bottom:1px solid #eee;padding:12px 0;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
                    <span style="font-weight:600;">${r.customerName}</span>
                    <span>${starsHtml(r.rating)}</span>
                </div>
                ${r.comment ? `<p style="color:#555;font-style:italic;margin:0;">"${r.comment}"</p>` : ''}
            </div>
        `).join('');
        Swal.fire({
            title: `Reviews for ${product.title}`,
            html: `<div style="text-align:left;max-height:300px;overflow-y:auto;">${reviewsHtml}</div>`,
            confirmButtonColor: '#32b57e',
            confirmButtonText: 'Close'
        });
    };

    const handleOrder = async () => {
        if (!customer) {
            Swal.fire({
                title: 'Login Required',
                text: 'You must be logged in to place an order.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Login',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/customer/login');
                }
            });
            return;
        }

        if (!product.businessId) {
            return Swal.fire('Error', 'Cannot place order: missing business identifier.', 'error');
        }

        const { value: formValues } = await Swal.fire({
            title: 'Place Order',
            html:
                `<div style="text-align: left;">` +
                `<p style="margin-bottom: 15px; text-align: center;">Order: <strong>${product.title}</strong></p>` +
                `<label style="font-size: 0.9em; font-weight: bold; margin-bottom: 5px; display: block;">Your Name *</label>` +
                `<input id="swal-input1" class="swal2-input" placeholder="e.g. Ali Khan" style="margin: 0 auto 15px auto; width: 90%;">` +
                `<label style="font-size: 0.9em; font-weight: bold; margin-bottom: 5px; display: block;">Phone Number *</label>` +
                `<input id="swal-input2" class="swal2-input" type="tel" placeholder="e.g. 0300-1234567" style="margin: 0 auto 15px auto; width: 90%;">` +
                `<label style="font-size: 0.9em; font-weight: bold; margin-bottom: 5px; display: block;">Quantity *</label>` +
                `<input id="swal-input3" class="swal2-input" type="number" value="1" min="1" style="margin: 0 auto 15px auto; width: 90%;">` +
                `<label style="font-size: 0.9em; font-weight: bold; margin-bottom: 5px; display: block;">Delivery Location (Optional)</label>` +
                `<input id="swal-input4" class="swal2-input" placeholder="e.g. Hangu Road, Kohat" style="margin: 0 auto 15px auto; width: 90%;">` +
                `<label style="font-size: 0.9em; font-weight: bold; margin-bottom: 5px; display: block;">Order Notes (Optional)</label>` +
                `<textarea id="swal-input5" class="swal2-textarea" placeholder="Any special instructions?" style="margin: 0 auto; width: 90%;"></textarea>` +
                `</div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirm Order',
            confirmButtonColor: '#32b57e',
            width: '32em',
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value.trim();
                const phone = document.getElementById('swal-input2').value.trim();
                const quantityStr = document.getElementById('swal-input3').value;
                const location = document.getElementById('swal-input4').value.trim();
                const notes = document.getElementById('swal-input5').value.trim();

                if (!name || !phone) {
                    Swal.showValidationMessage('Please enter both name and phone number');
                    return false;
                }

                const quantity = parseInt(quantityStr, 10);
                if (isNaN(quantity) || quantity < 1) {
                    Swal.showValidationMessage('Please enter a valid quantity');
                    return false;
                }

                return { name, phone, quantity, location, notes };
            }
        });

        if (formValues) {
            try {
                const orderData = {
                    businessId: product.businessId,
                    customerName: formValues.name,
                    customerPhone: formValues.phone,
                    location: formValues.location,
                    notes: formValues.notes,
                    items: [{
                        productId: product.id || product._id,
                        productName: product.title,
                        quantity: formValues.quantity,
                        price: product.price
                    }],
                    totalAmount: product.price * formValues.quantity
                };

                const res = await axios.post('/business/orders/place', orderData);
                if (res.data.success) {
                    Swal.fire({
                        title: 'Order Placed!',
                        text: `Your order has been received. You can track it in your Dashboard.`,
                        icon: 'success',
                        showCancelButton: true,
                        confirmButtonText: 'Go to My Orders',
                        cancelButtonText: 'Close',
                        confirmButtonColor: '#3498db'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/customer/dashboard');
                        }
                    });
                } else {
                    Swal.fire('Error', res.data.message || 'Failed to place order', 'error');
                }
            } catch (err) {
                console.error("Order error:", err);
                Swal.fire('Error', 'Something went wrong while placing your order.', 'error');
            }
        }
    };

    return (
        <div className="product-card">
            <div className="product-image">
                <img src={product.image} alt={product.title} />
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                {reviews.length > 0 && (
                    <div className="product-rating" onClick={showReviewsModal} title="Click to see reviews" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                        {renderStars(avgRating)}
                        <span style={{ fontSize: '0.78rem', color: '#888' }}>{avgRating} ({reviews.length})</span>
                    </div>
                )}
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">Rs. {product.price}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {reviews.length > 0 && (
                            <button className="card-reviews-btn" onClick={showReviewsModal}>
                                &#11088; Reviews ({reviews.length})
                            </button>
                        )}
                        <button className="card-order-btn" onClick={handleOrder}>
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

