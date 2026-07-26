import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

const API_URL = API_BASE_URL; // Centralized backend URL

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

/* =========================================================
   ADMIN API CALLS
========================================================= */

export const getAllCoursesAdmin = async (setCourses) => {
    try {
        const res = await axiosInstance.get("/admin/courses/all");
        if (res.data.success) {
            setCourses(res.data.data);
        }
    } catch (err) {
        console.error("getAllCoursesAdmin error:", err);
        toast.error("Failed to fetch courses.");
    }
};

export const createCourse = async (formData, setActiveTab, setCourses) => {
    try {
        const res = await axiosInstance.post("/admin/courses/create", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            setActiveTab("COURSES");
            getAllCoursesAdmin(setCourses);
        } else {
            toast.error(res.data.message);
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to create course.");
    }
};

export const updateCourse = async (id, formData, setActiveTab, setCourses) => {
    try {
        const res = await axiosInstance.put(`/admin/courses/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            setActiveTab("COURSES");
            getAllCoursesAdmin(setCourses);
        } else {
            toast.error(res.data.message);
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update course.");
    }
};

export const deleteCourse = async (id, setCourses) => {
    if (!window.confirm("Are you sure you want to permanently delete this course?")) return;
    try {
        const res = await axiosInstance.delete(`/admin/courses/delete/${id}`);
        if (res.data.success) {
            toast.success(res.data.message);
            getAllCoursesAdmin(setCourses);
        }
    } catch (err) {
        toast.error("Failed to delete course.");
    }
};

export const getAllEnrollments = async (setEnrollments) => {
    try {
        const res = await axiosInstance.get("/admin/enrollments/all");
        if (res.data.success) {
            setEnrollments(res.data.data);
        }
    } catch (err) {
        toast.error("Failed to fetch enrollments.");
    }
};

export const updateEnrollmentStatus = async (id, status, reason, setEnrollments) => {
    try {
        const res = await axiosInstance.put(`/admin/enrollments/status/${id}`, { status, rejectionReason: reason });
        if (res.data.success) {
            toast.success(res.data.message);
            getAllEnrollments(setEnrollments);
        }
    } catch (err) {
        toast.error("Failed to update status.");
    }
};

export const getOCSettings = async (setSettings) => {
    try {
        const res = await axiosInstance.get("/admin/oc-settings");
        if (res.data.success) {
            setSettings(res.data.data);
        }
    } catch (err) {
        console.log(err);
        toast.error("Failed to fetch settings.");
    }
};

export const updateOCSettings = async (formData) => {
    try {
        const res = await axiosInstance.put("/admin/oc-settings", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data.data;
        }
    } catch (err) {
        toast.error("Failed to update settings.");
    }
};

/* =========================================================
   CLIENT API CALLS
========================================================= */

export const getActiveCourses = async (setCourses) => {
    try {
        const res = await axiosInstance.get("/courses/active");
        if (res.data.success) {
            setCourses(res.data.data);
        }
    } catch (err) {
        toast.error("Failed to fetch courses.");
    }
};

export const getCourseDetail = async (id, setCourse) => {
    try {
        const res = await axiosInstance.get(`/courses/detail/${id}`);
        if (res.data.success) {
            setCourse(res.data.data);
        }
    } catch (err) {
        toast.error("Failed to fetch course details.");
    }
};

export const enrollInCourse = async (formData, setSubmitting) => {
    try {
        setSubmitting(true);
        const res = await axiosInstance.post("/courses/enroll", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return true;
        } else {
            toast.error(res.data.message);
            return false;
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Enrollment failed.");
        return false;
    } finally {
        setSubmitting(false);
    }
};
