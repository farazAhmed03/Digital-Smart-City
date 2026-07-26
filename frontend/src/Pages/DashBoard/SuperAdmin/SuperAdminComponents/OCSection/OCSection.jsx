import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiImage, FiFileText, FiUser, FiInfo, FiMonitor, FiClock, FiDollarSign, FiVideo, FiSettings, FiSave, FiEye, FiEyeOff, FiList, FiTarget, FiStar, FiMapPin, FiServer, FiMessageSquare, FiToggleRight } from "react-icons/fi";
import * as OCApi from "../../../../../ApiCalls/OnlineCourseApi";
import "./OCSection.css";

export const OCSection = () => {
    const [activeTab, setActiveTab] = useState("COURSES");
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [settings, setSettings] = useState(null);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (activeTab === "COURSES") {
            OCApi.getAllCoursesAdmin(setCourses);
        } else if (activeTab === "ENROLLMENTS") {
            OCApi.getAllEnrollments(setEnrollments);
        } else if (activeTab === "SETTINGS") {
            OCApi.getOCSettings(setSettings);
        }
    }, [activeTab]);

    return (
        <section className="SA_content_body">
            <ToastContainer />
            <div className="SA_table_controls">
                <div className="SA_sub_nav">
                    <button
                        className={activeTab === "COURSES" ? "SA_active" : ""}
                        onClick={() => setActiveTab("COURSES")}
                    >
                        Courses
                    </button>
                    <button
                        className={activeTab === "ENROLLMENTS" ? "SA_active" : ""}
                        onClick={() => setActiveTab("ENROLLMENTS")}
                    >
                        Enrollments
                    </button>
                    <button
                        className={activeTab === "SETTINGS" ? "SA_active" : ""}
                        onClick={() => setActiveTab("SETTINGS")}
                    >
                        <FiSettings /> Settings
                    </button>
                    <button
                        className={activeTab === "FORM" ? "SA_active" : ""}
                        onClick={() => {
                            setEditData(null);
                            setActiveTab("FORM");
                        }}
                    >
                        <FiPlus /> {editData ? "Edit Course" : "New Course"}
                    </button>
                </div>
            </div>

            <div className="SA_table_container">
                {activeTab === "COURSES" && (
                    <CourseTable
                        data={courses}
                        setCourses={setCourses}
                        setActiveTab={setActiveTab}
                        setEditData={setEditData}
                    />
                )}
                {activeTab === "ENROLLMENTS" && (
                    <EnrollmentTable
                        data={enrollments}
                        setEnrollments={setEnrollments}
                    />
                )}
                {activeTab === "SETTINGS" && (
                    <SettingsForm
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
                {activeTab === "FORM" && (
                    <CourseForm
                        editData={editData}
                        setActiveTab={setActiveTab}
                        setCourses={setCourses}
                    />
                )}
            </div>
        </section>
    );
};

/* ---------------- COURSE TABLE ---------------- */

const CourseTable = ({ data, setCourses, setActiveTab, setEditData }) => {
    if (!data || data.length === 0) return <p className="no-data">No courses found.</p>;

    return (
        <table className="SA_custom_table">
            <thead>
                <tr>
                    <th>Course Info</th>
                    <th>Mode & Details</th>
                    <th>Plan / Instructor</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((course) => (
                    <tr className="SA_table_row" key={course._id}>
                        <td>
                            <div className="SA_admin_profile">
                                <img src={course.image} alt={course.title} className="course-thumb" />
                                <div>
                                    <p className="SA_admin_name">{course.title}</p>
                                    <span className="SA_inst_label">{course.category}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="SA_contact_stack">
                                {course.mode === "Online" ? (
                                    <div className="SA_contact_item"><FiMonitor className="text-blue" /> {course.platform || "Online"}</div>
                                ) : (
                                    <div className="SA_contact_item"><FiMapPin className="text-orange" /> {course.address || "Physical"}</div>
                                )}
                                <div className="SA_contact_item"><FiClock /> {course.duration}</div>
                            </div>
                        </td>
                        <td>
                            <div className="SA_contact_stack">
                                <div className="SA_contact_item"><FiUser /> {course.instructor}</div>
                                <div className="SA_contact_item"><FiDollarSign /> {course.price} PKR</div>
                            </div>
                        </td>
                        <td>
                            <span className={`SA_plan_badge ${course.status?.toLowerCase()}`}>
                                {course.status}
                            </span>
                        </td>
                        <td>
                            <div className="SA_row_actions">
                                <button className="SA_action_icon info" onClick={() => {
                                    setEditData(course);
                                    setActiveTab("FORM");
                                }}><FiEdit2 /></button>
                                <button className="SA_action_icon danger" onClick={() => OCApi.deleteCourse(course._id, setCourses)}><FiTrash2 /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

/* ---------------- ENROLLMENT TABLE ---------------- */

const EnrollmentTable = ({ data, setEnrollments }) => {
    const [rejectionId, setRejectionId] = useState(null);
    const [reason, setReason] = useState("");

    if (!data || data.length === 0) return <p className="no-data">No enrollment requests found.</p>;

    const handleAction = (id, status) => {
        if (status === "Rejected") {
            setRejectionId(id);
        } else {
            OCApi.updateEnrollmentStatus(id, "Approved", "", setEnrollments);
        }
    };

    const submitRejection = () => {
        if (!reason) return toast.error("Please enter a reason.");
        OCApi.updateEnrollmentStatus(rejectionId, "Rejected", reason, setEnrollments);
        setRejectionId(null);
        setReason("");
    };

    return (
        <div className="enrollment-wrapper">
            <table className="SA_custom_table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Course & Mode</th>
                        <th>Payment Proof</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((enr) => (
                        <tr className="SA_table_row" key={enr._id}>
                            <td>
                                <div className="SA_contact_stack">
                                    <div className="SA_admin_name">{enr.fullName}</div>
                                    <div className="SA_contact_item">{enr.phone}</div>
                                    <div className="SA_contact_item">{enr.email}</div>
                                </div>
                            </td>
                            <td>
                                <div className="SA_contact_stack">
                                    <div className="SA_admin_name">{enr.courseName}</div>
                                    <div className={`SA_contact_item mode-pill ${enr.classMode?.toLowerCase()}`}>
                                        {enr.classMode === "Online" ? <FiMonitor /> : <FiMapPin />} {enr.classMode}
                                    </div>
                                    <div className="SA_contact_item">{enr.city}</div>
                                </div>
                            </td>
                            <td>
                                <div className="payment-proof">
                                    <img src={enr.paymentScreenshot} alt="payment" onClick={() => window.open(enr.paymentScreenshot, '_blank')} />
                                    <span onClick={() => window.open(enr.paymentScreenshot, '_blank')}><FiImage /> View Proof</span>
                                </div>
                            </td>
                            <td>
                                <span className={`SA_plan_badge ${enr.status?.toLowerCase()}`}>{enr.status}</span>
                            </td>
                            <td>
                                {enr.status === "Pending" && (
                                    <div className="SA_row_actions">
                                        <button className="SA_action_icon success" onClick={() => handleAction(enr._id, "Approved")} title="Approve"><FiCheckCircle /></button>
                                        <button className="SA_action_icon danger" onClick={() => handleAction(enr._id, "Rejected")} title="Reject"><FiXCircle /></button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {rejectionId && (
                <div className="rejection-modal">
                    <div className="rejection-box">
                        <h3>Rejection Reason</h3>
                        <textarea
                            placeholder="Why is this enrollment being rejected?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="rejection-btns">
                            <button className="btn-cancel" onClick={() => setRejectionId(null)}>Cancel</button>
                            <button className="btn-submit" onClick={submitRejection}>Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ---------------- COURSE FORM ---------------- */

const CourseForm = ({ editData, setActiveTab, setCourses }) => {
    const [formData, setFormData] = useState({
        title: "",
        shortDescription: "",
        fullDescription: "",
        instructor: "",
        duration: "",
        price: "",
        category: "",
        mode: "Online",
        platform: "Google Meet",
        address: "",
        startDate: "",
        endDate: "",
        status: "Active",
        isPublished: false,
        whoIsThisCourseFor: "",
        whatsappGroupLink: ""
    });
    const [image, setImage] = useState(null);
    const [whatYouWillLearn, setWhatYouWillLearn] = useState([]);
    const [skillsYouWillGain, setSkillsYouWillGain] = useState([]);
    const [curriculum, setCurriculum] = useState([]);

    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                startDate: editData.startDate?.split('T')[0],
                endDate: editData.endDate?.split('T')[0],
                whatsappGroupLink: editData.whatsappGroupLink || ""
            });
            setWhatYouWillLearn(editData.whatYouWillLearn || []);
            setSkillsYouWillGain(editData.skillsYouWillGain || []);
            setCurriculum(editData.curriculum || []);
        }
    }, [editData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (!["curriculum", "whatYouWillLearn", "skillsYouWillGain"].includes(key)) {
                data.append(key, formData[key]);
            }
        });

        data.append("curriculum", JSON.stringify(curriculum));
        data.append("whatYouWillLearn", JSON.stringify(whatYouWillLearn));
        data.append("skillsYouWillGain", JSON.stringify(skillsYouWillGain));

        if (image) data.append("image", image);

        if (editData) {
            OCApi.updateCourse(editData._id, data, setActiveTab, setCourses);
        } else {
            OCApi.createCourse(data, setActiveTab, setCourses);
        }
    };

    return (
        <form className="oc-form" onSubmit={handleSubmit}>
            <div className="form-section-admin">
                <h3 className="section-title"><FiInfo /> Basic Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Course Title</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Instructor Name</label>
                        <input type="text" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Graphic Design" required />
                    </div>
                    <div className="form-group">
                        <label>Price (PKR)</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Duration & Timing</label>
                        <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 3 Months (Evning)" required />
                    </div>
                    <div className="form-group">
                        <label>Course Thumbnail</label>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} required={!editData} />
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp Group Link</label>
                        <input type="url" value={formData.whatsappGroupLink} onChange={(e) => setFormData({ ...formData, whatsappGroupLink: e.target.value })} placeholder="https://chat.whatsapp.com/..." required />
                    </div>
                </div>
            </div>

            <div className="form-section-admin">
                <h3 className="section-title"><FiMonitor /> Mode & Accessibility</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Teaching Mode</label>
                        <select value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })}>
                            <option value="Online">Online (Digital)</option>
                            <option value="Physical">Physical (On-site)</option>
                        </select>
                    </div>
                    {formData.mode === "Online" ? (
                        <div className="form-group">
                            <label>Online Platform</label>
                            <input type="text" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} placeholder="e.g. Zoom, Google Meet" />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Physical Address / Campus</label>
                            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="e.g. Kohat Plaza, 2nd Floor" />
                        </div>
                    )}
                </div>
            </div>

            <div className="form-section-admin">
                <h3 className="section-title"><FiFileText /> Course Descriptions</h3>
                <div className="form-group full-width">
                    <label>Short Summary (Visible on Cards)</label>
                    <textarea value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Max 120 characters recommended" required />
                </div>
                <div className="form-group full-width">
                    <label>Full Content / Overview</label>
                    <textarea value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} rows={5} required />
                </div>
                <div className="form-group full-width">
                    <label>Who This Course Is For?</label>
                    <textarea value={formData.whoIsThisCourseFor} onChange={(e) => setFormData({ ...formData, whoIsThisCourseFor: e.target.value })} rows={2} placeholder="e.g. Beginners, students, professionals looking to switch careers" />
                </div>
            </div>

            <div className="form-section-admin">
                <h3 className="section-title"><FiTarget /> Learning Objectives & Skills</h3>
                <div className="list-builders-grid">
                    <ListBuilder
                        title="What You Will Learn"
                        items={whatYouWillLearn}
                        setItems={setWhatYouWillLearn}
                        placeholder="Add a learning point..."
                        icon={<FiCheckCircle />}
                    />
                    <ListBuilder
                        title="Skills You Will Gain"
                        items={skillsYouWillGain}
                        setItems={setSkillsYouWillGain}
                        placeholder="Add a skill tag..."
                        icon={<FiStar />}
                    />
                </div>
            </div>

            <div className="form-section-admin">
                <CurriculumBuilder curriculum={curriculum} setCurriculum={setCurriculum} />
            </div>

            <div className="form-row status-published-row">
                <div className="form-group">
                    <label>Course Enrollment Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <option value="Active">Open (Accepting Enrollments)</option>
                        <option value="Closed">Closed (Full / Ended)</option>
                    </select>
                </div>
                <div className="form-group checkbox-group">
                    <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} id="isPublished" />
                    <label htmlFor="isPublished">Publish to Website</label>
                </div>
            </div>

            <div className="form-btns">
                <button type="button" className="btn-cancel" onClick={() => setActiveTab("COURSES")}>Cancel</button>
                <button type="submit" className="btn-submit">{editData ? "Update existing course" : "Launch new course"}</button>
            </div>
        </form>
    );
};

