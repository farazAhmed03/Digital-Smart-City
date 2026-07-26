import { FaPlayCircle, FaRegCreditCard, FaStar, FaUser, FaSchool } from "react-icons/fa";
import { MdNearMe } from "react-icons/md";
import "./Profile.css";
import "../ScholAndColDshbrdComp.css";
export const ProfileContent = ({ dashboardData }) => {
    return (
        <>
            <div className="overview-section">
                <div className="overview-header">
                    <h2>Profile Overview</h2>
                    <p className="overview-header-para">Quick summary of your profile activity and status</p>

                    {
                        dashboardData?.PaymentPlan === "FREE" && (
                            <div className="trial-status-banner">
                                {
                                    new Date() > new Date(dashboardData.PlanExpiry)
                                        ?
                                        <div className="trial-expired">
                                            <p>Your free trial has expired. Please contact admin to upgrade your plan.</p>
                                        </div>
                                        :
                                        <div className="trial-active">
                                            <p>
                                                Your free trial expires in {
                                                    Math.ceil((new Date(dashboardData.PlanExpiry) - new Date()) / (1000 * 60 * 60 * 24))
                                                } days.
                                            </p>
                                        </div>
                                }
                            </div>
                        )
                    }
                </div>

                <div className="overview-cards">
                    {[
                        {
                            label: "Institute Name",
                            value: dashboardData?.ServiceName,
                            icon: <MdNearMe size={24} />
                        },
                        {
                            label: "Expiray Date",
                            value: dashboardData?.PlanExpiry?.split("T")[0] || "None",
                            icon: <FaUser size={24} />
                        },
                        {
                            label: "Rating",
                            value: `${dashboardData?.ratingData?.average || "(New)"} (${dashboardData?.ratingData?.totalReviews || "No Review"})`,
                            icon: <FaStar size={24} />
                        },
                        {
                            label: "Institute Type",
                            value: dashboardData?.ServiceType,
                            icon: < FaSchool size={24} />
                        },
                        {
                            label: "Featured Status",
                            value: dashboardData?.Status ? "Active" : "In-Active",
                            icon: <FaPlayCircle size={24} />
                        },
                        {
                            label: "Subscription Plan",
                            value: dashboardData?.PaymentPlan || "FREE",
                            icon: <FaRegCreditCard size={24} />
                        }
                    ].map((item, index) => (
                        <div className="Dshbrdcard" key={index}>
                            <p className="label">{item?.label}</p>

                            <div className="Dshbrdcard-bottom">
                                <h3 className="DshBrd-content">
                                    {item?.value}
                                </h3>

                                <span className="Dshbrdcard-icon">{item?.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}