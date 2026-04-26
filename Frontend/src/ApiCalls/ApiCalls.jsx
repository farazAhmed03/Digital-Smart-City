import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";
const mainURL = API_BASE_URL;

export const RequestRegisterOtpApi = async (
    formData,
    setLoading,
    setOtpSent
) => {
    try {
        setLoading(true);

        const payload = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone?.trim() || null,
            password: formData.password,
            address: formData.address.trim(),
            DOB: formData.DOB,
        };

        const res = await axios.post(`${mainURL}/register/user/request-otp`, payload, {
            withCredentials: true,
        });

        if (res.data.success) {
            toast.success("OTP sent to your email 📩");
            setOtpSent(true);
        } else {
            toast.error(res.data.message || "Failed to send OTP.");
        }
    } catch (err) {
        console.log("ERr ", err);
        toast.error("Something went wrong.");
    } finally {
        setLoading(false);
    }
};

// 2) Verify OTP + Create User
export const VerifyRegisterOtpApi = async (email, otp, setLoading, navigate, setUserData) => {
    try {
        setLoading(true);

        const payload = {
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
        };

        const res = await axios.post(`${mainURL}/register/user/verify-otp`, payload, {
            withCredentials: true,
        });

        if (res.data.success) {
            toast.success("Account created and logged in successfully ✅");
            localStorage.setItem("IsLoggedIn", true);
            GetUserData(setUserData);
            navigate("/");
        } else {
            toast.error(res.data.message || "OTP verification failed.");
        }
    } catch (err) {
        toast.error("Something went wrong.");
    } finally {
        setLoading(false);
    }
};

export const LoginUserApi = async (formData, setLoading, navigate, setUserData) => {
    try {
        setLoading(true);

        const payload = {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
        };

        await axios.post(`${mainURL}/user/login`, payload, { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    navigate("/");
                    toast.success("Login Success");
                    localStorage.setItem("IsLoggedIn", true);
                    GetUserData(setUserData);
                } else {
                    toast.error(res.data.message || "Login failed.");
                }
            })
    } catch (err) {
        toast.error("Something went wrong.");
    } finally {
        setLoading(false);
    }
};

export const GetUserData = (setUserData) => {
    axios.get(`${mainURL}/user/data`, { withCredentials: true })
        .then(res => {
            if (res.data.success) {
                setUserData(res.data.user);
            } else {
                localStorage.removeItem("IsLoggedIn");
                setUserData(null);
            }
        })
        .catch((error) => {
            console.log(error);
            localStorage.removeItem("IsLoggedIn");
            setUserData(null);
        });
}

export const LogoutUserApi = async (setUserData) => {
    try {
        await axios.post(`${mainURL}/user/logout`, {}, { withCredentials: true });
        localStorage.removeItem("IsLoggedIn");
        setUserData(null);
        toast.success("Logged out successfully");
    } catch (err) {
        console.log("Logout error", err);
        localStorage.removeItem("IsLoggedIn");
        setUserData(null);
    }
};

