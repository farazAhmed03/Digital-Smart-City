import React, { useEffect, useState } from "react";
import "./CourseLandingPage.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as OCApi from "../../../ApiCalls/OnlineCourseApi";
import {
    Star, Clock, User, Globe, ChevronRight, PlayCircle, FileText,
    Video, Award, Upload, CheckCircle2, ChevronDown, Share2,
    HelpCircle, XCircle, Info, BookOpen, Layers, Target
} from "lucide-react";
import { toast } from "react-toastify";

const CourseLandingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [settings, setSettings] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFilePreview, setSelectedFilePreview] = useState(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            OCApi.getCourseDetail(id, setCourse);
        }
        OCApi.getOCSettings(setSettings);
    }, [id]);

    useEffect(() => {
        let timer;
        if (submissionSuccess) {
            timer = setTimeout(() => {
                setSubmissionSuccess(false);
                setSelectedFilePreview(null);
            }, 8000);
        }
        return () => clearTimeout(timer);
    }, [submissionSuccess]);

    if (!course) return <div className="loading-spinner">Loading course details...</div>;

    const scrollToEnroll = () => {
        const element = document.getElementById("enroll-section");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size must be less than 2MB.");
                e.target.value = "";
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error("Please upload an image file (JPG, PNG).");
                e.target.value = "";
                return;
            }
            setSelectedFilePreview(URL.createObjectURL(file));
        }
    };

    const handleEnrollmentSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const phone = formData.get("phone");
        if (!/^\d{10,13}$/.test(phone)) {
            toast.error("Invalid phone number. Please enter 10-13 digits.");
            return;
        }

        formData.append("courseId", course._id);
        formData.append("courseName", course.title);

        const success = await OCApi.enrollInCourse(formData, setSubmitting);
        if (success) {
            setSubmissionSuccess(true);
            e.target.reset();
        }
    };

    return (
        <div className="course-landing-page modern-light-theme text-gray-800">
            {/* BREADCRUMBS */}
            <nav className="breadcrumb-nav-simple">
                <div className="container-lg">
                    <Link to="/" className="bc-link">Home</Link>
                    <ChevronRight size={14} className="bc-sep" />
                    <Link to="/edu" className="bc-link">Education</Link>
                    <ChevronRight size={14} className="bc-sep" />
                    <Link to="/edu/onlineCourses" className="bc-link">{settings?.uiTexts?.viewDetailsBtn || "Online Courses"}</Link>
                    <ChevronRight size={14} className="bc-sep" />
                    <span className="bc-current">{course.title}</span>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="course-hero-v3">
                <div className="container-lg">
                    <div className="hero-grid-v3">
                        <div className="hero-content">
                            <span className="OC_category-tag">{course.category}</span>
                            <h1 className="course-title-v3">{course.title}</h1>
                            <p className="course-subtitle-v3">{course.shortDescription}</p>

                            <div className="course-meta-v3">
                                <div className="meta-item">
                                    <Star size={18} className="star-filled" fill="currentColor" />
                                    <span>5.0 (Vibrant Community)</span>
                                </div>
                                <div className="meta-item">
                                    <User size={18} />
                                    <span>{course.instructor}</span>
                                </div>
                                <div className="meta-item">
                                    <Globe size={18} />
                                    <span>{course.mode === "Online" ? (course.platform || "Online") : (course.address || "Physical")}</span>
                                </div>
                            </div>

                            <button className="btn-hero-enroll" onClick={scrollToEnroll}>
                                Enroll Now — Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT GRID */}
            <main className="course-main-layout">
                <div className="container-lg">
                    <div className="layout-grid">
                        {/* LEFT COLUMN: COURSE INFO */}
                        <div className="main-content-column">
                            {/* VIDEO/IMAGE PREVIEW */}
                            <div className="course-preview-card">
                                <img src={course.image} alt={course.title} className="preview-image" />
                            </div>

                            {/* WHAT YOU WILL LEARN */}
                            {course.whatYouWillLearn?.length > 0 && (
                                <section className="info-section">
                                    <h2 className="section-title-v3">What you will learn</h2>
                                    <div className="outcomes-grid-v3">
                                        {course.whatYouWillLearn.map((item, i) => (
                                            <div className="outcome-item-v3" key={i}>
                                                <CheckCircle2 size={20} className="check-icon" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* DESCRIPTION */}
                            <section className="info-section">
                                <h2 className="section-title-v3">Course Overview</h2>
                                <div className="rich-text-content">
                                    <p>{course.fullDescription}</p>
                                </div>

                                <div className="audience-box">
                                    <h3 className="sub-title-v3">Who is this course for?</h3>
                                    <p>{course.whoIsThisCourseFor || "Anyone looking to master these skills."}</p>
                                </div>
                            </section>

                            {/* SKILLS */}
                            {course.skillsYouWillGain?.length > 0 && (
                                <section className="info-section">
                                    <h2 className="section-title-v3">Skills you will gain</h2>
                                    <div className="skills-tags-v3">
                                        {course.skillsYouWillGain.map((s, i) => (
                                            <span key={i} className="skill-tag">{s}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* CURRICULUM */}
                            {course.curriculum?.length > 0 && (
                                <section className="info-section">
                                    <div className="section-header-v3">
                                        <h2 className="section-title-v3">Course Content</h2>
                                        <span className="modules-count">{course.curriculum.length} Modules</span>
                                    </div>
                                    <div className="modern-accordion">
                                        {course.curriculum.map((section, idx) => (
                                            <div className={`accordion-item ${activeSection === idx ? "active" : ""}`} key={idx}>
                                                <div className="accordion-trigger" onClick={() => setActiveSection(activeSection === idx ? -1 : idx)}>
                                                    <div className="trigger-left">
                                                        <ChevronDown className="chevron-icon" />
                                                        <span className="week-label">Week {idx + 1}</span>
                                                        <span className="section-name">{section.sectionTitle}</span>
                                                    </div>
                                                    <span className="lesson-count">{section.lessons?.length || 0} lessons</span>
                                                </div>
                                                <div className="accordion-panel">
                                                    {section.lessons?.map((lesson, lIdx) => (
                                                        <div className="lesson-row" key={lIdx}>
                                                            <div className="lesson-info">
                                                                {lesson.lessonType === "Video" ? <PlayCircle size={16} /> : <FileText size={16} />}
                                                                <span>{lesson.lessonTitle}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* FINANCIALS */}
                            <section className="info-section payment-methods-card">
                                <h2 className="section-title-v3">Payment Methods</h2>
                                <div className="payment-grid-v3">
                                    <div className="payment-method">
                                        <div className="p-icon"><Globe /></div>
                                        <div className="p-details">
                                            <h4>EasyPaisa</h4>
                                            <p className="p-num">{settings?.feeInfo?.easyPaisaNumber || "0348 9437142"}</p>
                                            <p className="p-holder">{settings?.feeInfo?.easyPaisaAccountHolder || "Digital Kohat Team"}</p>
                                        </div>
                                    </div>
                                    <div className="payment-method">
                                        <div className="p-icon"><Award /></div>
                                        <div className="p-details">
                                            <h4>Bank Transfer</h4>
                                            <p className="p-num">{settings?.feeInfo?.bankDetails || "HBL - 1234 5678 9012"}</p>
                                            <p className="p-holder">{settings?.feeInfo?.bankAccountHolder || "Branch: Kohat Cantt"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="payment-note">
                                    <Info size={18} />
                                    <span>{settings?.feeInfo?.instructions || "Please upload your payment screenshot after transfer."}</span>
                                </div>
                            </section>

                            <section id="enroll-section" className="info-section registration-card-v3">
                                {submissionSuccess ? (
                                    <div className="success-state-v3">
                                        <CheckCircle2 size={64} className="success-icon" />
                                        <h2>Application Received!</h2>
                                        <p>{settings?.registration?.successMessage || "You have successfully submitted your interest. Our registrar will finalize your seat shortly."} <strong>You will be notified on your provided Gmail address once it is reviewed.</strong></p>
                                        <button className="btn-secondary-v3" onClick={() => setSubmissionSuccess(false)}>Send Another Application</button>
                                    </div>
                                ) : !course.isPublished ? (
                                    <div className="error-state-v3">
                                        <XCircle size={64} className="error-icon" />
                                        <h2>Registration Paused</h2>
                                        <p>Enrollments for this course are temporarily disabled.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="registration-header-v3">
                                            <h2 className="section-title-v3">Enroll in this Course</h2>
                                            <p className="registration-sub">Complete the form below to secure your spot.</p>
                                        </div>
                                        <form className="registration-form-v3" onSubmit={handleEnrollmentSubmit}>
                                            <div className="form-grid-v3">
                                                <div className="form-group-v3">
                                                    <label>Full Name</label>
                                                    <input type="text" name="fullName" required placeholder="Ali Ahmed" />
                                                </div>
                                                <div className="form-group-v3">
                                                    <label>Phone Number (Mobile)</label>
                                                    <input type="tel" name="phone" required placeholder="03XXXXXXXXX" />
                                                </div>
                                                <div className="form-group-v3">
                                                    <label>WhatsApp Number</label>
                                                    <input type="tel" name="whatsappNumber" required placeholder="03XXXXXXXXX" />
                                                </div>
                                                <div className="form-group-v3">
                                                    <label>Email Address <span style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#666' }}>(Enter the Gmail address you actively use to receive updates regarding your request.)</span></label>
                                                    <input type="email" name="email" required placeholder="ali@example.com" />
                                                </div>
                                                <div className="form-group-v3">
                                                    <label>Current City</label>
                                                    <input type="text" name="city" required placeholder="Kohat" />
                                                </div>
                                            </div>

                                            <div className="form-group-v3">
                                                <label>Learning Preference</label>
                                                <div className="radio-group-v3">
                                                    <label className="radio-option">
                                                        <input type="radio" name="classMode" value="Online" defaultChecked />
                                                        <span>Online</span>
                                                    </label>
                                                    <label className="radio-option">
                                                        <input type="radio" name="classMode" value="Physical" />
                                                        <span>Physical</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="upload-box-v3">
                                                <label>Payment Receipt Screenshot</label>
                                                <div className="dropzone-v3">
                                                    <input type="file" name="paymentScreenshot" accept="image/*" required id="modal-upload" onChange={handleFileChange} />
                                                    <label htmlFor="modal-upload" className="dropzone-label">
                                                        <Upload size={24} />
                                                        <span>{selectedFilePreview ? "File selected" : "Click to upload receipt"}</span>
                                                    </label>
                                                </div>
                                                {selectedFilePreview && <img src={selectedFilePreview} alt="Preview" className="upload-preview-v3" />}
                                            </div>

                                            <button type="submit" className="btn-primary-v3 w-full" disabled={submitting}>
                                                {submitting ? "Processing Application..." : "Finalize Enrollment"}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </section>
                        </div>

                        {/* RIGHT COLUMN: STICKY SIDEBAR */}
                        <aside className="sidebar-column">
                            <div className="sticky-sidebar-card">
                                <div className="pricing-header">
                                    <span className="price-label">Course Price</span>
                                    <h2 className="main-price">{course.price} <span className="pkr">PKR</span></h2>
                                </div>

                                <button
                                    className={`btn-primary-v3 ${course.status === "Closed" ? 'disabled' : ''}`}
                                    disabled={course.status === "Closed"}
                                    onClick={scrollToEnroll}
                                >
                                    {course.status === "Closed"
                                        ? (settings?.uiTexts?.closedStatusText || "Closed")
                                        : (settings?.uiTexts?.enrollNowBtn || "Enroll Now")}
                                </button>

                                <div className="course-highlights">
                                    <h3>This course includes:</h3>
                                    <ul>
                                        <li><Clock size={18} /> <span>{course.duration || "4 Weeks"} duration</span></li>
                                        <li><Layers size={18} /> <span>{course.curriculum?.length || 0} Modules</span></li>
                                        <li><Globe size={18} /> <span>Full access on mobile/web</span></li>
                                        <li><Target size={18} /> <span>Hands-on projects</span></li>
                                        <li><Award size={18} /> <span>Certificate of completion</span></li>
                                    </ul>
                                </div>

                                <div className="sidebar-footer">
                                    <button className="btn-share" onClick={() => {
                                        navigator.share({ title: course.title, url: window.location.href })
                                            .catch(() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.info("Link copied to clipboard!");
                                            });
                                    }}>
                                        <Share2 size={16} /> Share Course
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseLandingPage;
