import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AppContext } from '../../Store/AppContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import './CustomerLogin.css';

export const CustomerLogin = () => {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        emailOrPhone: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await axios.post('/customer/auth/login', {
                    emailOrPhone: formData.emailOrPhone,
                    password: formData.password
                });
                if (res.data.success) {
                    login(res.data.token, res.data.customer);
                    Swal.fire('Success', 'Logged in successfully', 'success');
                    navigate(-1); // Go back to previous page (likely the product page)
                }
            } else {
                const res = await axios.post('/customer/auth/register', {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                });
                if (res.data.success) {
                    login(res.data.token, res.data.customer);
                    Swal.fire('Success', 'Registered successfully', 'success');
                    navigate(-1);
                }
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Authentication failed', 'error');
        }
    };

    return (
        <>
            <Navbar />
            <div className="customer-auth-container">
                <div className="customer-auth-box">
                    <h2>{isLogin ? 'Customer Login' : 'Customer Register'}</h2>
                    <form onSubmit={handleSubmit} className="customer-auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                        )}

                        {isLogin ? (
                            <div className="form-group">
                                <label>Email or Phone</label>
                                <input type="text" name="emailOrPhone" value={formData.emailOrPhone} onChange={handleChange} required />
                            </div>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
                            {isLogin && (
                                <div className="customer-forgot-pass">
                                    <span onClick={() => navigate("/customer/forgot-password")}>Forgot Password?</span>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="customer-auth-btn">
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </form>

                    <p className="customer-auth-toggle" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};
