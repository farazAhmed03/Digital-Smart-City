import { useState } from "react";
import "./ForgotPass.css";
import { requestResetOtp, verifyResetOtp, resetPassword } from "../../ApiCalls/DashBoardApiCalls";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiArrowLeft } from "react-icons/fi";

const ForgotPass = ({ type = "admin" }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await requestResetOtp(email, type);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setStep(2);
        } else {
            toast.error(res.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await verifyResetOtp(email, otp);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setStep(3);
        } else {
            toast.error(res.message);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        const res = await resetPassword(email, type, otp, newPassword);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setTimeout(() => {
                navigate(-1); // Go back to login
            }, 2000);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="forgot-pass-wrapper">
            <ToastContainer />
            <div className="forgot-pass-container">
                <button className="back-to-login" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back to Login
                </button>

                <div className="forgot-pass-card">
                    <div className="forgot-pass-header">
                        <div className="icon-badge">
                            {step === 1 && <FiMail />}
                            {step === 2 && <FiShield />}
                            {step === 3 && <FiLock />}
                        </div>
                        <h2>{step === 1 ? "Forgot Password?" : step === 2 ? "Verify OTP" : "Reset Password"}</h2>
                        <p>
                            {step === 1 && "Enter your email address to receive a reset OTP."}
                            {step === 2 && `We've sent a 6-digit code to ${email}`}
                            {step === 3 && "Set a new secure password for your account."}
                        </p>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleSendOtp}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="input-group">
                                <label>OTP Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                            <p className="resend-text">
                                Didn't receive code? <span onClick={handleSendOtp}>Resend</span>
                            </p>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="input-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Repeat new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;
