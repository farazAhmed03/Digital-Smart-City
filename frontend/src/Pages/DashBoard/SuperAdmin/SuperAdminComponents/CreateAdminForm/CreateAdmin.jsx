import { FiMail, FiLock, FiUser } from "react-icons/fi";
import "./CreateAdmin.css";
import { useState } from "react";
import { CreateEduCataAdmin } from "../../../../../ApiCalls/SuperAdminApiCall";

export const CreateAdminModal = ({ id, setActiveTab, Data }) => {
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

    let [formSubmitted, setFormSubmitted] = useState(false);

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
            alert("Fill the fields first.");
        } else {
            CreateEduCataAdmin(AdminData, setActiveTab, AdminData.ServiceType, setFormSubmitted);
        }
    }

    return (
        <div className="SA_form_wrapper">
            <div className="SA_form_header_inline">
                <h2>Register New Service Admin</h2>
            </div>

            <form className="SA_main_form_element" onSubmit={(e) => handleSubmit(e)}>
                <div className="SA_form_grid">

                    {/* PORTION 1: Admin Info */}
                    <div className="SA_form_card">
                        <div className="SA_card_indicator">1</div>
                        <h3>Admin Credentials</h3>
                        <p className="SA_card_desc">Personal details for the account holder.</p>

                        <div className="SA_input_box">
                            <label><FiUser /> Full Name</label>
                            <input type="text" placeholder="e.g. Dr. Arshad Khan" name="AdminName" value={AdminData.AdminName} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiMail />Admin Email</label>
                            <input type="text" placeholder="admin@institution.com" name="AdminEmail" value={AdminData.AdminEmail} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiLock />Admin ID Card</label>
                            <input type="text" placeholder="address" name="AdminIDCard" value={AdminData.AdminIDCard} onChange={(e) => handleChange(e)} required />
                        </div>
                        <div className="SA_input_box">
                            <label>Payment Plan</label>
                            <select name="PaymentPlan" value={AdminData.PaymentPlan} onChange={(e) => handleChange(e)}>
                                <option value="NULL">Select One</option>
                                <option value="FREE">Free</option>
                                <option value="BASIC">Basic</option>
                                <option value="PREMIUM">Premium</option>
                                <option value="ENTERPRISE">Enterprise</option>
                            </select>
                        </div>
                    </div>

                    {/* PORTION 2: Service Info */}
                    <div className="SA_form_card">
                        <div className="SA_card_indicator">2</div>
                        <h3>Service & Institution Info</h3>
                        <p className="SA_card_desc">Legal and physical details of the service.</p>

                        <div className="SA_input_box">
                            <label>Type</label>
                            <select value={AdminData.ServiceType} name="ServiceType" onChange={(e) => handleChange(e)}>
                                <option value={"NULL"}>--Select--</option>
                                <option value={"SCHOOL"}>School</option>
                                <option value={"COLLEGE"}>College</option>
                                <option value={"RESTURANT"}>Resutrant</option>
                                <option value={"BUSINESS"}>Business</option>
                            </select>
                        </div>

                        <div className="SA_input_box">
                            <label><FiMail />Service Name</label>
                            <input type="text" placeholder="e.g. ABC School" name="ServiceName" value={AdminData.ServiceName} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiLock />Service Location</label>
                            <input type="text" placeholder="address" name="ServiceLocation" value={AdminData.ServiceLocation} onChange={(e) => handleChange(e)} required />
                        </div>

                        <div className="SA_input_box">
                            <label><FiLock />Service Id</label>
                            <input value={id} required readOnly />
                        </div>
                    </div>
                </div>

                <div className="SA_form_actions_bottom">
                    <button type="button" className="SA_secondary_btn" onClick={() => setActiveTab("NEW_REQUESTS")}>Go Back</button>
                    <button type="submit" disabled={formSubmitted} className="SA_primary_btn">{formSubmitted ? "Creating..." : "Create Admin Account"}</button>
                </div>
            </form>
        </div>
    );
};