import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
// import ServicesSection from "../components/home/ServicesSection"; // removed
import ProgramFilterSection from "../components/home/ProgramFilterSection.jsx";
import HighlightsStrip from "../components/home/HighlightsStrip";
import FeaturedProgramsSection from "../components/home/FeaturedProgramsSection";
import FeaturedAcademiesSection from "../components/home/FeaturedAcademiesSection";
import useAuthStore from "../store/authStore";

function HomePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  // show "back to top" after scrolling a bit
  const [showToTop, setShowToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowToTop(window.scrollY > 200);
    onScroll(); // initialize on first render
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                Forging the next generation of <span>wizards</span> on the pitch.
              </h1>
              <p className="hero__subtitle">
                Elite youth football training with professional coaches, modern
                facilities, and a safe environment where every player can grow,
                compete, and have fun.
              </p>

              <div className="hero__actions">
                <Link to="/academy" className="btn btn--primary">
                  Explore programs
                </Link>
                {!user && (
                  <Link to="/login" className="btn btn--outline">
                    Log in / Create account
                  </Link>
                )}
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
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => navigate("/academy")}
              >
                View upcoming programs
              </button>
            </div>
          </div>
        </section>

        {/* ServicesSection removed */}

        <FeaturedAcademiesSection />
        <ProgramFilterSection />
        <HighlightsStrip />
        <FeaturedProgramsSection limit={3} />

        {/* Back-to-top floating button (reuses .support-button styling) */}
        <button
          className={`support-button to-top ${showToTop ? "is-visible" : ""}`}
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4l-7 7h4v7h6v-7h4l-7-7z" />
          </svg>
        </button>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
