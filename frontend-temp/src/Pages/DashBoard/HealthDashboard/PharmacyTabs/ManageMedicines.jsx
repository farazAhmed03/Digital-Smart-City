import React, { useState } from "react";
import { addPharmacyMedicine, updatePharmacyMedicine, deletePharmacyMedicine } from "../../../../ApiCalls/HealthDashboardApiCall";
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiSearch } from "react-icons/fi";

const ManageMedicines = ({ data }) => {
    const [medicines, setMedicines] = useState(data.Medicines || []);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: "", category: "", price: "", stock: "In Stock" });
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId === null) {
            addPharmacyMedicine(formData, setMedicines);
        } else {
            updatePharmacyMedicine(editingId, formData, setMedicines);
            setEditingId(null);
        }
        setShowForm(false);
        setFormData({ name: "", category: "", price: "", stock: "In Stock" });
    };

    const handleEdit = (i) => {
        setFormData({ name: medicines[i].name, category: medicines[i].category, price: medicines[i].price, stock: medicines[i].stock });
        setEditingId(i);
        setShowForm(true);
    };

    const handleDelete = (idx) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            deletePharmacyMedicine(idx, setMedicines);
        }
    };

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <FiPackage className="header-icon" />
                    <h3>Medicine Inventory</h3>
                </div>
                <div className="header-actions">
                    <div className="hlth-ds-search-bar">
                        <FiSearch />
                        <input type="text" placeholder="Search inventory..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <button className="hlth-ds-btn-add" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", category: "", price: "", stock: "In Stock" }); }}>
                        <FiPlus /> Add New Medicine
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="hlth-ds-modal-overlay">
                    <div className="hlth-ds-modal animate-up">
                        <div className="modal-header">
                            <h4>{editingId ? "Edit Medicine Details" : "Register New Medicine"}</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="hlth-ds-input-group">
                                <label>Medicine Name</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Panadol 500mg" />
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Category</label>
                                <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Painkillers" />
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Price (PKR)</label>
                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required placeholder="0.00" />
                            </div>
                            <div className="hlth-ds-input-group">
                                <label>Stock Status</label>
                                <select value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })}>
                                    <option value="In Stock">In Stock (Available)</option>
                                    <option value="Out of Stock">Out of Stock (Depleted)</option>
                                </select>
                            </div>
                            <div className="hlth-ds-modal-actions">
                                <button type="button" className="hlth-ds-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="hlth-ds-btn-save">{editingId !== null ? "Update Medicine" : "Add to Inventory"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="hlth-ds-table-container animate-fade">
                <table>
                    <thead>
                        <tr>
                            <th>Medicine Name</th>
                            <th>Category</th>
                            <th>Unit Price</th>
                            <th>Availability</th>
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.length > 0 ? filteredMedicines.map((med, i) => (
                            <tr key={i}>
                                <td className="font-bold">{med.name}</td>
                                <td><span className="category-tag">{med.category}</span></td>
                                <td className="price-tag">Rs. {med.price}</td>
                                <td>
                                    <span className={`status-badge ${med.stock === "In Stock" ? "available" : "unavailable"}`}>
                                        {med.stock}
                                    </span>
                                </td>
                                <td>
                                    <div className="hlth-ds-row-actions">
                                        <button onClick={() => handleEdit(i)} className="hlth-ds-action-btn edit" title="Edit"><FiEdit2 /></button>
                                        <button onClick={() => handleDelete(i)} className="hlth-ds-action-btn delete" title="Delete"><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="hlth-ds-empty">
                                    <FiPackage size={40} style={{ marginBottom: "10px", opacity: 0.5 }} />
                                    <p>No medicines found in your inventory.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageMedicines;
