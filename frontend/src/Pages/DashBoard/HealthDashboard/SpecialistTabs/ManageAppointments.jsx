import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiCalendar, FiCheck, FiX, FiTrash2, FiUser, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import API_BASE_URL from "../../../../config";

const ManageAppointments = ({ data }) => {
    const [appointments, setAppointments] = useState(data.Appointments || []);
    const mainURL = API_BASE_URL;

    const [showModal, setShowModal] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedAppType, setSelectedAppType] = useState("IN-CLINIC");
    const [confirmData, setConfirmData] = useState({ appointmentNumber: "", appointmentTime: "", meetingLink: "" });

    const openConfirmModal = (id, type) => {
        setSelectedAppId(id);
        setSelectedAppType(type);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (!confirmData.appointmentNumber || !confirmData.appointmentTime) {
            toast.warn("Please enter both number and time");
            return;
        }

        try {
            const res = await axios.put(`${mainURL}/api/specialist/appointments/status/${selectedAppId}`, {
                status: "Confirmed",
                appointmentNumber: confirmData.appointmentNumber,
                appointmentTime: confirmData.appointmentTime,
                meetingLink: confirmData.meetingLink
            }, { withCredentials: true });

            if (res.data.success) {
                setAppointments(res.data.appointments);
                toast.success("Appointment Confirmed & Notification Sent");
                setShowModal(false);
                setConfirmData({ appointmentNumber: "", appointmentTime: "", meetingLink: "" });
            }
        } catch (err) {
            toast.error("Failed to confirm appointment");
        }
    };

    const updateStatus = async (id, status, type) => {
        if (status === "Confirmed") {
            openConfirmModal(id, type);
            return;
        }

        try {
            const res = await axios.put(`${mainURL}/api/specialist/appointments/status/${id}`, { status }, { withCredentials: true });
            if (res.data.success) {
                setAppointments(res.data.appointments);
                toast.success(`Appointment ${status}`);
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const deleteAppointment = async (id) => {
        if (window.confirm("Permanently delete this appointment request?")) {
            try {
                const res = await axios.delete(`${mainURL}/api/specialist/appointments/${id}`, { withCredentials: true });
                if (res.data.success) {
                    setAppointments(res.data.appointments);
                    toast.success("Appointment deleted");
                }
            } catch (err) {
                toast.error("Deletion failed");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Confirmed": return "available";
            case "Rejected": return "unavailable";
            case "Completed": return "price-tag";
            default: return "pending-badge";
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <div className="header-left">
                    <FiCalendar className="header-icon" />
                    <h3>Appointment Requests</h3>
                </div>
            </div>

            <div className="hlth-ds-grid animate-fade">
                {appointments.length > 0 ? appointments.map((app) => (
                    <div className="hlth-ds-appointment-card" key={app._id}>
                        <div className="card-header">
                            <div className={`status-pill ${getStatusColor(app.status)}`}>{app.status}</div>
                            <div className={`cons-badge ${app.consultationType === "ONLINE" ? "online" : "clinic"}`}>
                                {app.consultationType || "IN-CLINIC"}
                            </div>
                            <span className="app-date">{app.date} {app.time && `| ${app.time}`}</span>
                            {app.appointmentNumber && <span className="app-num">#{app.appointmentNumber}</span>}
                        </div>
                        <div className="card-body">
                            <h5><FiUser /> {app.patientName}</h5>
                            <p><FiMail /> {app.email}</p>
                            <p><FiPhone /> {app.phone}</p>
                            {app.message && (
                                <div className="app-message">
                                    <FiMessageSquare />
                                    <span>{app.message}</span>
                                </div>
                            )}
                        </div>
                        <div className="card-footer">
                            {app.status === "Pending" && (
                                <>
                                    <button onClick={() => updateStatus(app._id, "Confirmed", app.consultationType)} className="btn-confirm"><FiCheck /> Confirm</button>
                                    <button onClick={() => updateStatus(app._id, "Rejected")} className="btn-reject"><FiX /> Reject</button>
                                </>
                            )}
                            <button onClick={() => deleteAppointment(app._id)} className="btn-delete"><FiTrash2 /></button>
                        </div>
                    </div>
                )) : (
                    <div className="hlth-ds-empty hlth-ds-full-row">
                        <FiCalendar size={50} style={{ opacity: 0.2, marginBottom: "15px" }} />
                        <p>No appointment requests yet.</p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="hlth-ds-modal-overlay">
                    <div className="hlth-ds-modal">
                        <h4>Confirm Appointment</h4>
                        <div className="hlth-ds-input-group">
                            <label>Appointment Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 1"
                                value={confirmData.appointmentNumber}
                                onChange={(e) => setConfirmData({ ...confirmData, appointmentNumber: e.target.value })}
                            />
                        </div>
                        <div className="hlth-ds-input-group">
                            <label>Appointment Time</label>
                            <input
                                type="text"
                                placeholder="e.g. 10:30 AM"
                                value={confirmData.appointmentTime}
                                onChange={(e) => setConfirmData({ ...confirmData, appointmentTime: e.target.value })}
                            />
                        </div>
                        {selectedAppType === "ONLINE" && (
                            <div className="hlth-ds-input-group">
                                <label>Meeting Link (Zoom/Google Meet)</label>
                                <input
                                    type="text"
                                    placeholder="https://zoom.us/j/..."
                                    value={confirmData.meetingLink}
                                    onChange={(e) => setConfirmData({ ...confirmData, meetingLink: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="hlth-ds-modal-actions">
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleConfirm} className="btn-primary">Confirm & Notify</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAppointments;
