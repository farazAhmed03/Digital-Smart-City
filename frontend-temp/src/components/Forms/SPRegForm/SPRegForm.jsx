import { useEffect, useState, useContext } from "react";
import "./SPRegForm.css";
import { ServiceProviderRegistration, VerifyServiceProviderOtpApi } from "../../../ApiCalls/ApiCalls";
import { AppContext } from "../../../Store/AppContext";
import AutofillNote from "../../AutofillNote/AutofillNote";
import { ToastContainer } from "react-toastify";

/* =====================================================
CATEGORY → TYPE MAPPING
===================================================== */

const categoryTypes = {
  Education: ["School", "College"],
  Health: ["Specialist"]
};

/* =====================================================
STEP ONE
===================================================== */

const StepOne = ({ onNext, formData, handleChange, forcedCategory }) => (
  <div className="sp-form-content fade-in">

    <div className="sp-input-group">
      <label>Full Name</label>
      <input
        type="text"
        name="fullname"
        placeholder="John"
        value={formData.fullname}
        onChange={handleChange}
        required
      />
    </div>

    <div className="sp-input-group">
      <label>Email Address (Actively used Email)</label>
      <input
        type="email"
        name="email"
        placeholder="example@gmail.com"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>

    <div className="sp-input-group">
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

    <div className="sp-input-group">
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

    <div className="sp-input-group">
      <label>Category</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {forcedCategory ? (
          <option value={forcedCategory}>{forcedCategory}</option>
        ) : (
          Object.keys(categoryTypes).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))
        )}
      </select>
    </div>

    <div className="sp-input-group">
      <label>Type</label>
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

    <button
      type="button"
      onClick={onNext}
      className="Edu-Reg-btn-primary flex-grow"
    >
      Continue →
    </button>
  </div>
);

/* =====================================================
STEP TWO
===================================================== */

const StepTwo = ({ onBack, formData, handleChange, isSubmitting }) => (
  <div className="sp-form-content fade-in">
    <div className="sp-input-group">
      <label>Phone Number</label>
      <input
        type="number"
        name="phonenumber"
        value={formData.phonenumber}
        onChange={handleChange}
        placeholder="923131234567"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="sp-input-group">
      <label>WhatsApp Number</label>
      <input
        type="number"
        name="whatsappnumber"
        value={formData.whatsappnumber}
        onChange={handleChange}
        placeholder="923131234567"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="sp-input-group">
      <label>Physical Address</label>
      <input
        type="text"
        name="address"
        placeholder="Street , City , Country"
        value={formData.address}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="sp-input-group">
      <label>Primary Language</label>
      <input
        type="text"
        name="language"
        placeholder="Pashto , Urdu , English"
        value={formData.language}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="button-row">
      <button
        type="button"
        onClick={onBack}
        className="Edu-form-btn-secondary"
        disabled={isSubmitting}
      >
        ← Back
      </button>

      <button
        type="submit"
        className="Edu-Reg-btn-primary flex-grow"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Complete Registration"}
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
    <div className="sp-form-content fade-in">
      <p style={{ marginBottom: "20px", color: "#64748b", fontSize: "14px" }}>
        We've sent a 6-digit verification code to <strong>{email}</strong>. Please enter it below to complete your registration.
      </p>

      <div className="sp-input-group">
        <label>Verification Code</label>
        <input
          type="text"
          placeholder="ENTER OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="otp-input-large"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="button-row">
        <button
          type="button"
          onClick={onBack}
          className="Edu-form-btn-secondary"
          disabled={isSubmitting}
        >
          Edit Details
        </button>

        <button
          type="button"
          onClick={handleVerify}
          className="Edu-Reg-btn-primary flex-grow"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify & Submit"}
        </button>
      </div>
    </div>
  );
};

export const ServiceProviderRegForm = ({ setShowform, forcedCategory }) => {
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
    category: forcedCategory || "",
    type: "",
  });

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

  const [verificationRequired, setVerificationRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="sp-page-wrapper">
      <ToastContainer/>
      <div className="sp-main-card">

        {/* LEFT SIDE */}

        <div className="SPbranding-panel">
          <div className="branding-content">

            <h1>{step === 1 ? "Join Our Network" : "Almost Ready"}</h1>

            <p>
              {step === 1
                ? "Experience the premium partnership. Register your service in just a few steps."
                : "Your professional profile is almost complete. Just a few more details."}
            </p>

            <div className="progress-bar">
              <div className={`progress-step ${step >= 1 ? "active" : ""}`}></div>
              <div className={`progress-step ${step >= 2 ? "active" : ""}`}></div>
            </div>

            <button
              className="Edu-form-btn-secondary back-btn"
              onClick={() => setShowform(false)}
            >
              ← Go Back
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <form className="sp-form-panel" onSubmit={handleSubmit}>
          <AutofillNote />
          <h2 className="form-title">Service Provider Registration</h2>
          <p className="form-subtitle">Fill in the information below to create your official account.</p>

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
              forcedCategory={forcedCategory}
            />
          ) : (
            <StepTwo
              onBack={() => setStep(1)}
              formData={formData}
              handleChange={handleChange}
              isSubmitting={isSubmitting}
            />
          )}

        </form>

      </div>
    </div>
  );
};