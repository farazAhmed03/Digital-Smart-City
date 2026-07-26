import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";

const mainURL = API_BASE_URL;

// --- AUTH & CORE ---

export const SuperAdminFormSubmitted = (formData, setIsLoading) => {
    axios.post(`${mainURL}/SuperAdminLogin`, formData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                window.location.href = "/superadmin/dashboard";
            } else {
                setIsLoading(false);
                toast.error(res.data.message);
            }
        }).catch((err) => {
            setIsLoading(false);
            toast.error("An error occurred during login.");
        });
};

export const VerifyTheSuperAdmin = (setRole, setSuperAdminEmail, setSAManagers) => {
    axios.get(`/GetSuperAdminDashboardData`, { withCredentials: true })
        .then((res) => {
            if (!res.data.success) {
                window.location.href = "/superadmin/login";
            } else {
                setRole(res.data.AccessTo);
                if (res.data.SAMail) {
                    setSAManagers(res.data.data.SAManagers);
                    setSuperAdminEmail(res.data.SAMail);
                }
            }
        })
        .catch(() => {
            window.location.href = "/superadmin/login";
        });
};

export const logoutSuperAdmin = () => {
    axios.post(`${mainURL}/SuperAdminLogout`, {}, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                window.location.href = "/superadmin/login";
            }
        }).catch(() => {
            window.location.href = "/superadmin/login";
        });
};

export const CreateSAManager = (formData, setSAManagers) => {
    axios.post(`${mainURL}/CreateSAManager`, formData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setSAManagers(prev => ([...prev, res.data.data]));
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        }).catch(() => {
            toast.error("Something went wrong.");
        });
};

export const SAManagerDelete = (email, setSAManagers) => {
    axios.post(`${mainURL}/DeleteThSAManager`, { email }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setSAManagers(prev => prev.filter(m => m.email !== email));
                toast.success(res.data.message || "Manager deleted successfully");
            } else {
                toast.error(res.data.message);
            }
        }).catch(() => { });
};

// --- NOTIFICATION COUNTS ---

export const GetEducationNotificationCounts = (setEduNotifCounts) => {
    axios.get(`${mainURL}/GetEduNotificationCounts`, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setEduNotifCounts({
                    admissions: res.data.admissionsCount || 0,
                    requests: res.data.requestsCount || 0
                });
            } else {
                console.log("Res.Data = ", res.data);
            }
        }).catch((err) => {
            console.log("Error = ", err);
        })
};

export const GetFoodNotificationCounts = (setTabNotifCounts) => {
    axios.post(`${mainURL}/GetFoodNotificationCounts`, {}, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setTabNotifCounts(prev => ({ ...prev, Restaurant: res.data.requestsCount || 0 }));
            }
        });
};

export const GetHealthNotificationCounts = (setTabNotifCounts) => {
    axios.post(`${mainURL}/GetHealthNotificationCounts`, {}, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setTabNotifCounts(prev => ({ ...prev, Health: res.data.requestsCount || 0 }));
            }
        });
};

export const GetBusinessNotificationCounts = (setTabNotifCounts) => {
    axios.post(`${mainURL}/GetBusinessNotificationCounts`, {}, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setTabNotifCounts(prev => ({ ...prev, Business: res.data.requestsCount || 0 }));
            }
        });
};

// --- EDUCATION MODULE ---

export const CreateEduCataAdmin = (AdminData, setActiveTab, ServiceType, setFormSubmitted) => {
    if (typeof setFormSubmitted === 'function') setFormSubmitted(true);
    axios.post(`/CreateEduCataAdmin`, AdminData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setActiveTab(ServiceType);
            } else {
                if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
                toast.error(res.data.message);
            }
        }).catch(() => {
            if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
            toast.error("An error occurred while creating the admin.");
        });
};

export const GetTheTabData = (dataOf, setRowData) => {
    let route;
    if (dataOf === "NEW_REQUESTS") {
        route = `${mainURL}/GetEduTabNewReqtsData`;
    } else if (dataOf === "NEW_ADMISSIONS") {
        route = `${mainURL}/GetEduTabNewAdnissionsData`;
    } else {
        route = `${mainURL}/GetSADEduTabData`;
    }
    axios.post(route, { dataOf }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setRowData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("GetTheTabData Error:", err);
            toast.error("Failed to fetch data");
        });
};

export const handleGetRecords = (adminId, InstId, setData, setActiveTab) => {
    axios.post(`${mainURL}/getInstituteRecords`, { adminId, InstId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setData(res.data.ResponseData);
                if (setActiveTab) setActiveTab("RECORD");
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("handleGetRecords Error:", err);
            toast.error("Network error: Failed to fetch records");
        });
};

export const ChangePaymentPlan = (adminId, InstId, setData, newPlan, ServiceType) => {
    axios.post(`${mainURL}/ChangeFoodAdminPaymentData`, { adminId, InstId, newPlan, ServiceType }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                console.log("Line 180 in SuperAdminApiCall.jsx in ChangePaymentPlan Response Data = ", res.data.ResponseData)
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("ChangePaymentPlan Error:", err);
            toast.error("Failed to update payment plan");
        });
};

export const ChangeInstState = (adminId, InstId, ServiceType, setData) => {
    axios.post(`${mainURL}/ChangeTheInstState`, { adminId, InstId, ServiceType }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("ChangeInstState Error:", err);
            toast.error("Failed to change state");
        });
};

export const DeleteTheInst = (adminId, InstId, setData) => {
    axios.post(`${mainURL}/DeleteTheInst`, { adminId, InstId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("DeleteTheInst Error:", err);
            toast.error("Failed to delete institute");
        });
};

