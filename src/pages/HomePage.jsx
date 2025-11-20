import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ServicesSection from "../components/home/ServicesSection";
import ProgramFilterSection from "../components/home/ProgramFilterSection.jsx";
import HighlightsStrip from "../components/home/HighlightsStrip";
import FeaturedProgramsSection from "../components/home/FeaturedProgramsSection";

function HomePage() {
  // TODO: later this comes from your backend
  const services = [
    {
      key: "academy",
      name: "Academy Programs",
      shortDescription:
        "Season-long training cycles with teams by age group, clear structure, and regular fixtures.",
      slug: "academy-programs",
    },
    {
      key: "clinics",
      name: "Clinics & Camps",
      shortDescription:
        "Short, intensive clinics and camps focused on skills, fitness, and technical development.",
      slug: "clinics-and-camps",
    },
    {
      key: "tournaments",
      name: "Tournaments",
      shortDescription:
        "Organized competitions for academy teams and invited clubs, with live standings and results.",
      slug: "tournaments",
    },
    {
      key: "merch",
      name: "Merchandise",
      shortDescription:
        "Official Wizards kits, training gear, and accessories available through our online store.",
      slug: "merchandise",
    },
  ];

  return (
    <div className="app-root">
      <Navbar />

      <main className="home">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero__overlay" />

          <div className="hero__inner container">
            <div className="hero__content">
              <p className="hero__eyebrow">Wizards Football Academy</p>
              <h1 className="hero__title">
                Forging the next generation of <span>wizards</span> on the
                pitch.
              </h1>
              <p className="hero__subtitle">
                Elite youth football training with professional coaches, modern
                facilities, and a safe environment where every player can grow,
                compete, and have fun.
              </p>

              <div className="hero__actions">
                <button className="btn btn--primary">Explore programs</button>
                <a href="/login" className="btn btn--outline">Log in / Create account</a>
              </div>

              <div className="hero__meta">
                <span>⚽ Ages U8 – U18</span>
                <span>📍 Multiple locations</span>
                <span>📅 Seasonal & year-round programs</span>
              </div>
            </div>

            <div className="hero__card">
              <p className="hero__card-label">Next season</p>
              <p className="hero__card-title">Spring 2026 enrollment</p>
              <p className="hero__card-text">
                Limited spots available. Secure your wizard&apos;s place today.
              </p>
              <button className="btn btn--ghost">View upcoming programs</button>
            </div>
          </div>
        </section>

        {/* NEW: SERVICES GRID */}
        <ServicesSection services={services} />
        <ProgramFilterSection />
        <HighlightsStrip />
        <FeaturedProgramsSection />

                <FeaturedProgramsSection />
        
        {/* Floating Support Button */}
        <button className="support-button" onClick={() => document.getElementById('support-box').classList.toggle('active')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>

        {/* Support Box */}
        <div id="support-box" className="support-box">
          <div className="support-box__header">
            <h3>Ask for help</h3>
            <button className="support-box__close" onClick={() => document.getElementById('support-box').classList.remove('active')}>×</button>
          </div>
          <div className="support-box__content">
            <div className="support-box__status">
              <div className="support-box__status-indicator"></div>
              <span>Ask Us</span>
            </div>
            <p className="support-box__message">Sorry, chat is offline but you can still get help.</p>
            <button className="btn btn--primary support-box__contact-btn">Contact us</button>
          </div>
        </div>
      </main>

      
      

      <Footer />
    </div>
  );
}

export default HomePage;
