import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

const mainURL = API_BASE_URL; // Centralized backend URL

/**
 * AUTHENTICATION
 */

export const logoutHealthAdmin = (navigate) => {
    axios.post(`${mainURL}/health/logout`, {}, { withCredentials: true })
        .then(() => {
            navigate("/health/admin");
        })
        .catch(err => console.error(err));
};

/**
 * DASHBOARD DATA
 */

export const getHealthDashboardData = (setDashboardData, setLoading, setAdminOtherServices) => {
    setLoading(true);
    axios.get(`${mainURL}/health/dashboard`, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setDashboardData({
                    ...res.data.data,
                    role: res.data.role
                });
                if (typeof setAdminOtherServices === "function") {
                    setAdminOtherServices(res.data.OtherServices);
                }
            } else {
                window.location.href = "/health/admin";
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => setLoading(false));
};

/**
 * SPECIALIST APIS
 */

export const getHealthServices = (setServices) => {
    axios.get(`${mainURL}/api/health/services`, { withCredentials: true })
        .then(res => res.data.success && setServices(res.data.services))
        .catch(err => console.error(err));
};

export const addHealthService = (serviceData, setServices) => {
    axios.post(`${mainURL}/api/health/services`, serviceData, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Service added");
                setServices(res.data.services);
            }
        });
};

export const updateHealthService = (id, serviceData, setServices) => {
    axios.put(`${mainURL}/api/health/services/${id}`, serviceData, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Service updated");
                setServices(res.data.services);
            }
        });
};

export const deleteHealthService = (id, setServices) => {
    axios.delete(`${mainURL}/api/health/services/${id}`, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Service deleted");
                setServices(res.data.services);
            }
        });
};

export const updateSpecialistTimings = (timings, setTimings) => {
    axios.put(`${mainURL}/health/specialist/timings`, { timings }, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Timings updated");
                setTimings(res.data.timings);
            }
        });
};

export const getSpecialistAppointments = (setAppointments) => {
    axios.get(`${mainURL}/api/specialist/appointments`, { withCredentials: true })
        .then(res => res.data.success && setAppointments(res.data.appointments))
        .catch(err => console.error(err));
};

export const updateSpecialistProfile = (formData, callback) => {
    axios.put(`${mainURL}/update/specialist/profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(res => {
            if (res.data.success) {
                toast.success("Specialist profile updated successfully");
                if (callback) callback();
            } else {
                toast.error(res.data.message);
                if (callback) callback();
            }
        })
        .catch(err => {
            toast.error("Failed to update profile");
            console.error(err);
            if (callback) callback();
        });
};

export const updateSpecialistAboutSec = (data, callback) => {
    axios.put(`${mainURL}/api/specialist/AboutSec`, data, {
        withCredentials: true
    })
        .then(res => {
            if (res.data.success) {
                toast.success("Specialist About Section updated successfully");
                if (callback) callback();
            } else {
                toast.error(res.data.message);
                if (callback) callback();
            }
        })
        .catch(err => {
            toast.error("Failed to update About Section");
            console.error(err);
            if (callback) callback();
        });
};

export const updateSpecialistEduSec = async (editingId, formData, setEducation) => {
    try {
        if (editingId) {
            const res = await axios.put(`${mainURL}/api/specialist/education/${editingId}`, formData, { withCredentials: true });
            if (res.data.success) {
                setEducation(res.data.education);
                toast.success("Education record updated");
            }
        } else {
            const res = await axios.post(`${mainURL}/api/specialist/education`, formData, { withCredentials: true });
            if (res.data.success) {
                setEducation(res.data.education);
                toast.success("Education record added");
            }
        }
    } catch (err) {
        toast.error("Failed to save education record");
    }
}

/**
 * PHARMACY APIS
 */

export const addPharmacyMedicine = (medicineData, setMedicines) => {
    axios.post(`${mainURL}/api/pharmacy/medicines`, medicineData, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Medicine added");
                setMedicines(res.data.medicines);
            }
        });
};

export const updatePharmacyMedicine = (id, medicineData, setMedicines) => {
    axios.put(`${mainURL}/api/pharmacy/medicines/${id}`, medicineData, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Medicine updated");
                setMedicines(res.data.medicines);
            }
        });
};

export const deletePharmacyMedicine = (idx, setMedicines) => {
    axios.delete(`${mainURL}/api/pharmacy/medicines/${idx}`, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Medicine deleted");
                setMedicines(res.data.medicines);
            }
        });
};

export const deleteHealthReview = (id, setReviews) => {
    axios.delete(`${mainURL}/api/health/reviews/${id}`, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Review deleted");
                setReviews(res.data.reviews);
            }
        })
        .catch(err => {
            toast.error("Failed to delete review");
            console.error(err);
        });
};

export const updatePharmacyProfile = (formData, callback) => {
    axios.put(`${mainURL}/update/pharmacy/profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(res => {
            if (res.data.success) {
                toast.success("Profile updated successfully");
                if (callback) callback();
            } else {
                toast.error(res.data.message);
                if (callback) callback();
            }
        })
        .catch(err => {
            toast.error("Failed to update profile");
            console.error(err);
            if (callback) callback();
        });
};

export const updateOrderStatus = (id, status, setOrders) => {
    axios.put(`${mainURL}/api/pharmacy/orders/${id}`, { status }, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Order status updated");
                setOrders(res.data.orders);
            }
        });
};

export const deleteOrder = (id, setOrders) => {
    axios.delete(`${mainURL}/api/pharmacy/orders/${id}`, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                toast.success("Order deleted");
                setOrders(res.data.orders);
            }
        });
};

export const placePharmacyOrder = async (id, orderData) => {
    try {
        const formData = new FormData();
        Object.keys(orderData).forEach(key => {
            if (orderData[key] !== null && orderData[key] !== undefined) {
                formData.append(key, orderData[key]);
            }
        });
        // Remove duplicate if id is already in orderData or if not needed twice
        const res = await axios.post(`${mainURL}/api/pharmacy/order/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
            toast.success("Order placed successfully!");
            return true;
        } else {
            toast.error(res.data.message);
            return false;
        }
    } catch (err) {
        toast.error("Failed to place order");
        console.error(err);
        return false;
    }
};
