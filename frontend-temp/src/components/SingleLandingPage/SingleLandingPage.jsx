import "./SingleLandingPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { RatingSection } from "../RatingSection/RatingSection";
import { GetServicesWholeData, NewAdmisnForSchoolReq } from "../../ApiCalls/ApiCalls";
import { ToastContainer } from "react-toastify";
import { AppContext } from "../../Store/AppContext";
import AutofillNote from "../AutofillNote/AutofillNote";

export const SingleLandingPage = () => {

    const { userData } = useContext(AppContext);
    const [pageData, setPageData] = useState(null);
    const [paymentPreview, setPaymentPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentName: "",
        fatherName: "",
        email: "",
        phone: "",
        WhatsAppNum: "",
        targetClass: "",
        previousSchool: "",
        address: "",
        paymentScreenshot: null
    });

    const isFormValid =
        formData.studentName.trim() &&
        formData.fatherName.trim() &&
        formData.email.trim() &&
        formData.phone.trim() &&
        formData.WhatsAppNum.trim() &&
        formData.targetClass.trim() &&
        formData.paymentScreenshot;


    let cata;

    const { id, category } = useParams();
    switch (category) {
        case "schools":
            cata = "SCHOOL";
            break;
        case "colleges":
            cata = "COLLEGE";
            break;
        case "specialists":
            cata = "SPECIALIST";
            break;
        case "pharmacies":
            cata = "PHARMACY";
            break;
    }

    const navigate = useNavigate();

    useEffect(() => {
        GetServicesWholeData(id, setPageData, cata);
    }, [id]);

    useEffect(() => {
        if (userData) {
            setFormData((prev) => ({
                ...prev,
                studentName: userData.fullName || "",
                email: userData.email || "",
                phone: userData.phone || "",
                WhatsAppNum: userData.phone || "",
                address: userData.address || ""
            }));
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!isFormValid) {
            alert("Please fill all required fields and upload payment screenshot.");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = { ...formData, id };

            NewAdmisnForSchoolReq(payload, cata, setIsSubmitting);

            setFormData({
                studentName: "",
                fatherName: "",
                email: "",
                phone: "",
                WhatsAppNum: "",
                targetClass: "",
                previousSchool: "",
                address: "",
                paymentScreenshot: null,
            });

            setPaymentPreview(null);

        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        (pageData)
            ?
            <section className="S_main_Sec">
                <ToastContainer />

                {/* HERO */}
                <section
                    className="GlassHeroBG"
                    style={{
                        background: `linear-gradient(135deg, rgba(0,0,0,.25), rgba(0,0,0,.35)),
                    url("${pageData.basicInfo?.bannerUrl}")`,
                        backgroundPosition: "center",
                        backgroundSize: "cover"
                    }}
                >
                    <div className="GlassHeroBG-content">
                        <h1>Welcome to <strong>{pageData.ServiceName}</strong></h1>
                        <p className="GlassHeroBG-sub">{pageData.basicInfo?.tagline}</p>
                        <button className="GlassHeroBG-btn" onClick={() => window.location.href = "#AdmissionForm"}>Get Admission</button>
                        <br></br>
                        <button className="GlassHeroBG-btn" onClick={() => navigate(cata === "SPECIALIST" || cata === "PHARMACY" ? "/health" : `/edu/${category}`)}>
                            Go Back
                        </button>
                    </div>
                    <div className="blurShape s1"></div>
                    <div className="blurShape s2"></div>
                </section>

                {/* ABOUT */}
                <section className="S_about">
                    <div className="S_about-content">
                        <h2 className="SP_Sec_hd">About Us</h2>
                        <p>{pageData.basicInfo?.about}</p>
                    </div>
                    <img src={pageData.basicInfo?.aboutImgUrl} alt="About Us" />
                </section>

                {/* STAFF */}
                {
                    (pageData.staff && pageData.staff[0])
                        ?
                        <section className="S_staff SP_Sec">
                            <h2 className="SP_Sec_hd">Our Staff</h2>
                            <div className="staff-crd-cont">
                                {pageData.staff?.map((s, i) => (
                                    <div key={i} className="staff-card">
                                        <img src={s.image} alt={s.name} />
                                        <h3>{s.name}</h3>
                                        <p>{s.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        :
                        <></>
                }

                {/* EVENTS */}
                {
                    (pageData.eventData && pageData.eventData[0])
                        ?
                        <section className="S_events SP_Sec">
                            <h2 className="SP_Sec_hd">Upcoming Events</h2>
                            <div className="S_event-list">
                                {pageData.eventData?.map((e, i) => (
                                    <div className="event-card" key={i}>
                                        <div className="event-header">
                                            <span className="event-category">{e?.category || e?.catagory || "Event"}</span>
                                            <h2 className="event-title">{e?.title}</h2>
                                        </div>
                                        <div className="event-body">
                                            <div className="event-row">
                                                <span className="SPlabel">Location</span>
                                                <span>{e?.location}</span>
                                            </div>
                                            <div className="event-row">
                                                <span className="SPlabel">Date</span>
                                                <span>{e?.time}</span>
                                            </div>
                                            <div className="event-row">
                                                <span className="SPlabel">Audience</span>
                                                <span className="badge">{e?.Audience}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        :
                        <></>
                }

                {/* QUICK INFO */}
                <section className="QI-dashboard SP_Sec">
                    <h2 className="SP_Sec_hd">Quick Info Dashboard</h2>

                    <div className="dash-grid">

                        {/* BASIC PROFILE */}
                        <div className="dash-card">
                            <h2>🏫 Basic Profile</h2>
                            <ul>
                                <li><strong>Name:</strong> {pageData.ServiceName}</li>
                                <li><strong>Location:</strong> {pageData?.Address}</li>
                                <li><strong>Type:</strong> {pageData.ServiceType}</li>
                            </ul>
                        </div>

                        {/* ADMINISTRATION */}
                        {
                            (pageData?.administration)
                                ?
                                <div className="dash-card">
                                    <h2>📋 Administration</h2>
                                    <ul>
                                        {Object.entries(pageData?.administration || {})
                                            .filter(([_, value]) =>
                                                value !== null &&
                                                value !== "" &&
                                                (!Array.isArray(value) || value.length > 0)
                                            )
                                            .map(([key, value]) => {

                                                if (key === "others" && Array.isArray(value)) {
                                                    return value.map((v, i) => (
                                                        <li key={i}>
                                                            {v.label}: {v.value}
                                                        </li>
                                                    ));
                                                }

                                                return (
                                                    <li key={key}>
                                                        {key.replace(/_/g, " ")} : {String(value)}
                                                    </li>
                                                );
                                            })}

                                    </ul>
                                </div>
                                :
                                <></>
                        }

                        {/* STUDENTS & STAFF */}
                        {
                            (pageData?.StaffAndStudent)
                                ?
                                <div className="dash-card">
                                    <h2>👨‍🎓 Students & Staff</h2>
                                    <ul>
                                        {Object.entries(pageData?.StaffAndStudent || {})
                                            .filter(([k, v]) =>
                                                v !== null &&
                                                v !== "" &&
                                                k !== "others"
                                            )
                                            .map(([k, v]) => (
                                                <li key={k}>
                                                    {k.replace(/_/g, " ")} : {v}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                :
                                <></>
                        }

                        {/* FACILITIES */}
                        {
                            (pageData?.facilities && pageData.facilities[0])
                                ?
                                <div className="dash-card">
                                    <h2>🏢 Facilities</h2>
                                    <ul>
                                        {pageData.facilities?.map((f, i) => (
                                            <li key={i}>{f.replace(/_/g, " ")}</li>
                                        ))}
                                    </ul>
                                </div>
                                :
                                <></>
                        }

                        {/* RESULTS & PERFORMANCE */}
                        {
                            (pageData?.ResultAndPerformance)
                                ?
                                <div className="dash-card">
                                    <h2>📈 Results & Performance</h2>
                                    <ul>
                                        {Object.entries(pageData?.ResultAndPerformance || {})
                                            .filter(([k, v]) =>
                                                v !== null &&
                                                v !== "" &&
                                                k !== "others"
                                            )
                                            .map(([k, v]) => (
                                                <li key={k}>
                                                    {k.replace(/_/g, " ")} : {v}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                :
                                <></>
                        }

                        {/* TIMINGS */}
                        {
                            (pageData?.timings)
                                ?
                                <div className="dash-card">
                                    <h2>⏰ Timings</h2>
                                    <ul>
                                        {Object.entries(pageData?.timings || {}).map(([key, value]) => (
                                            <li key={key}>
                                                {key} : {String(value)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                :
                                <></>
                        }

                        {/* EXTRA ACTIVITIES */}
                        {
                            (pageData.extraActivities && pageData.extraActivities[0])
                                ?
                                <div className="dash-card">
                                    <h2>⚽ Extra Activities</h2>
                                    <ul>
                                        {pageData.extraActivities?.map((act, i) => (
                                            <li key={i}>{act.replace(/_/g, " ")}</li>
                                        ))}
                                    </ul>
                                </div>
                                :
                                <></>
                        }

                        {/* PARENT REVIEWS */}
                        {
                            (pageData.Reviews && pageData.Reviews[0])
                                ?
                                <div className="dash-card">
                                    <h2>⭐ Parent Reviews</h2>
                                    {pageData.Reviews?.map((rev, i) => {
                                        if (rev) {
                                            return (
                                                <blockquote key={i}>{rev}</blockquote>
                                            )
                                        }
                                    }
                                    )}
                                </div>
                                :
                                <></>
                        }

                    </div>
                </section>

                {/* FEES */}
                <section className="SP_Sec">
                    <h2 className="SP_Sec_hd">Fee Structure</h2>
                    <table className="feeTable">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Monthly</th>
                                <th>Annual</th>
                                <th>Admission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageData.feeData?.map((f, i) => (
                                <tr key={i}>
                                    <td>{f.Class}</td>
                                    <td>{f.MonthlyFee}</td>
                                    <td>{f.AnnualFee}</td>
                                    <td>{f.AdmissionFee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                {/* Admission form */}
                <section className="SP_Sec admission-section" id="AdmissionForm">
                    <h2 className="SP_Sec_hd">Apply for Admission</h2>

                    <div className="admission-container">
                        <AutofillNote />
                        <div style={{
                            backgroundColor: "#e7f3ef",
                            color: "#1f8e5c",
                            padding: "10px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            fontSize: "0.9rem",
                            borderLeft: "4px solid #1f8e5c"
                        }}>
                            <strong>Note:</strong> Uploading large payment screenshots might take a moment. Please wait for the confirmation message after clicking submit.
                        </div>
                        <p className="admission-subtext">
                            Fill out the form below, submit your admission payment, and our admissions office will contact you shortly.
                        </p>

                        <form className="admission-form" onSubmit={(e) => handleFormSubmit(e)}>
                            {/* ===== Student Details ===== */}
                            <h3 className="formSectionTitle">Student Information</h3>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Student Full Name *</label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Father/Guardian Name *</label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Mr. Ahmed"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Contact Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="+92 300 1234567"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>WhatsApp Number *</label>
                                    <input
                                        type="tel"
                                        name="WhatsAppNum"
                                        value={formData.WhatsAppNum}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="+92 300 1234567"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Applying for Class *</label>
                                    <select
                                        name="targetClass"
                                        value={formData.targetClass}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        {pageData.feeData?.map((f, i) => (
                                            <option key={i} value={f.Class}>
                                                {f.Class}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Previous School</label>
                                    <input
                                        type="text"
                                        name="previousSchool"
                                        value={formData.previousSchool}
                                        onChange={handleInputChange}
                                        placeholder="Name of last school"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Residential Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Enter full address"
                                />
                            </div>

                            {/* ===== Payment Details ===== */}
                            <h3 className="formSectionTitle">Admission Fee Payment</h3>

                            <div className="paymentBox">
                                <p className="paymentNote">
                                    Transfer the admission fee to any of the following accounts and upload your payment screenshot.
                                </p>

                                <div className="paymentMethods">
                                    <div className="paymentMethod">
                                        <h4>EasyPaisa</h4>
                                        <p>
                                            <b>Account:</b> {pageData?.paymentGateways?.easypaisa?.accountNumber || "0345-1234567"}
                                        </p>
                                        <p>
                                            <b>Name:</b> {pageData?.paymentGateways?.easypaisa?.accountTitle || "ABC School"}
                                        </p>
                                    </div>

                                    <div className="paymentMethod">
                                        <h4>JazzCash</h4>
                                        <p>
                                            <b>Account:</b> {pageData?.paymentGateways?.jazzcash?.accountNumber || "0300-7654321"}
                                        </p>
                                        <p>
                                            <b>Name:</b> {pageData?.paymentGateways?.jazzcash?.accountTitle || "ABC School"}
                                        </p>
                                    </div>

                                    <div className="paymentMethod">
                                        <h4>Bank Transfer</h4>
                                        <p>
                                            <b>Bank:</b> {pageData?.paymentGateways?.bank?.bankName || "HBL"}
                                        </p>
                                        <p>
                                            <b>Account #:</b> {pageData?.paymentGateways?.bank?.accountNumber || "1234567890123"}
                                        </p>
                                        <p>
                                            <b>IBAN:</b> {pageData?.paymentGateways?.bank?.iban || "PK12HABB0000001234567890"}
                                        </p>
                                        <p>
                                            <b>Name:</b> {pageData?.paymentGateways?.bank?.accountTitle || "ABC School"}
                                        </p>
                                    </div>
                                </div>

                                {/* Upload Screenshot */}
                                <div className="form-group full-width">
                                    <label>Upload Payment Screenshot *</label>

                                    <input
                                        type="file"
                                        name="paymentScreenshot"
                                        accept="image/*"
                                        required
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            setFormData((prev) => ({
                                                ...prev,
                                                paymentScreenshot: file,
                                            }));

                                            setPaymentPreview(URL.createObjectURL(file));
                                        }}
                                    />

                                    <small className="uploadHint">
                                        Upload JPG / PNG screenshot of your payment confirmation.
                                    </small>

                                    {/* Preview */}
                                    {paymentPreview && (
                                        <div className="paymentPreviewBox">
                                            <p className="previewTitle">Payment Screenshot Preview</p>
                                            <img src={paymentPreview} alt="Payment Preview" className="paymentPreviewImg" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== Submit Button ===== */}
                            <button
                                type="submit"
                                className={`submit-admission-btn ${isSubmitting ? "btn-disabled" : ""}`}
                                disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="btnLoader"></span>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </form>
                    </div>
                </section>

                {/* GALLERY */}
                {
                    (pageData.gallery && pageData.gallery[0])
                        ?
                        <section className="S_gallery SP_Sec">
                            <h2 className="SP_Sec_hd">Gallery</h2>
                            <div className="S_gallery-flex">
                                {pageData.gallery?.map((img, i) => (
                                    <img key={i} src={img} alt="" />
                                ))}
                            </div>
                        </section>
                        :
                        <></>
                }

                {/* RATING */}
                <RatingSection 
                    ratingData={pageData.ratingData} 
                    reviews={pageData.detailedReviews || []} 
                    id={id} 
                    cata={cata} 
                />
            </section>
            :
            <section className="S_main_Sec">
                {/* HERO */}
                <section
                    className="GlassHeroBG"
                    style={{
                        background: `linear-gradient(135deg, rgba(0,0,0,.25), rgba(0,0,0,.35)),`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        minHeight: "70vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        textAlign: "center",
                        position: "relative"
                    }}
                >
                    <div className="GlassHeroBG-content">
                        <h1>Institute Under Processing</h1>
                        <p className="GlassHeroBG-sub">
                            This institute is currently being set up. Once all procedures are
                            complete, it will be available for public visits.
                        </p>
                        <button
                            className="GlassHeroBG-btn"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </button>
                    </div>
                    <div className="blurShape s1"></div>
                    <div className="blurShape s2"></div>
                </section>

                {/* INFO SECTION */}
                <section className="S_about">
                    <div className="S_about-content">
                        <h2 className="SP_Sec_hd">What's Happening?</h2>
                        <p>
                            Our team is working to complete all the necessary details for this
                            institute. Soon, you'll be able to explore the institute's profile,
                            staff, facilities, and more.
                        </p>
                    </div>
                    <img
                        src="https://images.pexels.com/photos/12593060/pexels-photo-12593060.jpeg"
                        alt="Under Construction"
                    />
                </section>

                {/* QUICK NOTE CARD */}
                <section className="QI-dashboard SP_Sec">
                    <h2 className="SP_Sec_hd">Quick Note</h2>
                    <div className="dash-grid">
                        <div className="dash-card" style={{ textAlign: "center" }}>
                            <h2>🚧 Under Construction</h2>
                            <p>
                                The institute is not yet publicly available. Once all admin
                                approvals and content setups are completed, this page will go live.
                            </p>
                            <p style={{ fontStyle: "italic", color: "#666" }}>
                                Thank you for your patience!
                            </p>
                        </div>
                    </div>
                </section>
            </section>
    )
}









