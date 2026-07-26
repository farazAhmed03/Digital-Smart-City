import { FiMail, FiLock, FiUser } from "react-icons/fi";
import "./CreateHealthAdmin.css";
import { useState } from "react";
import { CreateHealthCataAdmin } from "../../../../../ApiCalls/SuperAdminApiCall";

export const CreateHealthAdmin = ({ id, setActiveTab, Data }) => {
    let [AdminData, setAdminData] = useState({
        AdminName: Data.fullname || "",
        AdminEmail: Data.email || "",
        AdminIDCard: Data.IDCard || "",
        ServiceName: "",
        ServiceLocation: Data.address || "",
        ServiceType: Data.type || "",
        PaymentPlan: Data.PaymentPlan || "",
        reqId: id
    });

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setAdminData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (AdminData.ServiceType === "NULL" || AdminData.ServiceType === "" || AdminData.PaymentPlan === "NULL" || AdminData.PaymentPlan === "") {
            alert("Please select Service Type and Payment Plan.");
        } else {
            CreateHealthCataAdmin(AdminData, setActiveTab, AdminData.ServiceType);
        }
    }

    return (
        <div className="SA_form_wrapper health-theme">
            <div className="SA_form_header_inline">
                <h2>Register New Medical Admin</h2>
            </div>

            <form className="SA_main_form_element" onSubmit={(e) => handleSubmit(e)}>
                <div className="SA_form_grid">

                    {/* PORTION 1: Admin Info */}
                    <div className="SA_form_card">
                        <div className="SA_card_indicator medical-indicator">1</div>
                        <h3>Admin Credentials</h3>
                        <p className="SA_card_desc">Personal details for the account holder.</p>

                        <div className="SA_input_box">
                            <label><FiUser /> Full Name</label>
                            <input type="text" placeholder="e.g. Dr. Arshad Khan" name="AdminName" value={AdminData.AdminName} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiMail />Admin Email</label>
                            <input type="text" placeholder="admin@medical.com" name="AdminEmail" value={AdminData.AdminEmail} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiLock />Admin ID Card</label>
                            <input type="text" placeholder="CNIC Number" name="AdminIDCard" value={AdminData.AdminIDCard} onChange={(e) => handleChange(e)} required />
                        </div>
                        <div className="SA_input_box">
                            <label>Payment Plan</label>
                            <select name="PaymentPlan" value={AdminData.PaymentPlan} onChange={(e) => handleChange(e)} required>
                                <option value="NULL">Select One</option>
                                <option value="FREE">Free (30 Days Trial)</option>
                                <option value="BASIC">Basic</option>
                                <option value="PREMIUM">Premium</option>
                                <option value="ENTERPRISE">Enterprise</option>
                            </select>
                        </div>
                    </div>

                    {/* PORTION 2: Service Info */}
                    <div className="SA_form_card">
                        <div className="SA_card_indicator medical-indicator">2</div>
                        <h3>Medical Facility Info</h3>
                        <p className="SA_card_desc">Legal and physical details of the service.</p>

                        <div className="SA_input_box">
                            <label>Service Category</label>
                            <select value={AdminData.ServiceType} name="ServiceType" onChange={(e) => handleChange(e)} required>
                                <option value={"NULL"}>--Select--</option>
                                <option value={"CLINIC"}>Clinic</option>
                                <option value={"PHARMACY"}>Pharmacy</option>
                                <option value={"SPECIALIST"}>Specialist</option>
                            </select>
                        </div>

                        <div className="SA_input_box">
                            <label><FiMail />Facility Name</label>
                            <input type="text" placeholder="e.g. Al-Shifa Clinic" name="ServiceName" value={AdminData.ServiceName} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiLock />Facility Location</label>
                            <input type="text" placeholder="Area in Kohat" name="ServiceLocation" value={AdminData.ServiceLocation} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiLock />Request Id</label>
                            <input value={id} required readOnly />
                        </div>
                    </div>
                </div>

                <div className="SA_form_actions_bottom">
                    <button type="button" className="SA_secondary_btn" onClick={() => setActiveTab("NEW_REQUESTS")}>Go Back</button>
                    <button type="submit" className="SA_primary_btn medical-btn">Approve & Create Admin</button>
                </div>
            </form>
        </div>
    );
};
