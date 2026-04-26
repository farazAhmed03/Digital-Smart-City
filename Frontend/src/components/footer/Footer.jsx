import "./Footer.css";
import { FaFacebookF, FaInstagram, FaLinkedin, FaTiktok, FaWhatsapp, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import footerlogo from "../imgs/footerlogo.jpg";

const Footer = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Simulating API call for now since there's no backend endpoint yet
    toast.success("Thank you for subscribing! ✅");
    setEmail("");
  };

  const handleComingSoon = (e) => {
    e.preventDefault();
    navigate("/health/coming-soon"); // Reusing the existing coming-soon route
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <div className="footer-logo">
            <Link to="/">
              <img src={footerlogo} alt="Logo" className="footer-img" />
            </Link>
          </div>

          <div className="contact-info">
            <p>
              <FaEnvelope className="footer-icon" /> digitalsmartcities@gmail.com
            </p>
            <p>
              <FaPhoneAlt className="footer-icon" /> +92 334 8771396
            </p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/health/coming-soon" onClick={handleComingSoon}>Features</Link></li>
              <li><Link to="/AboutUs">About Us</Link></li>
              <li><Link to="/ContactUs">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><Link to="/health/coming-soon" onClick={handleComingSoon}>FAQ</Link></li>
              <li><Link to="/health/coming-soon" onClick={handleComingSoon}>Help Center</Link></li>
              <li><Link to="/health/coming-soon" onClick={handleComingSoon}>Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <h4>Get In Touch!</h4>
          <form className="subscribe-box" onSubmit={()=> alert("We are coming soon...")}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>

          <div className="social-icons">
            <a href="https://www.facebook.com/share/1AGR4azbuD/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}><FaFacebookF /></a>
            <a href="https://www.linkedin.com/company/digital-smart-cities-hub/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}><FaLinkedin /></a>
            <a href="https://www.tiktok.com/@the.dsch" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}><FaTiktok /></a>
            <a href="https://www.instagram.com/the.dsc.hub" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}><FaInstagram /></a>
            <a href="https://chat.whatsapp.com/Eo8fEtQPejrEV58pfnPhWK" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <p>© 2025 Digital Smart Cities Hub (SMC-PVT LTD). All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;