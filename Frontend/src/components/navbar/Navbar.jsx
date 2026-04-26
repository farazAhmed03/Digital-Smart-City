import { useState, useContext, useEffect, useRef } from "react";
import "./Navbar.css";
import navlogo from "../imgs/navlogo.jpg";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Store/AppContext";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "ur", name: "اردو" },
  { code: "pa", name: "پنجابی" },
  { code: "ps", name: "پښتو" },
  { code: "sd", name: "سنڌي" },
  { code: "bal", name: "بلوچی" },
  { code: "skr", name: "سرائیکی" },
  { code: "kas", name: "کٲشُر" },
  { code: "fa", name: "فارسی" },
  { code: "ar", name: "العربية" },
  { code: "tr", name: "Türkçe" },
  { code: "zh-CN", name: "中文" },
  { code: "hi", name: "हिन्दी" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "bn", name: "বাংলা" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" }
];

const rtlLanguages = ['ur', 'ps', 'sd', 'bal', 'fa', 'ar'];

const Navbar = ({ variant }) => {
  const { customer, userData, logout } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  // States for Services
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isServicesLocked, setIsServicesLocked] = useState(false);

  // States for Language
  const [isLangHovered, setIsLangHovered] = useState(false);
  const [isLangLocked, setIsLangLocked] = useState(false);

  const [currentLang, setCurrentLang] = useState("en");
  const navigate = useNavigate();

  const servicesRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    // Detect existing Google Translate choice from cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const googTrans = getCookie('googtrans');
    const savedLang = localStorage.getItem('selectedLang');

    let detectedLang = "en";
    if (googTrans) {
      detectedLang = googTrans.split('/').pop();
    } else if (savedLang) {
      detectedLang = savedLang;
    }

    if (detectedLang) {
      setCurrentLang(detectedLang);
      document.body.dir = rtlLanguages.includes(detectedLang.toLowerCase()) ? 'rtl' : 'ltr';
    }

    // Click outside listener
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setIsServicesLocked(false);
        setIsServicesHovered(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangLocked(false);
        setIsLangHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = languages.find(l => l.code.toLowerCase() === currentLang.toLowerCase()) || languages[0];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("menu-open");
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsServicesLocked(false);
    setIsLangLocked(false);
    setIsServicesHovered(false);
    setIsLangHovered(false);
    document.body.classList.remove("menu-open");
  };

  const changeLanguage = (langCode) => {
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    localStorage.setItem('selectedLang', langCode);
    document.body.dir = rtlLanguages.includes(langCode.toLowerCase()) ? 'rtl' : 'ltr';
    setCurrentLang(langCode);
    setIsLangLocked(false);
    closeMenu();
    window.location.reload();
  };

  // Handlers for Services
  const handleServicesEnter = () => setIsServicesHovered(true);
  const handleServicesLeave = () => setTimeout(() => setIsServicesHovered(false), 300);
  const toggleServicesClick = (e) => {
    e.preventDefault();
    setIsServicesLocked(!isServicesLocked);
  };

  // Handlers for Language
  const handleLangEnter = () => setIsLangHovered(true);
  const handleLangLeave = () => setTimeout(() => setIsLangHovered(false), 300);
  const toggleLangClick = (e) => {
    e.preventDefault();
    setIsLangLocked(!isLangLocked);
  };

  const servicesOpen = isServicesHovered || isServicesLocked;
  const langOpen = isLangHovered || isLangLocked;

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* LOGO */}
          <div className="nav-logo" onClick={() => navigate("/")}>
            <img src={navlogo} alt="Logo" className="logo-img" />
            <h2>DIGITAL SMART CITIES HUB</h2>
          </div>

          {/* LINKS */}
          <div className={`nav-links ${isOpen ? "open" : ""}`}>
            <a onClick={() => { navigate("/"); closeMenu(); }}>Home</a>

            <a onClick={() => { navigate("/AboutUs"); closeMenu(); }}>About Us</a>

            {/* SERVICES DROPDOWN */}
            <div
              className="dropdown"
              ref={servicesRef}
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <a
                href="#services"
                className="dropdown-toggle"
                onClick={toggleServicesClick}
              >
                Services <ChevronDown size={14} style={{ marginLeft: "4px" }} />
              </a>

              <div
                className={`dropdown-menu ${servicesOpen ? "show" : ""}`}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <a onClick={() => { navigate("/Edu"); closeMenu(); }}>Education</a>
                <a onClick={() => { navigate("/food"); closeMenu(); }}>Food</a>
                <a onClick={() => { navigate("/health"); closeMenu(); }}>Health</a>
                <a onClick={() => { navigate("/business"); closeMenu(); }}>Business</a>
                <a onClick={() => { navigate("/tech"); closeMenu(); }}>Technicians/Labours</a>
                <a onClick={() => { navigate("/tourism"); closeMenu(); }}>Tourism/Traveling</a>
                <a onClick={() => { navigate("/brands"); closeMenu(); }}>Our Brands</a>
              </div>
            </div>

            <a onClick={() => { navigate("/ContactUs"); closeMenu(); }}>Contact Us</a>

            {/* LANGUAGE SWITCHER */}
            <div
              className="dropdown lang-switcher"
              ref={langRef}
              onMouseEnter={handleLangEnter}
              onMouseLeave={handleLangLeave}
            >
              <button type="button" className="lang-btn" onClick={toggleLangClick}>
                <Globe size={18} />
                <span>{currentLanguage.name}</span>
                <ChevronDown size={14} />
              </button>

              <div
                className={`dropdown-menu lang-menu ${langOpen ? "show" : ""}`}
                onMouseEnter={handleLangEnter}
                onMouseLeave={handleLangLeave}
              >
                {languages.map((lang) => (
                  <a key={lang.code} onClick={() => changeLanguage(lang.code)}>
                    {lang.name}
                  </a>
                ))}
              </div>
            </div>

            {
              (variant === "dashboard") ?
                <div className="nav-buttons">
                  <button type="button" className="btn sign" onClick={() => { closeMenu(); alert("You can access by upgrading your payment plan.") }}>Management System</button>
                  <button type="button" className="btn log" onClick={handleLogout}>Logout</button>
                </div>
                :
                (variant === "SuperAdmin")
                  ?
                  <></>
                  :
                  (!customer && !userData) ? (
                    <div className="nav-buttons">
                      <button type="button" className="btn sign" onClick={() => { closeMenu(); navigate("/user/register"); }}>Sign Up</button>
                      <button type="button" className="btn log" onClick={() => { closeMenu(); navigate("/user/login") }}>Log In</button>
                    </div>
                  ) : (
                    <div className="nav-buttons">
                      <button type="button" className="btn log" onClick={handleLogout}>Logout</button>
                    </div>
                  )
            }
          </div>

          {/* HAMBURGER */}
          <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </nav>

      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;
