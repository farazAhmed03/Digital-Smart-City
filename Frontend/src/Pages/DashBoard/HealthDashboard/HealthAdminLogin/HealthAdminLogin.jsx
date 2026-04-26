import { useState } from "react";
import "./HealthAdminLogin.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { VerifyHealthAdmin } from "../../../../ApiCalls/HealthDashboardApiCalls";

export const HealthAdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        VerifyHealthAdmin(email, password, navigate);
    };

    return (
        <div className="Health-Cata-Adm-login-wrapper">
            <ToastContainer />

            <div className="Health-Cata-Adm-login-container">
                {/* LEFT SIDE */}
                <div className="Health-Cata-Adm-login-left">
                    <h1>Health Portal</h1>
                    <p>
                        Manage your clinic, pharmacy, or specialist profile securely.
                    </p>
                    <button
                        className="Health-Cata-Admin-login-back-btn"
                        onClick={() => navigate("/health")}
                    >
                        Go Back
                    </button>
                </div>

                {/* RIGHT SIDE */}
                <div className="Health-Cata-Adm-login-right">
                    <div className="Health-Cata-Adm-login-card">
                        <h2>Health Admin Login</h2>
                        <p>Secure access to your health service dashboard</p>

                        <form onSubmit={handleSubmit}>
                            <div className="Health-Cata-Adm-input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="admin@health.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="Health-Cata-Adm-input-group">
                                <label>Password</label>
                                <div className="Health-Cata-Adm-password-box">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span onClick={() => setShowPass(!showPass)}>
                                        {showPass ? "Hide" : "Show"}
                                    </span>
                                </div>
                                <div className="forgot-password-link">
                                    <span onClick={() => navigate("/health/forgot-password")}>Forgot Password?</span>
                                </div>
                            </div>

                            <button type="submit" className="Health-Cata-Adm-login-btn">
                                Login
                            </button>
                        </form>

                        <div className="Health-Cata-Adm-login-footer">
                            <span>Authorized admins only</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
