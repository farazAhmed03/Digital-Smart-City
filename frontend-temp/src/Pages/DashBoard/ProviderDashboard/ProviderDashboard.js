
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
    return (
        <div className="provider-dashboard">
            <Navbar />
            <div className="dashboard-wrapper">
                <aside className="dashboard-sidebar">
                    <div className="user-profile-summary">
                        <div className="avatar-circle">KS</div>
                        <h4>Kohat Super Market</h4>
                        <span className="badge-verified">Verified ✅</span>
                    </div>
                    <nav className="dashboard-nav">
                        <NavLink to="" end className={({ isActive }) => isActive ? 'active' : ''}>📊 Dashboard</NavLink>
                        <NavLink to="requests" className={({ isActive }) => isActive ? 'active' : ''}>🧾 Requests</NavLink>
                        <NavLink to="profile" className={({ isActive }) => isActive ? 'active' : ''}>🏪 My Profile</NavLink>
                        <NavLink to="services" className={({ isActive }) => isActive ? 'active' : ''}>🧰 Services/Offers</NavLink>
                        <NavLink to="reviews" className={({ isActive }) => isActive ? 'active' : ''}>⭐ Reviews</NavLink>
                        <NavLink to="subscription" className={({ isActive }) => isActive ? 'active' : ''}>💳 Subscription</NavLink>
                        <NavLink to="support" className={({ isActive }) => isActive ? 'active' : ''}>🆘 Support</NavLink>
                    </nav>
                </aside>
                <main className="dashboard-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProviderDashboard;
