import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";
export const maniURL = API_BASE_URL;

const handleRedirect = (res) => {
    const rawSector = res.data?.sector || "";
    const sector = (rawSector || "").toString().trim().toUpperCase();
    const rawType = res.data?.ServiceType || res.data?.serviceType || "";
    const type = (rawType || "").toString().trim().toUpperCase();

    const isFoodType = ["RESTURANT", "RESTAURANT", "FOOD", "BAKERY", "CAFE", "FAST FOOD", "FINE DINING", "LOCAL FOOD", "STREET FOOD"].includes(type);
    const isEduType = ["SCHOOL", "COLLEGE"].includes(type);

    if (sector === "FOOD" || isFoodType) {
        window.location.href = "/food/fooddashboard";
        return;
    }
    if (sector === "EDUCATION" || isEduType) {
        window.location.href = "/edu/dashboard";
        return;
    }
    if (sector === "HEALTH") {
        window.location.href = "/health/dashboard";
        return;
    }
    if (res.data.role === "BUSINESS_ADMIN") {
        window.location.href = "/business/dashboard";
        return;
    }
    // Last fallback: default to edu to avoid infinite loop
    window.location.href = "/edu/dashboard";
};

export const verfiyTheAdmin = (email, password) => {
    axios.post(`/AdminLogin`, { email, password, sector: "EDUCATION" }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                handleRedirect(res);
            } else {
                toast.error(res.data.message);
            }
        })
        .catch((err) => {
            window.location.href = "/edu/admin";
        })
}

// Added verifyFoodAdmin
export const verifyFoodAdmin = (email, password) => {
    return axios.post(`/AdminLogin`, { email, password, sector: "FOOD" }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                handleRedirect(res);
            } else {
                toast.error(res.data.message);
            }
        })
        .catch((err) => {
            window.location.href = "/food/admin";
        })
}

export const businessLoginApi = (email, password) => {
    axios.post(`${maniURL}/business/auth/login`, { email, password }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                window.location.href = "/business/dashboard";
            } else {
                toast.error(res.data.message);
            }
        })
        .catch((err) => {
            toast.error("Login failed. Please check your credentials.");
        })
}

export const GetTheDashboardDta = (setDashboardData, setLoading, setAdminOtherServices) => {
    const redirectToSectorLogin = () => {
        const path = window.location?.pathname || "";
        if (path.startsWith("/food")) return window.location.href = "/food/admin";
        if (path.startsWith("/health")) return window.location.href = "/health/admin";
        if (path.startsWith("/business")) return window.location.href = "/business/admin-login";
        return window.location.href = "/edu/admin";
    };

    axios.get(`/getDashBoardDta`, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setDashboardData({
                    ...res.data.data,
                    role: res.data.role
                });
                setAdminOtherServices(res.data.OtherServices || []);
                setLoading(false);
            } else {
                redirectToSectorLogin();
            }
        })
        .catch((err) => {
            console.log("Error:", err.response?.data || err.message);
            redirectToSectorLogin();
        })
}

export const SwitchDashBoard = async (ServiceName, ServiceId, ServiceType, setDashboardData, setAdminOtherServices) => {
    try {
        const res = await axios.post(
            `/admin/switch-service`,
            { ServiceId },
            { withCredentials: true }
        );
        if (res.data.success) {
            if (res.data.ServiceDta) {
                setDashboardData(res.data.ServiceDta);
            }
            if (res.data.role === "admin") {
                setAdminOtherServices(res.data.OtherServices || []);
            }
            handleRedirect(res);
        } else {
            toast.error(res.data.message);
        }
    } catch (err) {
        console.error(err);
        toast.error("Failed to switch dashboard");
    }
};

// --- FORGOT PASSWORD API CALLS ---

export const requestResetOtp = async (email, type) => {
    try {
        const res = await axios.post(`/forgot-password/request-otp`, { email, type });
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Failed to request OTP" };
    }
};

export const verifyResetOtp = async (email, otp) => {
    try {
        const res = await axios.post(`/forgot-password/verify-otp`, { email, otp });
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Failed to verify OTP" };
    }
};

