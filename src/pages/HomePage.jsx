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
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