export const GetServicesCardsFromDB = (setInstCrds, coll) => {
    axios.post(`${mainURL}/getServiceCardsData`, { coll })
        .then((res) => {
            if (res.data.success) {
                setInstCrds(res.data.serviceCards);
            } else {
                console.log(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}

export const GetServicesWholeData = (InstId, setPageData, coll) => {
    axios.post(`${mainURL}/getServiceWholeData`, { InstId, coll })
        .then((res) => {
            if (res.data.success) {
                setPageData(res.data.serviceData)
            } else {
                toast.warn(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}

export const GetFoodCrdsDtaFrmDB = (setFoodCrds) => {
    axios.get(`${mainURL}/getFoodCrdDta`)
        .then((res) => {
            if (res.data.success) {
                setFoodCrds(res.data.serviceCards);
            } else {
                console.log(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}

export const GetTheFoodData = (FoodId, setPageData) => {
    axios.post(`${mainURL}/getFoodWholeDta`, { FoodId })
        .then((res) => {
            if (res.data.success) {
                setPageData(res.data.serviceData)
            } else {
                toast.warn(res.data.message);
            }
        }).catch((err) => {
            console.log(err)
        })
}

export const ChangeRatingData = async (payload, serviceId, onSuccess, coll) => {
    try {
        // Food sector uses a specific prefix route for logic isolation
        const isFood = coll === "FOOD" || coll === "Food" || coll?.toLowerCase() === "restaurant";
        const endpoint = isFood ? `${mainURL}/food/changeRatingData` : `${mainURL}/changeRatingData`;
        
        const res = await axios.post(endpoint, { ...payload, id: serviceId, coll }, { withCredentials: true });
        
        if (res.data.success) {
            toast.success(res.data.message || "Review submitted!");
            // Health/Edu uses 'detailedReviews', Food uses 'reviews' - standardizing check
            const reviews = res.data.detailedReviews || res.data.reviews;
            if (onSuccess) onSuccess(res.data.ratingData, reviews);
        } else {
            if (res.data.message?.includes("already")) {
                toast.info(res.data.message);
            } else {
                toast.error(res.data.message || "Failed to submit review.");
            }
        }
    } catch (error) {
        console.error("ChangeRatingData error:", error);
        toast.error("Failed to submit review");
    }
};

export const ServiceProviderRegistration = (data, setVerificationRequired, setLoading) => {
    if (setLoading) setLoading(true);
    axios.post(`${mainURL}/service-provider/register`, data)
        .then((res) => {
            if (res.data.success) {
                if (res.data.verificationRequired) {
                    toast.info(res.data.message);
                    setVerificationRequired(true);
                } else {
                    toast.success(res.data.message || "Your request submitted successfully ✅.");
                }
            } else {
                toast.error(res.data.message || "Registration failed.");
            }
        })
        .catch((err) => {
            console.error("Registration error:", err);
            toast.error("Something went wrong.");
        })
        .finally(() => {
            if (setLoading) setLoading(false);
        });
}

export const VerifyServiceProviderOtpApi = (data, onSuccess, setLoading) => {
    if (setLoading) setLoading(true);
    axios.post(`${mainURL}/service-provider/verify-otp`, data)
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message || "Verification successful ✅");
                if (onSuccess) onSuccess();
            } else {
                toast.error(res.data.message || "Verification failed.");
            }
        })
        .catch((err) => {
            console.error("Verification error:", err);
            toast.error("Something went wrong with verification.");
        })
        .finally(() => {
            if (setLoading) setLoading(false);
        });
}

export const NewAdmisnForSchoolReq = (data, cata, setIsSubmitting) => {
    const fd = new FormData();
    fd.append("studentName", data.studentName);
    fd.append("fatherName", data.fatherName);
    fd.append("email", data.email);
    fd.append("phone", data.phone);
    fd.append("WhatsAppNum", data.WhatsAppNum);
    fd.append("targetClass", data.targetClass);
    fd.append("previousSchool", data.previousSchool);
    fd.append("address", data.address);
    fd.append("id", data.id);
    fd.append("Coll", cata)

    // IMPORTANT
    fd.append("paymentScreenshot", data.paymentScreenshot);

    axios
        .post(`${mainURL}/NewInstAdmissionReq`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        })
        .then((res) => {
            if (res.data.success) {
                alert("Your request submitted successfully ✅.");
            } else {
                if (res.data.message == "getaddrinfo ENOTFOUND api.cloudinary.com") {
                    alert("No Internet")
                } else {
                    alert(res.data.message);
                }
            }
        })
        .catch(() => alert("Something went wrong."));
};

export const BusinessRegistrationReq = (data) => {
    axios.post(`${mainURL}/business/auth/register-request`, data)
        .then((res) => {
            if (res.data.success) {
                alert("Business registration request submitted successfully ✅.");
            } else {
                alert(res.data.message);
            }
        }).catch((err) => {
            alert("Something went wrong with business registration.");
        })
}

export const PlaceOrderApi = (orderData) => {
    return axios.post(`${mainURL}/placeOrder`, orderData);
}

export const GetOrdersApi = (serviceId) => {
    return axios.post(`${mainURL}/getOrders`, { serviceId });
}

export const UpdateOrderStatusApi = (orderId, status) => {
    return axios.post(`${mainURL}/updateOrderStatus`, { orderId, status });
}

export const BookTableApi = (bookingData) => {
    return axios.post(`${mainURL}/bookTable`, bookingData);
}

export const ReportServiceLandingApi = (reportData) => {
    return axios.post(`${mainURL}/reportServiceLanding`, reportData);
}


// HEALTH SECTION
export const BookAppointment = (id, data, e) => {
    axios.post(`${mainURL}/api/specialist/book/${id}`, data)
        .then((res) => {
            if (res.data.success) {
                e.target.reset();
                toast.success("Appointment request sent successfully! ✅");
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            toast.error("Something went wrong with appointment booking.");
        })
}

export const AddReviewApi = async (id, reviewData, onSuccess) => {
    try {
                const res = await axios.post(`${mainURL}/api/health/review/${id}`, reviewData, { withCredentials: true });

        if (res.data.success) {
            toast.success("Thank you for your feedback! ✅");
            if (onSuccess) onSuccess(res.data.reviews, res.data.ratingData);
        } else {
            if (res.data.message?.includes("already")) {
                toast.info(res.data.message);
            } else {
                toast.error(res.data.message || "Failed to submit review.");
            }
        }
    } catch (err) {
        console.error("AddReview error:", err);
        toast.error("Something went wrong with review submission.");
    }
}
