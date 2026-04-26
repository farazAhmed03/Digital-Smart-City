import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiClock, FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import API_BASE_URL from "../../../../config";

const ManageAvailableSlots = ({ data }) => {
    const [slots, setSlots] = useState(data.AvailableSlots || []);
    const [newSlot, setNewSlot] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const mainURL = API_BASE_URL;

    const fetchSlots = async () => {
        try {
            const res = await axios.get(`${mainURL}/api/health/slots`, { withCredentials: true });
            if (res.data.success) {
                setSlots(res.data.slots);
            }
        } catch (err) {
            console.error("Failed to fetch slots");
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const addSlot = () => {
        if (!newSlot) return;
        if (slots.includes(newSlot)) {
            toast.warn("Slot already exists");
            return;
        }
        setSlots([...slots, newSlot]);
        setNewSlot("");
    };

    const removeSlot = (index) => {
        setSlots(slots.filter((_, i) => i !== index));
    };

    const saveSlots = async () => {
        setIsSaving(true);
        try {
            const res = await axios.put(`${mainURL}/api/health/slots`, { slots }, { withCredentials: true });
            if (res.data.success) {
                toast.success("Slots updated successfully");
            }
        } catch (err) {
            toast.error("Failed to update slots");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <FiClock className="header-icon" />
                    <h3>Manage Appointment Slots</h3>
                </div>
            </div>

            <section className="hlth-ds-form-section animate-up">
                <div className="hlth-ds-input-group" style={{ marginBottom: "20px" }}>
                    <label>Add New Slot (e.g. 10:00 AM)</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input 
                            type="text" 
                            value={newSlot} 
                            onChange={(e) => setNewSlot(e.target.value)}
                            placeholder="e.g. 10:30 AM"
                            className="hlth-ds-input"
                        />
                        <button onClick={addSlot} className="hlth-ds-btn-save" style={{ width: "auto" }}>
                            <FiPlus /> Add
                        </button>
                    </div>
                </div>

                <div className="hlth-ds-slots-grid animate-fade">
                    {slots.map((slot, index) => (
                        <div key={index} className="hlth-ds-slot-pill">
                            <span>{slot}</span>
                            <FiTrash2 
                                className="delete-icon"
                                onClick={() => removeSlot(index)} 
                            />
                        </div>
                    ))}
                </div>

                {slots.length === 0 && (
                    <p style={{ textAlign: "center", opacity: 0.5, marginTop: "20px" }}>No slots added yet.</p>
                )}

                <div className="hlth-ds-actions-bar no-border" style={{ marginTop: "30px" }}>
                    <button onClick={saveSlots} className="hlth-ds-btn-save" disabled={isSaving}>
                        <FiSave /> {isSaving ? "Saving..." : "Save All Slots"}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ManageAvailableSlots;
