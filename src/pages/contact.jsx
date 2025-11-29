import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import contactImg from "../assets/images/contact1.png"; // your uploaded image

import "../styles/contact.css"; // create this next

export default function ContactPage() {
  return (
    <div className="app-root">
      <Navbar />

      <main className="contact-page container">
        <h1 className="contact-title">Contact Us</h1>

        <div className="contact-card">
          <img src={contactImg} alt="Football player" className="contact-image" />

          <div className="contact-info">
            <p><strong>Phone:</strong> 76878913</p>
            <p><strong>Email:</strong> johnmilan556@gmail.com</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
