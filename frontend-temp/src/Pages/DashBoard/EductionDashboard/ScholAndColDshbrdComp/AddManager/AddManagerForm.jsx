import { useState } from "react";
import "./AddManagerForm.css";
import { AddManagerApi } from "../../../../../ApiCalls/DashBoardApiCalls";
import { ToastContainer } from "react-toastify";
export const AddManagerForm = ({ OtherServices }) => {
    const [formData, setFormData] = useState({
        ManagerEmail: "",
        password: "",
        ServiceName: "",
        ServiceType: ""
    });

    const FormSubmitted = (e) => {
        e.preventDefault();
        AddManagerApi(formData);
    }

    return (
        <section className="form-area">
            <ToastContainer />
            
            <form className="mgr-form" onSubmit={(e) => { FormSubmitted(e) }}>
                <h2>Create Manager</h2>

                <input
                    type="email"
                    placeholder="Manager Email"
                    value={formData.ManagerEmail}
                    onChange={e => setFormData({ ...formData, ManagerEmail: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Manager Password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />

                <select
                    value={formData.ServiceName}
                    onChange={e => setFormData({ ...formData, ServiceName: e.target.value })}
                >
                    <option value="">Select Service</option>
                    {OtherServices?.map(s => (
                        <option key={s.ServiceId} value={s.ServiceName}>
                            {s.ServiceName}
                        </option>
                    ))}
                </select>

                <select
                    value={formData.ServiceType}
                    onChange={e => setFormData({ ...formData, ServiceType: e.target.value })}
                >
                    <option value="">Select Service Type</option>
                    <option value="SCHOOL">School</option>
                    <option value="COLLEGE">College</option>
                    <option value="PHARMACY">Pharmacy</option>
                    <option value="SPECIALIST">Specialist</option>
                </select>
                <button type="submit">Create Manager</button>
            </form>
        </section>
    )
}