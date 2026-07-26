import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen } from "react-icons/fi";
import { updateSpecialistEduSec } from "../../../../ApiCalls/HealthDashboardApiCall";
import API_BASE_URL from "../../../../config";

const ManageEducation = ({ data }) => {
    const [education, setEducation] = useState(data.education || []);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ degree: "", institution: "", year: "" });
    const mainURL = API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        updateSpecialistEduSec(editingId, formData, setEducation);
        setShowForm(false);
        setEditingId(null);
        setFormData({ degree: "", institution: "", year: "" });
    };

    const handleEdit = (edu) => {
        setFormData({ degree: edu.degree, institution: edu.institution, year: edu.year });
        setEditingId(edu._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this education record?")) {
            try {
                const res = await axios.delete(`${mainURL}/api/specialist/education/${id}`, { withCredentials: true });
                if (res.data.success) {
                    setEducation(res.data.education);
                    toast.success("Education record deleted");
                }
            } catch (err) {
                toast.error("Deletion failed");
            }
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <FiBookOpen className="header-icon" />
                    <h3>Education & Certifications</h3>
                </div>
                <button className="hlth-ds-btn-add" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ degree: "", institution: "", year: "" }); }}>
                    <FiPlus /> Add Record
                </button>
            </div>

            {showForm && (
                <div className="hlth-ds-modal-overlay">
                    <div className="hlth-ds-modal animate-up">
                        <div className="modal-header">
                            <h4>{editingId ? "Edit Education Record" : "Add Education Record"}</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="hlth-ds-input-group">
                                <label>Degree / Certificate</label>
                                <input value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} required placeholder="e.g. MBBS" />
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Institution</label>
                                <input value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} required placeholder="e.g. KMU Peshawar" />
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Year of Completion</label>
                                <input value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} placeholder="e.g. 2015" />
                            </div>
                            <div className="hlth-ds-modal-actions">
                                <button type="button" className="hlth-ds-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="hlth-ds-btn-save">{editingId ? "Update Record" : "Save Record"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="hlth-ds-table-container animate-fade">
                <table>
                    <thead>
                        <tr>
                            <th>Degree</th>
                            <th>Institution</th>
                            <th>Year</th>
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {education.length > 0 ? education.map((edu) => (
                            <tr key={edu._id}>
                                <td className="font-bold">{edu.degree}</td>
                                <td>{edu.institution}</td>
                                <td>{edu.year}</td>
                                <td>
                                    <div className="hlth-ds-row-actions">
                                        <button onClick={() => handleEdit(edu)} className="hlth-ds-action-btn edit"><FiEdit2 /></button>
                                        <button onClick={() => handleDelete(edu._id)} className="hlth-ds-action-btn delete"><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="hlth-ds-empty">No education records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageEducation;