export const ChangeAdminVerificationState = (adminId, setData) => {
    axios.post(`${mainURL}/ChangeAdminVerificationState`, { adminId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("ChangeAdminVerificationState Error:", err);
            toast.error("Failed to update verification status");
        });
};

export const deleteRequest = (id, setData) => {
    axios.post(`${mainURL}/DeleteTheReq`, { id }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("deleteRequest Error:", err);
            toast.error("Failed to delete request");
        });
};

export const ApproveAdmissionAndForward = (payload, setRows) => {
    return axios.post(`${mainURL}/ApproveAdmissionAndForward`, payload, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setRows(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
            return res.data;
        });
};

export const deleteAdmissionReq = (id, setRows) => {
    axios.post(`${mainURL}/deleteAdmissionRequest`, { id }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setRows(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const deleteAdmissionRecord = (admissionId, InstId, adminId, setRows) => {
    axios.post(`${mainURL}/deleteAdmissionRecord`, { admissionId, InstId, adminId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setRows(res.data.ResponseData || []);
            } else {
                toast.error(res.data.message);
            }
        });
};

// --- FOOD MODULE ---

export const CreateFoodCataAdmin = (AdminData, setActiveTab, ServiceType, setFormSubmitted, setRows) => {
    if (typeof setFormSubmitted === 'function') setFormSubmitted(true);
    axios.post(`/CreateFoodCataAdmin`, AdminData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                if (typeof setRows === 'function' && res.data.ResponseData) {
                    setRows(res.data.ResponseData);
                }
                setActiveTab("RESTAURANT");
            } else {
                if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
                toast.error(res.data.message);
            }
        }).catch(() => {
            if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
            toast.error("Failed to create Food Admin.");
        });
};

export const GetFoodNewReqTabData = (dataOf, setRowData) => {
    axios.post(`${mainURL}/GetSADFoodTabData`, { dataOf }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setRowData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const GetFoodTabData = (dataOf, setRowData) => {
    axios.post(`${mainURL}/GetFoodTabData`, { dataOf }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setRowData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const GetFoodUpgradeRequests = (setUpgradeReqs) => {
    axios.get(`${mainURL}/GetFoodUpgradeRequests`, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setUpgradeReqs(res.data.ResponseData || []);
            } else {
                setUpgradeReqs([]);
            }
        }).catch(() => {
            setUpgradeReqs([]);
        });
};

export const ChangeFoodInstState = (adminId, InstId, setData) => {
    axios.post(`${mainURL}/ChangeTheFoodInstState`, { adminId, InstId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const DeleteTheFoodInst = (adminId, InstId, setData) => {
    axios.post(`${mainURL}/DeleteTheFoodInst`, { adminId, InstId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const ChangeFoodAdminVerificationState = (adminId, setData) => {
    axios.post(`${mainURL}/ChangeFoodAdminVerificationState`, { adminId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const ApproveFoodUpgrade = (upgradeId, setUpgradeReqs) => {
    axios.post(`${mainURL}/ApproveFoodUpgrade`, { upgradeId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setUpgradeReqs(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const deleteFoodRequest = (id, setData) => {
    axios.post(`${mainURL}/DeleteTheFoodReq`, { id }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

// --- HEALTH MODULE ---

export const CreateHealthCataAdmin = (AdminData, setActiveTab, ServiceType, setFormSubmitted) => {
    if (typeof setFormSubmitted === 'function') setFormSubmitted(true);
    axios.post(`/CreateHealthCataAdmin`, AdminData, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setActiveTab(ServiceType);
            } else {
                if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
                toast.error(res.data.message);
            }
        }).catch(() => {
            if (typeof setFormSubmitted === 'function') setFormSubmitted(false);
            toast.error("Failed to create Health Admin.");
        });
};

export const GetHealthNewReqTabData = (dataOf, setRowData) => {
    axios.post(`${mainURL}/GetHealthTabNewReqtsData`, { dataOf }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setRowData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const GetHealthTabData = (dataOf, setRowData) => {
    axios.post(`${mainURL}/GetSADHealthTabData`, { dataOf }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setRowData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const ChangeHealthServiceState = (adminId, serviceId, serviceType, setData) => {
    axios.post(`${mainURL}/ChangeHealthServiceState`, { adminId, serviceId, serviceType }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const DeleteTheHealthService = (adminId, serviceType, serviceId, setData) => {
    axios.post(`${mainURL}/DeleteTheHealthService`, { adminId, serviceType, serviceId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const ChangeHealthAdminVerificationState = (adminId, setData) => {
    axios.post(`${mainURL}/ChangeHealthAdminVerificationState`, { adminId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const UpdateHealthServicePlan = (adminId, serviceId, serviceType, newPlan, setData) => {
    axios.put(`${mainURL}/updateTheHealthServicePlan`, { adminId, serviceId, serviceType, newPlan }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

// --- BUSINESS & COMMON ---

export const GetBusinessesByStatus = (status, setRowData) => {
    axios.post(`${mainURL}/GetBusinessesByStatus`, { status }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                setRowData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};

export const UpdateBusinessStatus = (id, status, fromCollection, fetchTabData) => {
    axios.post(`${mainURL}/UpdateBusinessStatus`, { id, status, fromCollection }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                fetchTabData();
            } else {
                toast.error(res.data.message);
            }
        });
};

export const DeleteHealthRequest = (reqId, setData) => {
    axios.post(`${mainURL}/DeleteHealthRequest`, { reqId }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.error("DeleteHealthRequest error:", err);
            toast.error("Failed to delete request");
        });
};

export const UpdateServiceProviderRequestStatus = (reqId, status, setData) => {
    axios.post(`${mainURL}/UpdateServiceProviderRequestStatus`, { reqId, status }, { withCredentials: true })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setData(res.data.ResponseData);
            } else {
                toast.error(res.data.message);
            }
        });
};
