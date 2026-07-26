import { useState } from "react";
import "./EduAdminLogin.css";
import { verfiyTheAdmin } from "../../../../ApiCalls/DashBoardApiCalls";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        verfiyTheAdmin(email, password);
    };

    return (
        <div className="Edu-Cata-Adm-login-wrapper">
            <ToastContainer />

            <div className="Edu-Cata-Adm-login-container">

                {/* LEFT SIDE */}
                <div className="Edu-Cata-Adm-login-left">
                    <h1>Welcome Back</h1>
                    <p>
                        Manage admissions, students, and institute data securely
                        through your admin dashboard.
                    </p>
                    <button
                        className="Edu-Cata-edu-Admin-login-back-btn"
                        onClick={() => navigate("/edu")}
                    >
                        Go Back
                    </button>
                </div>

                {/* RIGHT SIDE */}
                <div className="Edu-Cata-Adm-login-right">
                    <div className="Edu-Cata-Adm-login-card">
                        <h2>Admin Login</h2>
                        <p>Secure access to your institute dashboard</p>

                        <form onSubmit={handleSubmit}>
                            <div className="Edu-Cata-Adm-input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="admin@school.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="Edu-Cata-Adm-input-group">
                                <label>Password</label>
                                <div className="Edu-Cata-Adm-password-box">
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
                                    <span onClick={() => navigate("/edu/forgot-password")}>Forgot Password?</span>
                                </div>
                            </div>

                            <button type="submit" className="Edu-Cata-Adm-login-btn">
                                Login
                            </button>
                        </form>

                        <div className="Edu-Cata-Adm-login-footer">
                            <span>Authorized admins only</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
