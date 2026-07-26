import { useState } from "react";
import "./FoodAdminLogin.css";
import { verifyFoodAdmin } from "../../../../ApiCalls/DashBoardApiCalls";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const FoodAdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        setIsSubmitting(true);
        try {
            await verifyFoodAdmin(email.trim().toLowerCase(), password);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="Adm-login-wrapper">
            <ToastContainer />
            <div className="Adm-login-card">
                <h2>Food Admin Login</h2>
                <p>Secure access to your restaurant dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="Adm-input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="admin@restaurant.com"
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
                            <span onClick={() => setShowPass(!showPass)}>
                                {showPass ? "Hide" : "Show"}
                            </span>
                        </div>
                        <div className="forgot-password-link">
                            <button
                                type="button"
                                className="Adm-forgot-btn"
                                onClick={() => navigate("/food/forgot-password")}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="Adm-login-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="Adm-login-footer">
                    <span>Authorized admins only</span>
                </div>
            </div>
        </div>
    );
};