export const resetPassword = async (email, type, otp, newPassword) => {
    try {
        const res = await axios.post(`/forgot-password/reset`, { email, type, otp, newPassword });
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Failed to reset password" };
    }
};

export const SendResAndPrfumncDataToDb = (ResAndPrfrmnc, setResAndPrfSecChanged) => {
    axios.post(`${maniURL}/AddResAndPrfumncData`, { ResAndPrfrmnc }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setResAndPrfSecChanged(false);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        });
}

export const SendStaffAndStudentDataToDb = (staffAndStudnt, setStaffAndStudSecChanged) => {
    axios.post(`${maniURL}/AddStaffAndStudntData`, { staffAndStudnt }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setStaffAndStudSecChanged(false);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}

export const deleteTheEvent = (title) => {
    axios.post("/deleteTheEvent", { title }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
            } else {
                toast.error("Something went wrong.")
            }
        })
        .catch((err) => {
            toast.error("something went wrong");
        })
}

export const SendFeeTabDataToDb = (feeData, setCanSubmitForm) => {
    axios.post(`${maniURL}/AddFeeTabData`, { feeData }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success("Fee Tab Data Added ✅.");
                setCanSubmitForm(false)
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}
//
export const SendReviewTabDataToDb = (Reviews, setReviewSecChanged) => {
    axios.post(`${maniURL}/AddReviewTabData`, { Reviews }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setReviewSecChanged(false)
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}

export const AddNewEvent = (eventData, setIsSubmitting) => {
    axios.post(`${maniURL}/AddNewEvent`, { eventData }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setIsSubmitting(true);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}

export const UpdateExtraActivities = (extraActivities, setAcitivtiesSecChanged) => {
    axios.post(`${maniURL}/UpdateExtraActivities`, { extraActivities }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setAcitivtiesSecChanged(false)
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong while updating activities");
        });
};

export const UpdateTimings = (timings, setTimingSecChanged) => {
    axios.post(`${maniURL}/UpdateTimings`, { timings }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setTimingSecChanged(false);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong while updating timings");
        });
};

export const UpdateFacilities = (facilities, setFacilitiesSecChanged) => {
    axios.post(`${maniURL}/UpdateFacilities`, { facilities }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setFacilitiesSecChanged(false);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong while updating facilities");
        });
};

export const UpdateAdministration = (administration, setAdminSecChanged) => {
    axios.post(`${maniURL}/UpdateAdministration`, { administration }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setAdminSecChanged(false);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong while updating administration");
        });
};

export const saveBasicInfoApi = (formData, setBasicInfoChanged) => {
    setBasicInfoChanged(false);
    axios.post(
        `${maniURL}/UpdateBasicInfo`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        }
    ).then((res) => {
        if (res.data.success) {
            toast.success(res.data.message);
        } else {
            setBasicInfoChanged(true);
            toast.error(res.data.message);
        }
    }).catch((err) => {
        setBasicInfoChanged(true);
        toast.error("Something went wrong.");
    });
};

export const saveStaffInfo = (staff, setstaffSecChanged) => {
    setstaffSecChanged(false);
    axios.post(`${maniURL}/UpdateStaff`, staff, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
    })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
            } else {
                setstaffSecChanged(true);
                toast.error(res.data.message);
            }
        })
        .catch((err) => {
            console.error(err);
            toast.error("Something went wrong while updating staff");
        });
};

export const SaveGalleryImgs = (ImagesArr, onComplete) => {
    axios.post(`${maniURL}/UpdateGallery`, ImagesArr, {
        withCredentials: true,
    })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message || "Gallery updated");
                if (onComplete) onComplete(res.data);
            } else {
                toast.error(res.data.message || "Failed to update gallery");
            }
        })
        .catch((err) => {
            console.error(err);
            toast.error("Something went wrong while updating gallery");
        });
};

