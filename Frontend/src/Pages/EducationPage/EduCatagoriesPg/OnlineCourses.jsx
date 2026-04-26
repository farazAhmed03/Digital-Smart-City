import "./EduCatagories.css";
import "./OnlineCourses.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as OCApi from "../../../ApiCalls/OnlineCourseApi";
import { 
    FaStar, FaClock, FaMoneyBillWave, FaChevronRight,
    FaRocket, FaMedal, FaLaptop, FaUserGraduate, FaLightbulb, FaShieldAlt
} from "react-icons/fa";

export const OnlineCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [settings, setSettings] = useState(null);
    const navigate = useNavigate();
    const coursesRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        OCApi.getActiveCourses((data) => {
            setCourses(data);
            setFilteredCourses(data);
        });
        OCApi.getOCSettings(setSettings);
    }, []);

    const truncateDesc = (text, limit = 110) => {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    const scrollToCourses = () => {
        coursesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="OC-online-courses-listing">
            {/* PREMIUM HERO SECTION */}
            <div className="OC-courses-hero" style={settings?.hero?.backgroundImage ? { backgroundImage: `url(${settings.hero.backgroundImage})`, backgroundSize: 'cover' } : {}}>
                {/* Decorative Glowing Blobs */}
                <div className="OC-glowing-blob gb1"></div>
                <div className="OC-glowing-blob gb2"></div>

                <div className="OC-hero-content">
                    <div className="OC-hero-text-side">
                        <span className="OC-hero-badge">Digital Smart Skills Hub</span>
                        <h1 className="OC-hero-main-title">
                            {settings?.hero?.title || "Upgrade Your Skills with Digital Smart Skills Hub"}
                        </h1>
                        <p className="OC-hero-tagline">
                            {settings?.hero?.tagline || "Online & Physical Courses Available to Boost Your Career. Learn from industry experts and get certified."}
                        </p>
                        <div className="OC-hero-cta-group">
                            <button className="OC-btn-browse-courses" onClick={scrollToCourses}>
                                {settings?.hero?.ctaText || "Browse Courses"}
                            </button>
                           <Link to="/AboutUs" className="OC-btn-learn-more">
                                Why Choose Us?
                            </Link>
                        </div>
                    </div>
                    <div className="OC-hero-visual-side">
                        <div className="OC-hero-illustration">
                            <div className="OC-floating-card OC-c1">
                                <FaRocket />
                                <span>Career Growth</span>
                            </div>
                            <div className="OC-floating-card OC-c2">
                                <FaMedal />
                                <span>Certified</span>
                            </div>
                            <div className="OC-floating-card OC-c3">
                                <FaLaptop />
                                <span>Remote Learning</span>
                            </div>
                            <div className="OC-abstract-bg-shapes"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="OC-courses-controls">
                <div className="OC-controls-inner">
                    <div className="OC-breadcrumb-nav-simple">
                        <Link to="/">Home</Link> <FaChevronRight /> <span>Online Courses</span>
                    </div>
                    <div className="OC-search-filter-row">
                        <SearchBar SearchedInst={setFilteredCourses} AllInst={courses} />
                        <div className="OC-filter-dropdowns">
                            <select className="OC-modern-select" onChange={(e) => {
                                const val = e.target.value.toLowerCase();
                                setFilteredCourses(courses.filter(c => val === "" || c.category?.toLowerCase() === val));
                            }}>
                                <option value="">All Categories</option>
                                {[...new Set(courses.map(c => c.category))].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select className="OC-modern-select" onChange={(e) => {
                                const val = e.target.value;
                                setFilteredCourses(courses.filter(c => val === "" || c.mode === val));
                            }}>
                                <option value="">Course Mode</option>
                                <option value="Online">Online</option>
                                <option value="Physical">Physical</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="OC-courses-main-container" ref={coursesRef}>
                {/* COURSE GRID */}
                <div className="OC-courses-grid">
                    {filteredCourses?.map((course) => (
                        <div className="OC-course-card-premium" key={course._id} onClick={() => navigate(`/edu/onlineCourses/${course._id}`)}>
                            <div className="OC-card-media">
                                <img src={course.image} alt={course.title} />
                                <div className="OC-card-badge-mode">{course.category || "Course"}</div>
                                <div className="OC-card-overlay">
                                    <span>{settings?.uiTexts?.viewDetailsBtn || "View Details"}</span>
                                </div>
                            </div>
                            <div className="OC-card-body">
                                <div className="OC-card-rating">
                                    <div className="OC-stars">
                                        {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className="OC-starFilled" />)}
                                    </div>
                                    <span>5.0 (2k+)</span>
                                </div>
                                <h3 className="OC-course-title">{course.title}</h3>
                                <p className="OC-course-desc">{truncateDesc(course.shortDescription)}</p>
                                
                                <div className="OC-course-meta-info">
                                    <div className="OC-meta-item">
                                        <FaClock />
                                        <span>{course.duration || "4 Weeks"}</span>
                                    </div>
                                    <div className="OC-meta-item">
                                        <FaMoneyBillWave />
                                        <span>{course.price} PKR</span>
                                    </div>
                                </div>

                                <div className="OC-card-footer-btns">
                                    <button className="OC-btn-details" onClick={(e) => { e.stopPropagation(); navigate(`/edu/onlineCourses/${course._id}`); }}>
                                        {settings?.uiTexts?.viewDetailsBtn || "View Details"}
                                    </button>
                                    <button 
                                        className={`OC-btn-enroll-fast ${course.status === "Closed" ? 'closed-btn' : ''}`} 
                                        disabled={course.status === "Closed"}
                                        onClick={(e) => { e.stopPropagation(); navigate(`/edu/onlineCourses/${course._id}#enroll`); }}
                                    >
                                        {course.status === "Closed" 
                                            ? (settings?.uiTexts?.closedStatusText || "Closed") 
                                            : (settings?.uiTexts?.enrollNowBtn || "Enroll Now")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="OC-no-results">
                        <h3>Catalog Under Refresh</h3>
                        <p>We are currently updating our course offerings to bring you the best learning experiences. New courses will be available shortly.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
