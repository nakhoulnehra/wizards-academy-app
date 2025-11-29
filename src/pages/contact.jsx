import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import contactImg from "../assets/images/contact1.png";
import "../styles/contact.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add form submission logic
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="app-root">
      <Navbar />

      <main className="contact-page">
        {/* Animated Background Elements */}
        <div className="contact-bg-elements">
          <div className="bg-circle circle-1"></div>
          <div className="bg-circle circle-2"></div>
          <div className="bg-circle circle-3"></div>
        </div>

        <div className="container">
          <div className="contact-header">
            <h1 className="contact-title">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="contact-subtitle">
              Ready to join the Wizards family? We're here to answer all your questions 
              and help you start your football journey.
            </p>
          </div>

          <div className="contact-content">
            {/* Left Side - Contact Form */}
            <div className="contact-form-section">
              <div className="form-card">
                <h3>Send us a Message</h3>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your interests or questions..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn--primary btn--full">
                    Send Message
                    <span className="btn-arrow">→</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Contact Info & Image */}
            <div className="contact-info-section">
              <div className="info-card">
                <div className="contact-image-container">
                  <img src={contactImg} alt="Football training" className="contact-image" />
                  <div className="image-overlay"></div>
                </div>

                <div className="contact-details">
                  <h4>Contact Information</h4>
                  
                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-text">
                      <strong>Phone Number</strong>
                      <span>76878913</span>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    <div className="contact-text">
                      <strong>Email Address</strong>
                      <span>johnmilan556@gmail.com</span>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">🕒</div>
                    <div className="contact-text">
                      <strong>Response Time</strong>
                      <span>Within 24 hours</span>
                    </div>
                  </div>

                  <div className="social-links">
  <h5>Follow Us</h5>
  <div className="social-icons">
    <a 
      href="https://facebook.com/yourpage" 
      className="social-icon"
      aria-label="Follow us on Facebook"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
    <a 
      href="https://instagram.com/yourprofile" 
      className="social-icon"
      aria-label="Follow us on Instagram"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>
    <a 
      href="https://tiktok.com/@yourprofile" 
      className="social-icon"
      aria-label="Follow us on TikTok"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
      </svg>
    </a>
    <a 
      href="https://youtube.com/yourchannel" 
      className="social-icon"
      aria-label="Subscribe to our YouTube channel"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}