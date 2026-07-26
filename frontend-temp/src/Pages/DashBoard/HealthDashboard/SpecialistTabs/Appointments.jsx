import React, { useEffect, useState } from "react";
import { getSpecialistAppointments } from "../../../../ApiCalls/HealthDashboardApiCall";

const SpecialistAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSpecialistAppointments((data) => {
            setAppointments(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading appointments...</div>;

    return (
        <div className="appointments-tab">
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Upcoming Appointments</h3>
                <span style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>Total: {appointments.length}</span>
            </div>

            <div style={{ background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #eee" }}>
                        <tr>
                            <th style={{ padding: "15px" }}>Patient Name</th>
                            <th style={{ padding: "15px" }}>Date</th>
                            <th style={{ padding: "15px" }}>Time Slot</th>
                            <th style={{ padding: "15px" }}>Status</th>
                            <th style={{ padding: "15px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? appointments.map((appt) => (
                            <tr key={appt._id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "15px" }}>
                                    <div>
                                        <div style={{ fontWeight: "600" }}>{appt.PatientName}</div>
                                        <div style={{ fontSize: "0.8rem", color: "#95a5a6" }}>{appt.PatientPhone}</div>
                                    </div>
                                </td>
                                <td style={{ padding: "15px" }}>{new Date(appt.AppointmentDate).toLocaleDateString()}</td>
                                <td style={{ padding: "15px" }}>{appt.TimeSlot}</td>
                                <td style={{ padding: "15px" }}>
                                    <span style={{ 
                                        padding: "4px 10px", borderRadius: "15px", fontSize: "0.8rem",
                                        backgroundColor: appt.Status === "Confirmed" ? "#e8f8f5" : "#fef9e7",
                                        color: appt.Status === "Confirmed" ? "#1abc9c" : "#f1c40f"
                                    }}>
                                        {appt.Status}
                                    </span>
                                </td>
                                <td style={{ padding: "15px" }}>
                                    <button style={{ background: "none", border: "none", color: "#3498db", cursor: "pointer", marginRight: "10px" }}>View</button>
                                    <button style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer" }}>Cancel</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#95a5a6" }}>
                                    No appointments scheduled yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SpecialistAppointments;
