import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Location.css";

const Location = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields.",
        confirmButtonColor: "#00a86b",
        background: "#0b0f0c",
        color: "#ffffff",
      });
      return;
    }

    // Simple success popup
    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      text: "Welcome back to Digital Kohat 🌿",
      showConfirmButton: false,
      timer: 2000,
      background: "#0b0f0c",
      color: "#ffffff",
    });

    // Clear fields
    setEmail("");
    setPassword("");
  };

  return (
    <section className="location-section" id="location">
      <div className="location-container">
        {/* ===== LEFT: LOGIN FORM ===== */}
        {/* <div className="login-box">
          <h2>Member Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="signup-text">
              Don’t have an account? <a href="#">Sign up</a>
            </p>
          </form>
        </div> */}

        {/* ===== RIGHT: MAP ===== */}
        <div className="map-box">
          <iframe
            title="Kohat University Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3314.441693979698!2d71.44163547467578!3d33.58109407334546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9d1a787ae83b%3A0xa4b9581d1e112a3a!2sKohat%20University%20of%20Science%20and%20Technology!5e0!3m2!1sen!2s!4v1730790039003!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Location;
