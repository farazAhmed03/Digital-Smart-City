import React, { useState } from 'react';
import './SuprAdminLogin.css';
import { SuperAdminFormSubmitted } from '../../../../ApiCalls/SuperAdminApiCall';
import { ToastContainer } from 'react-toastify';

export const SuperAdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        SuperAdminFormSubmitted(formData, setIsLoading);
    };

    return (
        <div className="admin-split-container">
            <ToastContainer />
            {/* Left Side: Hidden on Mobile */}
            <div className="admin-welcome-section">
                <div className="welcome-content">
                    <h1>Welcome!</h1>
                    <p>System Core Authentication Terminal.</p>
                    <div className="step-indicator">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="admin-form-section">
                <div className="admin-login-card">
                    <div className="admin-header">
                        <div className="admin-badge">System Core</div>
                        <h2>Super Admin</h2>
                        <p>Accessing Secure Management Layer</p>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e)} className="admin-form">
                        <div className="input-group">
                            <label>Admin Identifier</label>
                            <input
                                type="email"
                                placeholder="admin@system.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Security Key</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Initialize Session'}
                        </button>
                    </form>

                    <div className="admin-footer">
                        <p>Authorized personnel only. Activities are monitored.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};