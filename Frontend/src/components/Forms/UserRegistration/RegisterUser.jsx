import { useState } from "react";
import "./RegisterUser.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    RequestRegisterOtpApi,
    VerifyRegisterOtpApi,
} from "../../../ApiCalls/ApiCalls";
import { useNavigate } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import { AppContext } from "../../../Store/AppContext";
import { useContext } from "react";

export const RegisterUser = () => {
    const { setUserData } = useContext(AppContext);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        DOB: "",
    });

    const navigate = useNavigate();

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) return "Full name is required.";
        if (!formData.email.trim()) return "Email is required.";
        if (!formData.password.trim()) return "Password is required.";
        if (formData.password.length < 6)
            return "Password must be at least 6 characters.";
        if (!formData.address.trim()) return "Address is required.";
        if (!formData.DOB.trim()) return "DOB is required.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Optional: check if email looks like service provider
        const serviceEmailKeywords = ["school", "college", "institute"];
        if (serviceEmailKeywords.some(keyword => formData.email.toLowerCase().includes(keyword))) {
            return toast.warning(
                "It looks like you want to register as a service provider. Please go to the respective module."
            );
        }

        // Step 1: Request OTP
        if (!otpSent) {
            const error = validateForm();
            if (error) return toast.error(error);

            await RequestRegisterOtpApi(formData, setLoading, setOtpSent);
            return;
        }

        // Step 2: Verify OTP and create user
        if (!otp.trim()) return toast.error("OTP is required.");

        await VerifyRegisterOtpApi(formData.email, otp, setLoading, navigate, setUserData);
    };

    const handleResendOtp = async () => {
        const error = validateForm();
        if (error) return toast.error(error);

        await RequestRegisterOtpApi(formData, setLoading, setOtpSent);
    };

    return (
        <>
            <header>
                <Navbar />
                <ToastContainer />
            </header>

            <section className="RegContainer">

                {/* LEFT SIDE */}
                <div className="RegLeft">
                    <h1>Join Our Platform As A User 🚀</h1>

                    <p>
                        Welcome! This registration form is designed for <strong>regular users</strong> who want to
                        explore educational institutes, coaching centers, training organizations, and
                        publicly available service information on our platform.
                    </p>
                    <br />
                    <p>
                        If you are a <strong>service provider</strong> such as a school, resturant etc
                        please navigate to the dedicated <strong>Education / Service Module</strong>.
                        That module contains a separate <strong>Register</strong> and <strong>Admin Login</strong> option for institutional accounts.
                    </p>
                    <br />
                    <p>
                        Ensure that you provide a valid email address because <strong>OTP verification</strong> is mandatory
                        before account activation to help maintain platform security.
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="RegRight">
                    <div className="RegCard">
                        <div className="RegHeader">
                            <h1>Create Account</h1>
                        </div>

                        <form className="RegForm" onSubmit={handleSubmit}>
                            <div className="RegInputGroup">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="e.g. Awais Anwar"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={otpSent}
                                />
                            </div>

                            <div className="RegGrid">
                                <div className="RegInputGroup">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="e.g. awais@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={otpSent}
                                    />
                                </div>

                                <div className="RegInputGroup">
                                    <label>Phone (optional)</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="e.g. 03001234567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={otpSent}
                                    />
                                </div>
                            </div>

                            <div className="RegInputGroup">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={otpSent}
                                />
                            </div>

                            <div className="RegGrid">
                                <div className="RegInputGroup">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="DOB"
                                        value={formData.DOB}
                                        onChange={handleChange}
                                        disabled={otpSent}
                                    />
                                </div>

                                <div className="RegInputGroup">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="e.g. Johar Town, Lahore"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={otpSent}
                                    />
                                </div>
                            </div>

                            <div className="RegNotice">
                                ⚠️ Note: This registration is <strong>only for regular users</strong>. Service providers must register through their respective module.
                            </div>

                            {/* OTP Field (Only after OTP sent) */}
                            {otpSent && (
                                <div className="RegInputGroup">
                                    <label>Enter OTP</label>
                                    <input
                                        type="text"
                                        placeholder="6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        className="RegResendBtn RegBtn"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        style={{ marginTop: "10px" }}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            )}

                            <button className="RegBtn" type="submit" disabled={loading}>
                                {loading
                                    ? "Processing..."
                                    : otpSent
                                        ? "Verify OTP & Create Account"
                                        : "Send OTP"}
                            </button>

                            <p className="RegFooterText">
                                Already have an account? <span onClick={() => navigate("/user/login")}>Login</span>
                                <br />
                                <span onClick={() => navigate("/")} className="BackLink">Go Back to Home</span>
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};