import { useState } from "react";
import "../DashBoard/EductionDashboard/EduAdminLgoInForm/EduAdminLogin.css";
import { businessLoginApi } from "../../ApiCalls/DashBoardApiCalls";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const BusinessAdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        businessLoginApi(email, password);
    };

    return (
        <div className="Adm-login-wrapper">
            <ToastContainer />
            <div className="Adm-login-card">
                <h2>Business Admin Login</h2>
                <p>Manage your business profile and products</p>

                <form onSubmit={handleSubmit}>
                    <div className="Adm-input-group">
                        <label>Business Email</label>
                        <input
                            type="email"
                            placeholder="business@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="Adm-input-group">
                        <label>Password</label>
                        <div className="Adm-password-box">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                                {showPass ? "Hide" : "Show"}
                            </span>
                        </div>
                        <div className="forgot-password-link">
                            <span onClick={() => navigate("/business/forgot-password")}>Forgot Password?</span>
                        </div>
                    </div>

                    <button type="submit" className="Adm-login-btn">
                        Login to Dashboard
                    </button>
                </form>

                <div className="Adm-login-footer">
                    <button onClick={() => navigate("/business")} className="btn-link">Back to Business Home</button>
                    <br />
                    <span>Authorized business owners only</span>
                </div>
            </div>
        </div>
    );
};
