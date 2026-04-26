import React, { useState } from "react";
import { addHealthService, deleteHealthService, updateHealthService } from "../../../../ApiCalls/HealthDashboardApiCall";
import { Plus, Edit2, Trash2, Heart, Award, CheckCircle2, Layout } from "lucide-react";

const ManageServices = ({ data }) => {
    const [services, setServices] = useState(data.services || []);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", icon: "" });

    const handleAdd = (e) => {
        e.preventDefault();
        if (editingId) {
            updateHealthService(editingId, formData, setServices);
            setEditingId(null);
        } else {
            addHealthService(formData, setServices);
        }
        setFormData({ title: "", description: "", icon: "" });
        setShowForm(false);
    };

    const handleEdit = (srv) => {
        setFormData({ title: srv.title, description: srv.description, icon: srv.icon || "" });
        setEditingId(srv._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if(window.confirm("Delete this service?")) {
            deleteHealthService(id, setServices);
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <Layout className="header-icon" />
                    <h3>Pharmacy Services & Highlights</h3>
                </div>
                <button className="hlth-ds-btn-add" onClick={() => {setShowForm(true); setEditingId(null); setFormData({title:"", description:"", icon:""});}}>
                    <Plus size={18} /> Add New Service
                </button>
            </div>

            {showForm && (
                <div className="hlth-ds-modal-overlay">
                    <div className="hlth-ds-modal animate-up">
                        <div className="modal-header">
                            <h4>{editingId ? "Edit Service Details" : "Register New Service"}</h4>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="hlth-ds-input-group">
                                <label>Service Title</label>
                                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. 24/7 Home Delivery" />
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Provide a brief description of this service..."></textarea>
                            </div>
                            <div className="hlth-ds-modal-actions">
                                <button type="button" className="hlth-ds-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="hlth-ds-btn-save">{editingId ? "Update Service" : "Add Service"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="hlth-ds-card-grid animate-fade">
                {services.length > 0 ? services.map(srv => (
                    <div key={srv._id} className="hlth-ds-item-card">
                        <div className="hlth-ds-card-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ background: '#f0fdf4', padding: '0.5rem', borderRadius: '8px' }}>
                                    <CheckCircle2 size={20} color="#1f8e5c" />
                                </div>
                                <h4 style={{ margin: 0 }}>{srv.title}</h4>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>{srv.description}</p>
                        </div>
                        <div className="hlth-ds-card-actions">
                            <button onClick={() => handleEdit(srv)} className="hlth-ds-action-btn edit" title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(srv._id)} className="hlth-ds-action-btn delete" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                )) : (
                    <div className="hlth-ds-empty hlth-ds-full-row">
                        <Award size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>No custom services added yet. Add highlights like "Home Delivery" or "Blood Testing".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageServices;
