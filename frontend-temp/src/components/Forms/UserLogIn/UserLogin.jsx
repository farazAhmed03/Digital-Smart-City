import React, { useState, useContext } from "react";
import "./UserLogin.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoginUserApi } from "../../../ApiCalls/ApiCalls";
import Navbar from "../../navbar/Navbar";
import { AppContext } from "../../../Store/AppContext";

export const UserLogin = () => {
    const navigate = useNavigate();
    const { setUserData } = useContext(AppContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        LoginUserApi(formData, setLoading, navigate, setUserData);
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            <div className="User-login-wrapper">

                <div className="User-login-container">

                    {/* LEFT SIDE */}
                    <div className="User-login-left">
                        <h1>Welcome Back 👋</h1>
                        <p>
                            Access your profile, admissions, and institute updates
                            securely through your student dashboard.
                        </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="User-login-right">
                        <div className="User-login-card">
                            <h2>User Login</h2>
                            <p>Sign in to continue</p>

                            <form onSubmit={handleSubmit}>
                                <div className="User-input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@domain.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="User-input-group">
                                    <label>Password</label>
                                    <div className="User-password-box">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span onClick={() => setShowPass(!showPass)}>
                                            {showPass ? "Hide" : "Show"}
                                        </span>
                                    </div>
                                    <div className="forgot-password-link">
                                        <span onClick={() => navigate("/user/forgot-password")}>Forgot Password?</span>
                                    </div>
                                </div>

                                <button type="submit" className="User-login-btn" disabled={loading}>
                                    {loading ? "Verifying..." : "Login As User"}
                                </button>
                            </form>

                            <div className="User-login-footer">
                                <p>Don't have an account?</p>
                                <button onClick={() => navigate("/user/register")}>
                                    Create Account
                                </button>

                                <button onClick={() => navigate("/")}>
                                    Return to Homepage
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};