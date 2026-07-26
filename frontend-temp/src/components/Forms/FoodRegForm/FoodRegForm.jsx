import { useEffect, useState, useContext } from "react";
import "./FoodRegForm.css";
import { ServiceProviderRegistration, VerifyServiceProviderOtpApi } from "../../../ApiCalls/ApiCalls";
import { AppContext } from "../../../Store/AppContext";
import AutofillNote from "../../AutofillNote/AutofillNote";
import { ToastContainer } from "react-toastify";

/* =====================================================
CATEGORY → TYPE MAPPING
===================================================== */

const categoryTypes = {
  // Limit to backend-supported food types
  Food: ["Restaurant", "Cafe", "Fast Food", "Bakery", "Local Food", "Street Food", "Fine Dining"],
};

/* =====================================================
STEP ONE
===================================================== */

const StepOne = ({ onNext, formData, handleChange }) => (
  <div className="form-content fade-in">
    <div className="form-grid">
      <div className="input-group">
      <label>Full Name</label>
      <input
        type="text"
        name="fullname"
        placeholder="Wasif Khan"
        value={formData.fullname}
        onChange={handleChange}
        required
      />
      </div>

      <div className="input-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="merchant@foodmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <label>CNIC / ID Card Number</label>
        <input
          type="number"
          name="IDCard"
          value={formData.IDCard}
          onChange={handleChange}
          placeholder="1420111223344"
          required
        />
      </div>

      <div className="input-group">
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categoryTypes).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Business Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          disabled={!formData.category}
        >
          <option value="">Select Type</option>
          {formData.category &&
            categoryTypes[formData.category]?.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </div>
    </div>

    <button
      type="button"
      onClick={onNext}
      className="Food-Reg-btn-primary flex-grow"
    >
      Continue
    </button>
  </div>
);

/* =====================================================
STEP TWO
===================================================== */

const StepTwo = ({ onBack, formData, handleChange }) => (
  <div className="form-content fade-in">
    <div className="form-grid">
      <div className="input-group">
      <label>Phone Number</label>
      <input
        type="number"
        name="phonenumber"
        value={formData.phonenumber}
        onChange={handleChange}
        placeholder="923131234567"
        required
      />
      </div>

      <div className="input-group">
        <label>WhatsApp Number</label>
        <input
          type="number"
          name="whatsappnumber"
          value={formData.whatsappnumber}
          onChange={handleChange}
          placeholder="923131234567"
          required
        />
      </div>

      <div className="input-group input-group-full">
        <label>Physical Address</label>
        <input
          type="text"
          name="address"
          placeholder="Street, City, Country"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group input-group-full">
        <label>Primary Language</label>
        <input
          type="text"
          name="language"
          placeholder="Pashto, Urdu, English"
          value={formData.language}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="button-row">
      <button
        type="button"
        onClick={onBack}
        className="Food-form-btn-secondary"
      >
        Back
      </button>

      <button
        type="submit"
        className="Food-Reg-btn-primary flex-grow"
      >
        Complete Registration
      </button>
    </div>
  </div>
);

/* =====================================================
STEP OTP
===================================================== */

const StepOTP = ({ email, onVerify, onBack, isSubmitting }) => {
  const [otp, setOtp] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    onVerify(otp);
  };

  return (
    <div className="form-content fade-in">
      <p className="otp-helper-text">
        We've sent a 6-digit verification code to <strong>{email}</strong>. Please enter it below to complete your registration.
      </p>

      <div className="input-group">
        <label>Verification Code</label>
        <input
          type="text"
          placeholder="ENTER OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="otp-input"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="button-row">
        <button
          type="button"
          onClick={onBack}
          className="Food-form-btn-secondary"
          disabled={isSubmitting}
        >
          Edit Details
        </button>

        <button
          type="button"
          onClick={handleVerify}
          className="Food-Reg-btn-primary flex-grow"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify & Submit"}
        </button>
      </div>
    </div>
  );
};

export const FoodRegForm = ({ setShowform }) => {
  const [step, setStep] = useState(1);
  const { userData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phonenumber: "",
    whatsappnumber: "",
    address: "",
    language: "",
    IDCard: "",
    category: "",
    type: "",
  });

  const [verificationRequired, setVerificationRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =====================================================
  GET USER DATA
  ===================================================== */

  // User data is managed by AppContext

  /* =====================================================
  AUTO FILL FORM WHEN USER DATA LOADS
  ===================================================== */

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        fullname: userData?.fullName || "",
        email: userData?.email || "",
        phonenumber: userData?.phone || "",
        whatsappnumber: userData?.phone || "",
        address: userData?.address || "",
      }));
    }
  }, [userData]);

  /* =====================================================
  HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { type: "" }),
    }));
  };

  /* =====================================================
  HANDLE SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phonenumber.length < 11 || formData.whatsappnumber.length < 11) {
      alert("Invalid Number is filled.");
    } else if (!formData.fullname || !formData.email || !formData.password || !formData.category || !formData.type) {
      alert("Please fill all required fields correctly.");
    } else {
      // Use the category and type selected by the user
      const payload = {
        ...formData,
        Verified: false
      };
      ServiceProviderRegistration(payload, setVerificationRequired, setIsSubmitting);
    }
  };

  const handleOtpVerify = (otp) => {
    const payload = {
      email: formData.email,
      otp: otp
    };
    VerifyServiceProviderOtpApi(payload, () => {
      setShowform(false); // Close form on success
    }, setIsSubmitting);
  };

  return (
    <div className="page-wrapper">
      <div className="main-card">
        <form className="form-panel" onSubmit={handleSubmit}>
          <ToastContainer />
          <div className="merchant-form-shell">
            <AutofillNote />
            <div className="form-topbar">
              <div>
                <div className="form-step-tag">{verificationRequired ? "Verification" : `Step ${step} of 2`}</div>
                <h2 className="form-title">{verificationRequired ? "Verify Merchant Email" : "Join as Merchant"}</h2>
                <p className="form-subtitle">
                  {verificationRequired
                    ? "Enter the code sent to your inbox to complete merchant registration."
                    : "Register your food business and complete your merchant profile."}
                </p>
              </div>
              <div className="form-topbar-accent" aria-hidden="true"></div>
            </div>

            {verificationRequired ? (
              <StepOTP
                email={formData.email}
                onVerify={handleOtpVerify}
                onBack={() => setVerificationRequired(false)}
                isSubmitting={isSubmitting}
              />
            ) : step === 1 ? (
              <StepOne
                onNext={() => setStep(2)}
                formData={formData}
                handleChange={handleChange}
              />
            ) : (
              <StepTwo
                onBack={() => setStep(1)}
                formData={formData}
                handleChange={handleChange}
              />
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
