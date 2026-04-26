import React, { useContext, useEffect, useState } from "react";
import "./ContactUs.css";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaUser,
  FaRegEnvelope,
  FaPenFancy,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaMobileAlt,
  FaTiktok,
  FaWhatsapp,
  FaLaptop,
} from "react-icons/fa";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { AppContext } from "../../Store/AppContext";
import AutofillNote from "../../components/AutofillNote/AutofillNote";

const ContactUs = () => {
  const { userData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  let [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (userData) {
      const nameParts = (userData.fullName || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: userData.email || "",
        phone: userData.phone || ""
      }));
    }
  }, [userData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".fade-section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, formData);
      if (response.data.success) {
        toast.success("Your message has been sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        toast.error(response.data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setFormSubmitted(false);
    }
  };

  return (
    <div className="contactus-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <section className="contact-hero fade-section">
        <div className="hero-left">
          <h1>Get in <strong>Touch</strong></h1>
          <p>Have questions? We're here to help. Reach out to our team for support, inquiries, or just to say hello.</p>
          <button className="hero-btn" onClick={() => window.scrollTo({ top: document.querySelector('.contact-form-wrapper').offsetTop - 100, behavior: 'smooth' })} >
            Send a Message
          </button>
        </div>
        <div className="hero-right">
          <div className="hero-phone">
            <FaMobileAlt />
          </div>
        </div>

        {/* Floating Background Icons */}
        <FaLaptop className="hero-icon icon1" />
        <FaEnvelope className="hero-icon icon2" />
        <FaPhoneAlt className="hero-icon icon3" />
      </section>

      {/* CONTACT FORM */}
      <section className="contact-form-wrapper fade-section">
        <h2 className="form-headingg">
          Send Us a <strong>Message</strong>
        </h2>

        <form onSubmit={handleSubmit}>
          <AutofillNote />
          <div className="form-row">
            <div className="form-input">
              <FaUser />
              <input 
                type="text" 
                placeholder="First Name" 
                value={formData.firstName} 
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                required 
              />
            </div>
            <div className="form-input">
              <FaUser />
              <input 
                type="text" 
                placeholder="Last Name" 
                value={formData.lastName} 
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-input">
              <FaRegEnvelope />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
            </div>
            <div className="form-input">
              <FaPhoneAlt />
              <input 
                type="text" 
                placeholder="Contact Number" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                required 
              />
            </div>
          </div>
          <div className="form-input full-width">
            <FaPenFancy />
            <input 
              type="text" 
              placeholder="Subject" 
              value={formData.subject} 
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
              required 
            />
          </div>
          <div className="form-input full-width">
            <FaRegEnvelope />
            <textarea 
              placeholder="Your Message" 
              rows="5" 
              value={formData.message} 
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              required 
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={formSubmitted}>
            {formSubmitted ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
      {/* Social Media Links */}
      <section className="dsch-pretty-social-wrapper fade-section">
        <h2 className="dsch-pretty-social-heading">
          <span></span>
          Connect With Us
        </h2>

        <div className="dsch-pretty-social-grid">
          <a
            href="https://www.instagram.com/the.dsc.hub?igsh=NjN5c3V5MjNoOWpp"
            target="_blank"
            rel="noopener noreferrer"
            className="dsch-pretty-social-card insta"
          >
            <div className="dsch-pretty-icon-circle">
              <FaInstagram />
            </div>
            <div className="dsch-pretty-text">
              <h4>Instagram</h4>
              <p>Follow our updates</p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61585451393565"
            target="_blank"
            rel="noopener noreferrer"
            className="dsch-pretty-social-card fb"
          >
            <div className="dsch-pretty-icon-circle">
              <FaFacebookF />
            </div>
            <div className="dsch-pretty-text">
              <h4>Facebook</h4>
              <p>Join our community</p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/digital-smart-cities-hub-b354a3394"
            target="_blank"
            rel="noopener noreferrer"
            className="dsch-pretty-social-card linkedin"
          >
            <div className="dsch-pretty-icon-circle">
              <FaLinkedinIn />
            </div>
            <div className="dsch-pretty-text">
              <h4>LinkedIn</h4>
              <p>Professional network</p>
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@the.dsc.hub?_r=1&_t=ZS-92IgxSLr04r"
            target="_blank"
            rel="noopener noreferrer"
            className="dsch-pretty-social-card tiktok"
          >
            <div className="dsch-pretty-icon-circle">
              <FaTiktok />
            </div>
            <div className="dsch-pretty-text">
              <h4>TikTok</h4>
              <p>Watch our content</p>
            </div>
          </a>

          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="dsch-pretty-social-card youtube"
          >
            <div className="dsch-pretty-icon-circle">
              <FaYoutube />
            </div>
            <div className="dsch-pretty-text">
              <h4>YouTube</h4>
              <p>Watch & subscribe</p>
            </div>
          </a>

          <a
            href="https://whatsapp.com/channel/0029VbBL7YwC6Zvdg6XMux1t"
            target="_blank"
            rel="noopener noreferrer"
            className="dsch-pretty-social-card whatsapp"
          >
            <div className="dsch-pretty-icon-circle">
              <FaWhatsapp />
            </div>
            <div className="dsch-pretty-text">
              <h4>WhatsApp</h4>
              <p>Instant updates</p>
            </div>
          </a>
        </div>
      </section>
      {/* MAP */}
      <section className="contact-map-wrapper fade-section">
        <h2 className="map-heading">
          <span></span>Our Location
        </h2>

        <div className="map-container">
          <iframe
            title="KUST Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.157596916694!2d71.44370301472682!3d33.523287952867086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d8ec241a467237%3A0xf7409abf0918f110!2sKohat%20University%20of%20Science%20%26%20Technology!5e0!3m2!1sen!2s!4v1468696336911!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>
      {/* CONTACT INFO CARDS */}
      <section className="contact-info-wrapper fade-section">
        <h2 className="contactt-heading">
          <span className="contactt-line"></span>
          Contact Info
        </h2>
        <div className="info-cards">
          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <h3>Address</h3>
            <p>Bannu Rd, Kohat University of Science & Technology, KPK, Pakistan</p>
          </div>
          <div className="info-card">
            <FaPhoneAlt className="info-icon" />
            <h3>Phone</h3>
            <p>+92 922 554 578</p>
          </div>
          <div className="info-card">
            <FaEnvelope className="info-icon" />
            <h3>Email</h3>
            <p>info@kust.edu.pk</p>
          </div>
          <div className="info-card">
            <FaClock className="info-icon" />
            <h3>Hours</h3>
            <p>Mon-Fri: 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </section>

      {/* EXTRA ANIMATED SECTION */}
      <section className="contact-extra-wrapper fade-section">
        <h2>Get In Touch Today!</h2>
        <p>We are ready to assist you with any inquiries. Don’t hesitate to contact us.</p>
        <div className="extra-animation"></div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
