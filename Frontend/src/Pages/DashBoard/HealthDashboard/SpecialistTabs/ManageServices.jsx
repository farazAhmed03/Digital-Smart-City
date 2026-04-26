import React, { useState, useEffect } from "react";
import { addHealthService, deleteHealthService, getHealthServices, updateHealthService } from "../../../../ApiCalls/HealthDashboardApiCall";
import { FiActivity, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const ManageServices = ({ data }) => {
    // For specialists, the field is 'Services' (capital S in schema traditionally, let's normalize)
    const [services, setServices] = useState(data.Services || []);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", price: "", duration: "", icon: "" });

    useEffect(() => {
        // If services were just created in backend or missing from prop, refetch
        if (services.length === 0) {
            getHealthServices(setServices);
        }
    }, []);

    const handleAdd = (e) => {
        e.preventDefault();
        if (editingId) {
            updateHealthService(editingId, formData, setServices);
            setEditingId(null);
        } else {
            addHealthService(formData, setServices);
        }
        setFormData({ title: "", description: "", price: "", duration: "", icon: "", status: "ACTIVE" });
        setShowForm(false);
    };

    const handleEdit = (srv) => {
        setFormData({
            title: srv.title,
            description: srv.description,
            price: srv.price || "",
            duration: srv.duration || "",
            icon: srv.icon || "",
            status: srv.status || "ACTIVE"
        });
        setEditingId(srv._id);
        setShowForm(true);
    };

    const handleDelete = (id, isDefault) => {
        if (isDefault) {
            alert("Default services cannot be deleted.");
            return;
        }
        if (window.confirm("Delete this medical service?")) {
            deleteHealthService(id, setServices);
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <FiActivity className="header-icon" />
                    <h3>Medical Specializations & Services</h3>
                </div>
                <button className="hlth-ds-btn-add" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: "", description: "", price: "", duration: "", icon: "", status: "ACTIVE" }); }}>
                    <FiPlus /> Add Service
                </button>
            </div>

            {showForm && (
                <div className="hlth-ds-modal-overlay">
                    <div className="hlth-ds-modal animate-up">
                        <div className="modal-header">
                            <h4>{editingId ? "Edit Medical Service" : "Add New Medical Service"}</h4>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="hlth-ds-input-group">
                                <label>Service Title</label>
                                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Heart Consultation" disabled={editingId && services.find(s => s._id === editingId)?.isDefault} />
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Brief detail about this procedure or service..."></textarea>
                            </div>
                            <div className="hlth-ds-grid">
                                <div className="hlth-ds-input-group">
                                    <label>Consultation Fee (Optional)</label>
                                    <input value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="e.g. 1500" />
                                </div>
                                <div className="hlth-ds-input-group">
                                    <label>Duration (Optional)</label>
                                    <input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 30 mins" />
                                </div>
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Service Status</label>
                                <select
                                    className="hlth-ds-input"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="ACTIVE">Available (Active)</option>
                                    <option value="INACTIVE">Closed (Inactive)</option>
                                </select>
                            </div>
                            <div className="hlth-ds-modal-actions">
                                <button type="button" className="hlth-ds-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="hlth-ds-btn-save">Save Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="hlth-ds-card-grid animate-fade">
                {services.length > 0 ? services.map(srv => {
                    const isInactive = srv.status === "INACTIVE";
                    return (
                        <div key={srv._id} className={`hlth-ds-item-card ${isInactive ? 'hlth-ds-item-card--inactive' : ''}`}>
                            <div className="hlth-ds-card-info">
                                <div className="hlth-ds-card-title-row">
                                    <h4>{srv.title}</h4>
                                    <span className={`status-badge ${srv.status?.toLowerCase() || 'active'}`}>
                                        {srv.status === "INACTIVE" ? "Closed" : "Available"}
                                    </span>
                                </div>
                                <p>{srv.description}</p>
                                {(srv.price || srv.duration) && (
                                    <div className="hlth-ds-card-meta">
                                        {srv.price && <span className="price-tag">Rs. {srv.price}</span>}
                                        {srv.duration && <span className="duration-tag">{srv.duration}</span>}
                                        {srv.isDefault && <span className="default-tag">Default</span>}
                                    </div>
                                )}
                            </div>
                            <div className="hlth-ds-card-actions">
                                <button onClick={() => handleEdit(srv)} className="hlth-ds-action-btn edit"><FiEdit2 /></button>
                                {!srv.isDefault && (
                                    <button onClick={() => handleDelete(srv._id, srv.isDefault)} className="hlth-ds-action-btn delete"><FiTrash2 /></button>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="hlth-ds-empty hlth-ds-full-row">
                        <FiActivity size={50} style={{ opacity: 0.2, marginBottom: "15px" }} />
                        <p>No medical services added yet. Click "+ Add Service" to start.</p>
                    </div>
                )}
            </div>

            <style jsx="true">{`
                .hlth-ds-card-title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .status-badge {
                    font-size: 10px;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .status-badge.active {
                    background: #dcfce7;
                    color: #166534;
                }
                .status-badge.inactive {
                    background: #fee2e2;
                    color: #991b1b;
                }
                .hlth-ds-item-card--inactive {
                    opacity: 0.7;
                    border-left: 4px solid #ef4444;
                }
                .default-tag {
                    font-size: 10px;
                    color: #6366f1;
                    background: #e0e7ff;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-left: 8px;
                }
                .hlth-ds-input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    margin-top: 4px;
                }
            `}</style>
        </div>
    );
};

export default ManageServices;