export const UpdateFoodGalleryApi = (formData, onComplete) => {
    axios.post(`${maniURL}/UpdateFoodGallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
    })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message || "Gallery updated ✅");
                if (onComplete) onComplete(res.data);
            } else {
                toast.error(res.data.message || "Failed to update gallery");
            }
        })
        .catch((err) => {
            console.error(err);
            toast.error("Something went wrong while updating gallery");
        });
};

export const AddManagerApi = (formData, endpoint = "/AddManager", onSuccess) => {
    axios.post(`${maniURL}${endpoint}`, formData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                if (onSuccess) onSuccess(res.data);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong.");
        });
}

export const gettheNewAdmissions = async (instituteId, setState) => {
    try {
        const res = await axios.post(
            `${maniURL}/GetInstituteAdmissions`,
            { instituteId }, { withCredentials: true }
        );

        if (res.data.success) {
            setState(res.data.data);
        }

    } catch (err) {
        console.error("Error fetching admissions:", err);
    }
};

export const SendPaymentGatewayToDb = async (paymentGateways, setCanSubmit) => {
    try {
        const res = await axios.post(
            `${maniURL}/update-payment-gateways`,
            { paymentGateways },
            { withCredentials: true }
        );

        if (res.data.success) {
            toast.success("Payment gateways updated successfully.");
            setCanSubmit(false);
        } else {
            toast.error(res.data.message);
        }

    } catch (err) {
        toast.error("Server error while updating payment gateways.");
    }
};
export const UpdateFoodProfileApi = (formData, setProfileData) => {
    axios.post(`${maniURL}/UpdateBasicInfo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
    })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to update profile.");
        });
}

export const UpdateTimingsApi = (timings, setProfileData) => {
    axios.post(`${maniURL}/UpdateTimings`, { timings }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success("Timings updated successfully.");
                setProfileData(prev => ({ ...prev, timings }));
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to update timings.");
        });
}

export const UpdateFoodMenuApi = (menuItems, setMenuItems) => {
    axios.post(`${maniURL}/UpdateFoodMenu`, { menuItems }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setMenuItems(menuItems);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("UpdateFoodMenuApi Error Details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            const serverMsg = err.response?.data?.errorDetail || err.response?.data?.message;
            toast.error(serverMsg || "Failed to update menu. Check console for details.");
        });
}

export const UpdateReviewReplyApi = (reviewId, response) => {
    axios.post(`${maniURL}/ReplyToReview`, { reviewId, response }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success("Reply saved successfully.");
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to save reply.");
        });
}

export const UpdateFoodPromosApi = (promotions, setProfileData) => {
    axios.post(`${maniURL}/UpdateFoodPromos`, { promotions }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                if (setProfileData) {
                    setProfileData(prev => ({ ...prev, promotions }));
                }
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to update promotions.");
        });
}

export const UpdateReportStatusApi = (reportId, status, response) => {
    return axios.post(`${maniURL}/food/report/status`, { reportId, status, response }, { withCredentials: true });
}

export const UpdateCoverImageApi = (formData, setProfileData) => {
    return axios.put(`${maniURL}/update-cover-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
    })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                if (setProfileData) {
                    setProfileData(prev => ({ ...prev, coverImage: res.data.coverImage, aboutImage: res.data.coverImage }));
                }
                return res.data;
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to update cover image.");
        });
}

export const LogoutApi = () => {
    axios.post(`${maniURL}/Logout`, {}, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                window.location.href = "/food/admin";
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to logout.");
        });
}

export const SubmitSupportTicketApi = (ticketData, callback) => {
    axios.post(`${maniURL}/SubmitSupportTicket`, ticketData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                if (callback) callback(res.data.ticket);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to submit support ticket.");
        });
}

export const SubmitAdminServiceRequestApi = (payload, onComplete) => {
    axios.post(`${maniURL}/admin/request-service`, payload, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                if (onComplete) onComplete();
            } else {
                toast.error(res.data.message);
                if (onComplete) onComplete();
            }
        }).catch((err) => {
            console.error(err);
            toast.error("Failed to submit service request.");
            if (onComplete) onComplete();
        });
}