/* ---------------- LIST BUILDER COMPONENT ---------------- */

const ListBuilder = ({ title, items, setItems, placeholder, icon }) => {
    const [input, setInput] = useState("");

    const addItem = () => {
        if (!input.trim()) return;
        setItems([...items, input.trim()]);
        setInput("");
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    return (
        <div className="list-builder-box">
            <label>{title}</label>
            <div className="lb-input-group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    placeholder={placeholder}
                />
                <button type="button" onClick={addItem}><FiPlus /></button>
            </div>
            <div className="lb-items-list">
                {items.map((item, i) => (
                    <div key={i} className="lb-item">
                        {icon} <span>{item}</span>
                        <button type="button" onClick={() => removeItem(i)}>&times;</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ---------------- SETTINGS FORM ---------------- */

const SettingsForm = ({ settings, setSettings }) => {
    const [localSettings, setLocalSettings] = useState(null);
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        if (settings) setLocalSettings(settings);
    }, [settings]);

    if (!localSettings) return <p>Loading settings...</p>;

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("hero", JSON.stringify(localSettings.hero));
        formData.append("feeInfo", JSON.stringify(localSettings.feeInfo));
        formData.append("registration", JSON.stringify(localSettings.registration));
        formData.append("uiTexts", JSON.stringify(localSettings.uiTexts));
        if (heroImage) formData.append("heroImage", heroImage);

        const updated = await OCApi.updateOCSettings(formData);
        if (updated) setSettings(updated);
    };

    const updateNested = (section, field, value) => {
        setLocalSettings({
            ...localSettings,
            [section]: {
                ...localSettings[section],
                [field]: value
            }
        });
    };

    return (
        <div className="settings-form-wrapper">
            <div className="settings-header-admin">
                <h2><FiSettings /> Public Portal Configuration</h2>
                <button onClick={handleSave} className="btn-save-settings"><FiSave /> Save All Changes</button>
            </div>

            <div className="settings-grid-admin">
                {/* HERO SECTION */}
                <div className="settings-block shadow-sm">
                    <h3><FiMonitor /> Hero Section (Intro)</h3>
                    <div className="form-group">
                        <label>Main Heading</label>
                        <input type="text" value={localSettings.hero.title} onChange={(e) => updateNested("hero", "title", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Tagline / Subtext</label>
                        <textarea value={localSettings.hero.tagline} onChange={(e) => updateNested("hero", "tagline", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>CTA Button Text</label>
                        <input type="text" value={localSettings.hero.ctaText} onChange={(e) => updateNested("hero", "ctaText", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Hero Background Image</label>
                        <input type="file" onChange={(e) => setHeroImage(e.target.files[0])} />
                    </div>
                </div>

                {/* FEE INFORMATION */}
                <div className="settings-block shadow-sm">
                    <h3><FiDollarSign /> Fee & Payment Details</h3>
                    <div className="form-group">
                        <label>EasyPaisa Number</label>
                        <input type="text" value={localSettings.feeInfo.easyPaisaNumber} onChange={(e) => updateNested("feeInfo", "easyPaisaNumber", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>EasyPaisa Account Holder</label>
                        <input type="text" value={localSettings.feeInfo.easyPaisaAccountHolder} onChange={(e) => updateNested("feeInfo", "easyPaisaAccountHolder", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Bank Details (HBL/Other)</label>
                        <input type="text" value={localSettings.feeInfo.bankDetails} onChange={(e) => updateNested("feeInfo", "bankDetails", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Bank Account Info (Location/Holder)</label>
                        <input type="text" value={localSettings.feeInfo.bankAccountHolder} onChange={(e) => updateNested("feeInfo", "bankAccountHolder", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Payment Instructions</label>
                        <textarea value={localSettings.feeInfo.instructions} onChange={(e) => updateNested("feeInfo", "instructions", e.target.value)} />
                    </div>
                </div>

                {/* REGISTRATION FORM */}
                <div className="settings-block shadow-sm">
                    <h3><FiMessageSquare /> Registration Controls</h3>
                    <div className="form-group">
                        <label>Success Message (After Submission)</label>
                        <textarea value={localSettings.registration.successMessage} onChange={(e) => updateNested("registration", "successMessage", e.target.value)} />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>Enable Registration Form</label>
                        <input type="checkbox" checked={localSettings.registration.isEnabled} onChange={(e) => updateNested("registration", "isEnabled", e.target.checked)} />
                    </div>
                </div>

                {/* BUTTON TEXTS */}
                <div className="settings-block shadow-sm">
                    <h3><FiToggleRight /> Global UI Text Overrides</h3>
                    <div className="form-group">
                        <label>"View Details" Button</label>
                        <input type="text" value={localSettings.uiTexts.viewDetailsBtn} onChange={(e) => updateNested("uiTexts", "viewDetailsBtn", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>"Enroll Now" Button</label>
                        <input type="text" value={localSettings.uiTexts.enrollNowBtn} onChange={(e) => updateNested("uiTexts", "enrollNowBtn", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>"Course Completed" Button</label>
                        <input type="text" value={localSettings.uiTexts.courseCompletedBtn} onChange={(e) => updateNested("uiTexts", "courseCompletedBtn", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Closed Status Text</label>
                        <input type="text" value={localSettings.uiTexts.closedStatusText} onChange={(e) => updateNested("uiTexts", "closedStatusText", e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------------- CURRICULUM BUILDER ---------------- */

const CurriculumBuilder = ({ curriculum, setCurriculum }) => {
    const addSection = () => {
        setCurriculum([...curriculum, { sectionTitle: "", lessons: [] }]);
    };

    const removeSection = (sIdx) => {
        setCurriculum(curriculum.filter((_, i) => i !== sIdx));
    };

    const updateSectionTitle = (sIdx, title) => {
        const newCurr = [...curriculum];
        newCurr[sIdx].sectionTitle = title;
        setCurriculum(newCurr);
    };

    const addLesson = (sIdx) => {
        const newCurr = [...curriculum];
        newCurr[sIdx].lessons.push({ lessonTitle: "", lessonType: "Video", content: "" });
        setCurriculum(newCurr);
    };

    const updateLesson = (sIdx, lIdx, field, value) => {
        const newCurr = [...curriculum];
        newCurr[sIdx].lessons[lIdx][field] = value;
        setCurriculum(newCurr);
    };

    const removeLesson = (sIdx, lIdx) => {
        const newCurr = [...curriculum];
        newCurr[sIdx].lessons = newCurr[sIdx].lessons.filter((_, i) => i !== lIdx);
        setCurriculum(newCurr);
    };

    return (
        <div className="curriculum-builder">
            <div className="builder-header">
                <h3><FiList /> Course Week-by-Week Curriculum</h3>
                <button type="button" className="btn-add-section" onClick={addSection}><FiPlus /> Add New Week / Module</button>
            </div>

            {curriculum.length === 0 && <p className="empty-msg">No curriculum added yet.</p>}

            {curriculum.map((section, sIdx) => (
                <div key={sIdx} className="builder-section">
                    <div className="section-head-admin">
                        <span className="week-label">Week {sIdx + 1}</span>
                        <input
                            placeholder="Week Topic (e.g. Intro to UI/UX)"
                            value={section.sectionTitle}
                            onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                        />
                        <button type="button" className="btn-remove-icon" onClick={() => removeSection(sIdx)} title="Remove Week"><FiTrash2 /></button>
                    </div>

                    <div className="lessons-container">
                        {section.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="lesson-item-admin">
                                <div className="lesson-main">
                                    <input
                                        className="l-title"
                                        placeholder="Lesson/Session Title"
                                        value={lesson.lessonTitle}
                                        onChange={(e) => updateLesson(sIdx, lIdx, "lessonTitle", e.target.value)}
                                    />
                                    <div className="l-meta">
                                        <select
                                            value={lesson.lessonType}
                                            onChange={(e) => updateLesson(sIdx, lIdx, "lessonType", e.target.value)}
                                        >
                                            <option value="Video">Video</option>
                                            <option value="PDF">PDF / Document</option>
                                            <option value="Text">Standard Lesson</option>
                                        </select>
                                        <input
                                            className="l-content"
                                            placeholder={lesson.lessonType === "Text" ? "Lesson Description" : "Reference URL / Asset Link"}
                                            value={lesson.content}
                                            onChange={(e) => updateLesson(sIdx, lIdx, "content", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button type="button" className="btn-remove-lesson" onClick={() => removeLesson(sIdx, lIdx)}>&times;</button>
                            </div>
                        ))}
                        <button type="button" className="btn-add-lesson-admin" onClick={() => addLesson(sIdx)}><FiPlus /> Add Session to Week {sIdx + 1}</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
