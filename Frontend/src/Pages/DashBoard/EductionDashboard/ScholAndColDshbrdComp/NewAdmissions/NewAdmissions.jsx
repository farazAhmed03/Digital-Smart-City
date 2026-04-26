import { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import "./NewAdmissions.css";
import { gettheNewAdmissions } from "../../../../../ApiCalls/DashBoardApiCalls";

export const NewAdmissions = ({ dashboardData }) => {

    const [newAdmissions, setNewAdmissions] = useState([]);

    useEffect(() => {
        if (dashboardData?._id) {
            gettheNewAdmissions(dashboardData._id, (responseData) => {

                if (!responseData) return;

                const approved =
                    responseData.ApprovedAdmissionsdata?.map(item => ({
                        ...item,
                        status: "CLEARED" // ensure consistent status
                    })) || [];

                const pending =
                    responseData.PendingAdmissionsdata?.map(item => ({
                        ...item,
                        status: item.status || "PENDING"
                    })) || [];

                // Merge both arrays
                const mergedData = [...pending, ...approved];

                // Optional: Sort latest first
                mergedData.sort(
                    (a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                );

                setNewAdmissions(mergedData);
            });
        }
    }, [dashboardData]);


    if (!newAdmissions || newAdmissions.length === 0) {
        return (
            <div className="NA_empty">
                No admission requests found.
            </div>
        );
    }

    return (
        <div className="NA_container">

            <h2 className="NA_title">Admission Requests</h2>

            <div className="NA_table_wrapper">
                <table className="NA_table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Class</th>
                            <th>Screenshot</th>
                            <th>Submitted</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {newAdmissions.map((admission, index) => (
                            <tr key={index}>

                                <td>
                                    <div className="NA_student_info">
                                        <span className="NA_name">
                                            {admission.studentName}
                                        </span>
                                        <span className="NA_phone">
                                            {admission.phone}
                                        </span>
                                    </div>
                                </td>

                                <td>{admission.targetClass}</td>

                                <td>
                                    {admission.paymentScreenshot ? (
                                        <a
                                            href={admission.paymentScreenshot}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="NA_screenshot_link"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="NA_no_screenshot">
                                            Not Uploaded
                                        </span>
                                    )}
                                </td>

                                <td>
                                    {admission.createdAt
                                        ? new Date(admission.createdAt)
                                              .toLocaleDateString()
                                        : "N/A"}
                                </td>

                                <td>
                                    <StatusBadge status={admission.status} />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {

    if (status === "CLEARED") {
        return (
            <span className="NA_status cleared">
                <FiCheckCircle /> Cleared
            </span>
        );
    }

    if (status === "REJECTED") {
        return (
            <span className="NA_status rejected">
                <FiXCircle /> Rejected
            </span>
        );
    }

    return (
        <span className="NA_status pending">
            <FiClock /> Pending Verification
        </span>
    );
};