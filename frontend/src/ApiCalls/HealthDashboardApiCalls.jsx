import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";
export const maniURL = API_BASE_URL; // Matching MedicalApiCalls

const handleHealthRedirect = (res) => {
    const serviceType = res.data.ServiceType;
    if (["CLINIC", "PHARMACY", "SPECIALIST"].includes(serviceType)) {
        window.location.href = "/hospital/dashboard";
    } else {
        window.location.href = "/hospital/admin";
    }
};

export const VerifyHealthAdmin = (email, password, navigate) => {
    axios.post(`${maniURL}/health/admin/login`, { email, password, sector: "HEALTH" }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success("Login successful!");
                navigate("/health/dashboard");
            } else {
                navigate("/health/admin");
            }
        })
        .catch((err) => {
            console.error(err);
            navigate("/health/admin");
        });
};

export const GetHealthDashBoardDta = (setDashBoardDta, setLoading, setAdminOtherServices) => {
    axios.get(`${maniURL}/dashboard/admin/dashboard`, { withCredentials: true })
        .then((res) => {
            console.log("1", res.data);
            if (res.data.success) {
                setDashBoardDta(res.data.data);
                setLoading(false);
                setAdminOtherServices(res.data.data.otherServices);
            } else {
                window.location.href = "/health/admin";
            }
        }).catch((err) => {
            console.log(err);
        })
}

export const AddMedicineApi = (formData, setMedicines, setIsSubmitting) => {
    setIsSubmitting(true);
    axios.post(`${maniURL}/dashboard/addMedicine`, formData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success("Medicine added successfully!");
                setMedicines(prev => [...prev, formData]);
                setIsSubmitting(false);
            } else {
                setIsSubmitting(false);
                toast.error(res.data.message);
            }
        })
        .catch((err) => {
            console.error(err);
            toast.error("Failed to add medicine");
        });
}

export const DeleteMedicineApi = (id, setMedicines) => {
    axios.post(`${maniURL}/dashboard/deleteMedicine`, { id }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success("Medicine deleted successfully!");
                setMedicines(prev => prev.filter(med => med._id !== id));
            } else {

                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to delete medicine");
        });
}

export const UpdateOrderStatusApi = async (orderId, status, setOrders) => {
    try {
        const res = await axios.post(`${maniURL}/dashboard/UpdateOrderStatus`, { orderId, status }, { withCredentials: true });
        if (res.data.success) {
            toast.success("Order status updated!");
            if (setOrders && res.data.orders) {
                setOrders(res.data.orders);
            }
        } else {
            toast.error(res.data.message || "Failed to update order status");
        }
    } catch (err) {
        console.error("UpdateOrderStatusApi error:", err);
        toast.error("Something went wrong updating order status");
    }
}

export const UpdateAppointmentStatusApi = async (appointmentId, status, reason, setAppointments) => {
    try {
        const res = await axios.post(`${maniURL}/dashboard/UpdateAppointmentStatus`, { appointmentId, status, reason }, { withCredentials: true });
        if (res.data.success) {
            toast.success(`Appointment ${status.toLowerCase()}!`);
            if (setAppointments) {
                setAppointments(prev => prev.map(a => a._id === appointmentId ? { ...a, status, reason: reason || a.reason } : a));
            }
        } else {
            toast.error(res.data.message || "Failed to update appointment");
        }
    } catch (err) {
        console.error("UpdateAppointmentStatusApi error:", err);
        toast.error("Something went wrong updating appointment");
    }
}

export const UpdateAvailabilityApi = async (availability, setAvailability) => {
    try {
        const res = await axios.post(`${maniURL}/dashboard/UpdateAvailability`, { availability }, { withCredentials: true });
        if (res.data.success) {
            toast.success("Availability updated successfully!");
            if (setAvailability) setAvailability(availability);
        } else {
            toast.error(res.data.message || "Failed to update availability");
        }
    } catch (err) {
        console.error("UpdateAvailabilityApi error:", err);
        toast.error("Something went wrong updating availability");
    }
}