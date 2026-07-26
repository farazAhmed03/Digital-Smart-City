import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

const mainURL = API_BASE_URL;

/* =========================================================
   🔹 DOCTOR REGISTRATION & AUTHENTICATION
========================================================= */

export const DoctorRegisterRequest = async (formData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`/medical/doctor/register-request`, formData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success(res.data.message || "Doctor request submitted successfully!");
            return { success: true };
        } else {
            toast.error(res.data.message || "Registration failed");
            return { success: false };
        }
    } catch (err) {
        console.error("DoctorRegisterRequest Error:", err);
        toast.error("Something went wrong");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const DoctorVerifyOtp = async (email, otp, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/doctor/verify-otp`, { email, otp }, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Doctor registration successful!");
            return { success: true };
        } else {
            toast.error(res.data.message || "OTP verification failed");
            return { success: false };
        }
    } catch (err) {
        console.error("DoctorVerifyOtp Error:", err);
        toast.error("Verification failed");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const DoctorLogin = async (formData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/doctor/login`, formData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Login successful!");
            return { success: true, user: res.data.user };
        } else {
            toast.error(res.data.message || "Login failed");
            return { success: false };
        }
    } catch (err) {
        console.error("DoctorLogin Error:", err);
        toast.error("Login error");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const DoctorLogout = async () => {
    try {
        const res = await axios.post(`${mainURL}/medical/doctor/logout`, {}, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Logged out successfully");
            return { success: true };
        }
    } catch (err) {
        console.error("DoctorLogout Error:", err);
    }
};

export const GetDoctorProfile = async () => {
    try {
        const res = await axios.get(`${mainURL}/medical/doctor/profile`, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("GetDoctorProfile Error:", err);
        return { success: false };
    }
};

export const UpdateDoctorProfile = async (formData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.put(`${mainURL}/medical/doctor/profile`, formData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Profile updated successfully");
        } else {
            toast.error(res.data.message || "Update failed");
        }
        return res.data;
    } catch (err) {
        console.error("UpdateDoctorProfile Error:", err);
        toast.error("Error updating profile");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

/* =========================================================
   🔹 PATIENT REGISTRATION & AUTHENTICATION
========================================================= */

export const PatientRegisterRequest = async (formData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/patient/register-request`, formData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("OTP sent to your email!");
            return { success: true, email: res.data.email };
        } else {
            toast.error(res.data.message || "Registration failed");
            return { success: false };
        }
    } catch (err) {
        console.error("PatientRegisterRequest Error:", err);
        toast.error("Something went wrong");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const PatientVerifyOtp = async (email, otp, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/patient/verify-otp`, { email, otp }, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Patient registration successful!");
            return { success: true };
        } else {
            toast.error(res.data.message || "OTP verification failed");
            return { success: false };
        }
    } catch (err) {
        console.error("PatientVerifyOtp Error:", err);
        toast.error("Verification failed");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const PatientLogin = async (formData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/patient/login`, formData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Login successful!");
            return { success: true, user: res.data.user };
        } else {
            toast.error(res.data.message || "Login failed");
            return { success: false };
        }
    } catch (err) {
        console.error("PatientLogin Error:", err);
        toast.error("Login error");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const PatientLogout = async () => {
    try {
        const res = await axios.post(`${mainURL}/medical/patient/logout`, {}, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Logged out successfully");
            return { success: true };
        }
    } catch (err) {
        console.error("PatientLogout Error:", err);
    }
};

export const GetPatientProfile = async () => {
    try {
        const res = await axios.get(`${mainURL}/medical/patient/profile`, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("GetPatientProfile Error:", err);
        return { success: false };
    }
};

export const UpdatePatientProfile = async (formData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.put(`${mainURL}/medical/patient/profile`, formData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Profile updated successfully");
        } else {
            toast.error(res.data.message || "Update failed");
        }
        return res.data;
    } catch (err) {
        console.error("UpdatePatientProfile Error:", err);
        toast.error("Error updating profile");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

/* =========================================================
   🔹 APPOINTMENT OPERATIONS
========================================================= */

export const BookAppointment = async (appointmentData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/patient/appointments/book`, appointmentData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Appointment booked successfully!");
        } else {
            toast.error(res.data.message || "Booking failed");
        }
        return res.data;
    } catch (err) {
        console.error("BookAppointment Error:", err);
        toast.error("Error booking appointment");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const GetPatientAppointments = async (page = 1, status = null) => {
    try {
        let url = `${mainURL}/medical/patient/appointments?page=${page}`;
        if (status) url += `&status=${status}`;

        const res = await axios.get(url, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("GetPatientAppointments Error:", err);
        return { success: false };
    }
};

export const GetDoctorAppointments = async (page = 1, date = null, status = null) => {
    try {
        let url = `${mainURL}/medical/doctor/appointments?page=${page}`;
        if (date) url += `&date=${date}`;
        if (status) url += `&status=${status}`;

        const res = await axios.get(url, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("GetDoctorAppointments Error:", err);
        return { success: false };
    }
};

export const ApproveAppointment = async (appointmentId, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/doctor/appointments/approve`, { appointmentId }, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Appointment approved!");
        } else {
            toast.error(res.data.message || "Approval failed");
        }
        return res.data;
    } catch (err) {
        console.error("ApproveAppointment Error:", err);
        toast.error("Error approving appointment");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const RejectAppointment = async (appointmentId, reason, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/doctor/appointments/reject`, { appointmentId, reason }, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Appointment rejected!");
        } else {
            toast.error(res.data.message || "Rejection failed");
        }
        return res.data;
    } catch (err) {
        console.error("RejectAppointment Error:", err);
        toast.error("Error rejecting appointment");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

/* =========================================================
   🔹 ONLINE CONSULTATION OPERATIONS
========================================================= */

export const BookOnlineConsultation = async (consultationData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/patient/consultations/book`, consultationData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Consultation booked successfully!");
        } else {
            toast.error(res.data.message || "Booking failed");
        }
        return res.data;
    } catch (err) {
        console.error("BookOnlineConsultation Error:", err);
        toast.error("Error booking consultation");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const GetPatientConsultations = async (page = 1) => {
    try {
        const res = await axios.get(`${mainURL}/medical/patient/consultations?page=${page}`, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("GetPatientConsultations Error:", err);
        return { success: false };
    }
};

export const GetDoctorConsultations = async (page = 1, status = null) => {
    try {
        let url = `${mainURL}/medical/doctor/consultations?page=${page}`;
        if (status) url += `&status=${status}`;

        const res = await axios.get(url, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("GetDoctorConsultations Error:", err);
        return { success: false };
    }
};

export const StartConsultation = async (consultationId, meetingLink, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/doctor/consultations/start`, { consultationId, meetingLink }, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Consultation started!");
        } else {
            toast.error(res.data.message || "Start failed");
        }
        return res.data;
    } catch (err) {
        console.error("StartConsultation Error:", err);
        toast.error("Error starting consultation");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const CompleteConsultation = async (consultationData, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/doctor/consultations/complete`, consultationData, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Consultation completed!");
        } else {
            toast.error(res.data.message || "Completion failed");
        }
        return res.data;
    } catch (err) {
        console.error("CompleteConsultation Error:", err);
        toast.error("Error completing consultation");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

/* =========================================================
   🔹 ADMIN OPERATIONS
========================================================= */

export const AdminGetDoctors = async (page = 1, status = "PENDING") => {
    try {
        const res = await axios.get(`${mainURL}/medical/admin/doctors?page=${page}&status=${status}`, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("AdminGetDoctors Error:", err);
        return { success: false };
    }
};

export const AdminApprovDoctor = async (doctorId, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/admin/doctors/approve`, { doctorId }, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Doctor approved successfully!");
        } else {
            toast.error(res.data.message || "Approval failed");
        }
        return res.data;
    } catch (err) {
        console.error("AdminApprovDoctor Error:", err);
        toast.error("Error approving doctor");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const AdminRejectDoctor = async (doctorId, reason, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.post(`${mainURL}/medical/admin/doctors/reject`, { doctorId, reason }, {
            withCredentials: true
        });
        if (res.data.success) {
            toast.success("Doctor rejected successfully!");
        } else {
            toast.error(res.data.message || "Rejection failed");
        }
        return res.data;
    } catch (err) {
        console.error("AdminRejectDoctor Error:", err);
        toast.error("Error rejecting doctor");
        return { success: false };
    } finally {
        setLoading(false);
    }
};

export const AdminGetAnalytics = async () => {
    try {
        const res = await axios.get(`${mainURL}/medical/admin/analytics`, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error("AdminGetAnalytics Error:", err);
        return { success: false };
    }
};

/* =========================================================
   🔹 PUBLIC OPERATIONS
========================================================= */

export const GetAvailableDoctors = async (specialization = null, page = 1) => {
    try {
        let url = `${mainURL}/medical/doctors/available?page=${page}`;
        if (specialization) url += `&specialization=${specialization}`;

        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.error("GetAvailableDoctors Error:", err);
        return { success: false };
    }
};

export const GetDoctorDetail = async (doctorId) => {
    try {
        const res = await axios.get(`${mainURL}/medical/doctors/${doctorId}`);
        return res.data;
    } catch (err) {
        console.error("GetDoctorDetail Error:", err);
        return { success: false };
    }
};
