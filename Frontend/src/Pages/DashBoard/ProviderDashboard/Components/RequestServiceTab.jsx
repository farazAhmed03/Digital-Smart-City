import { useState } from "react";
import { SubmitAdminServiceRequestApi } from "../../../../ApiCalls/DashBoardApiCalls";
import { FiSend, FiInfo } from "react-icons/fi";
import "./RequestServiceTab.css";

const categoryTypes = {
  Education: ["School", "College", "University", "Academy", "Institute"],
  Health: ["Specialist", "Pharmacy", "Emergency"],
  Food: ["Restaurant", "Cafe", "Bakery", "Fast Food"],
  IT: ["Software House", "Training Institute"],
};

export const RequestServiceTab = ({ dashboardData }) => {
  const [formData, setFormData] = useState({
    category: "",
    type: "",
    serviceName: "",
    serviceLocation: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { type: "" }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.type || !formData.serviceName || !formData.serviceLocation) {
      alert("Please fill in all required fields (Category, Type, Name, and Location).");
      return;
    }

    setLoading(true);
    SubmitAdminServiceRequestApi(formData, () => {
      setLoading(false);
      setFormData({ category: "", type: "", serviceName: "", serviceLocation: "", message: "" });
    });
  };

  return (
    <div className="request-service-container fade-in">
      <div className="request-service-header">
        <h2>Request Additional Service</h2>
        <p>Expanding your presence? Request a new service listing under your verified account.</p>
      </div>

      <div className="request-info-banner">
        <FiInfo className="info-icon" />
        <div className="info-text">
          <strong>Secure Processing:</strong> This request will use your verified identity
          (<strong>{dashboardData?.AdminEmail || dashboardData?.email}</strong>).
          No additional verification is required.
        </div>
      </div>

      <form className="request-service-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Select Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {Object.keys(categoryTypes).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Service Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              disabled={!formData.category}
            >
              <option value="">-- Select Type --</option>
              {formData.category &&
                categoryTypes[formData.category]?.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          </div>

          {/* New Fields */}
          <div className="form-group full-width">
            <label>Proposed Service Name</label>
            <input
              type="text"
              name="serviceName"
              placeholder="e.g. My New Branch / Specialist Clinic"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Service Location / Address</label>
            <input
              type="text"
              name="serviceLocation"
              placeholder="e.g. KDA Sector 4, Kohat"
              value={formData.serviceLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Additional Information / Message (Optional)</label>
            <textarea
              name="message"
              placeholder="Any specific requirements or notes for the Super Admin..."
              value={formData.message}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          {
            (dashboardData.PaymentPlan === "BASIC")
              ?
              <button type="submit" className="submit-request-btn" disabled>
                Plan doesn't support the feature
              </button>
              :
              <button type="submit" className="submit-request-btn" disabled={loading}>
                {loading ? "Submitting..." : <><FiSend /> Submit Request</>}
              </button>
          }
        </div>
      </form>

      <div className="request-footer">
        <p>Once submitted, our Super Admin team will review your request and contact you for the setup process.</p>
      </div>
    </div>
  );
};
