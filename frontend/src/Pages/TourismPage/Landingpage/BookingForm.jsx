import React, { useState, useContext, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import './SingleLandingPage.css'; // We'll add styles here
import { AppContext } from '../../../Store/AppContext';
import AutofillNote from '../../../components/AutofillNote/AutofillNote';

export const BookingForm = ({ hotelName }) => {
    const { userData } = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
    });

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.fullName || '',
                phone: userData.phone || ''
            }));
        }
    }, [userData]);

    const [isBooked, setIsBooked] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create booking object
        const newBooking = {
            id: Date.now(),
            status: "Pending",
            date: new Date().toLocaleDateString(),
            hotelName: hotelName || "Unknown Hotel",
            ...formData
        };

        // Save to localStorage (Simulating Backend)
        const existingBookings = JSON.parse(localStorage.getItem('tourism_bookings') || '[]');
        localStorage.setItem('tourism_bookings', JSON.stringify([newBooking, ...existingBookings]));

        console.log("Booking Submitted:", newBooking);
        setIsBooked(true);
        // Reset after 3 seconds
        setTimeout(() => {
            setIsBooked(false);
            setFormData({ name: '', phone: '', checkIn: '', checkOut: '', guests: 1 });
        }, 3000);
    };

    return (
        <section className="booking-section SP_Sec">
            <h2 className="SP_Sec_hd">Book Your Stay</h2>

            <div className="booking-container">
                {isBooked ? (
                    <div className="booking-success">
                        <FaCheckCircle className="success-icon" />
                        <h3>Booking Confirmed!</h3>
                        <p>We have received your request for <strong>{hotelName}</strong>.</p>
                    </div>
                ) : (
                    <form className="booking-form" onSubmit={handleSubmit}>
                        <AutofillNote />
                        <div className="form-group">
                            <label><FaUser /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>📱 Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="0300-1234567"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label><FaCalendarAlt /> Check-In</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><FaCalendarAlt /> Check-Out</label>
                                <input
                                    type="date"
                                    name="checkOut"
                                    value={formData.checkOut}
                                    onChange={handleChange}
                                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>👥 Guests</label>
                            <input
                                type="number"
                                name="guests"
                                min="1"
                                max="20"
                                value={formData.guests}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="booking-btn">Confirm Booking</button>
                    </form>
                )}
            </div>
        </section>
    );
};
