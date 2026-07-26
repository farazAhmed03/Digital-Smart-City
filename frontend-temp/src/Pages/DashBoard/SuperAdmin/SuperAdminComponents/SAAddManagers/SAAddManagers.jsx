import React, { useState } from "react";
import "./SAAddManagers.css";
import { CreateSAManager, SAManagerDelete } from "../../../../../ApiCalls/SuperAdminApiCall";
import { ToastContainer } from "react-toastify";

export const SAAddManagerForm = ({ SAManagers, setSAManagers }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        AccessTo: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        CreateSAManager(formData, setSAManagers);

        // reset form
        setFormData({
            email: "",
            password: "",
            AccessTo: ""
        });
    };

    return (
        <section>
            <div className="SMT_wrapper">
                <h2 className="SMT_title">Service Manager Assignment</h2>

                <table className="SMT_table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Manager Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {SAManagers?.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="SMT_empty">
                                    No managers assigned yet
                                </td>
                            </tr>
                        ) : (
                            SAManagers?.map((m, i) => (
                                <tr key={i}>
                                    <td>
                                        <span className={`SMT_badge ${m.AccessTo.toLowerCase()}`}>
                                            {m.AccessTo}
                                        </span>
                                    </td>

                                    <td>{m.email}</td>

                                    <td>
                                        <button
                                            className="SMT_delete_btn"
                                            onClick={() => SAManagerDelete(m.email, setSAManagers)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="AM_form_wrapper">
                <ToastContainer />
                <h2 className="AM_title">Add Manager</h2>

                <form className="AM_form" onSubmit={handleSubmit}>

                    <div className="AM_field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="manager@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="AM_field">
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

                    <div className="AM_field">
                        <label>Category</label>
                        <select
                            name="AccessTo"
                            value={formData.AccessTo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Education">Education</option>
                            <option value="Health">Health</option>
                            <option value="Food">Food</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>

                    <button className="AM_submit_btn" type="submit">
                        Add Manager
                    </button>

                </form>
            </div>
        </section>
    );
};