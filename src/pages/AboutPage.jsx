import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/about.css";
import "../styles/globals.css";
import "../styles/layout.css";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function AboutPage() {
  //TODO: only when connected to backend
  const [sections, setSections] = useState([]);

  // show "back to top" after scrolling a bit
  const [showToTop, setShowToTop] = useState(false);
  
  useEffect(() => {
    // getAboutSections().then(setSections);
    // For now, just set empty array since getAboutSections is not defined
    setSections([]);

    // Scroll to top functionality
    const onScroll = () => setShowToTop(window.scrollY > 200);
    onScroll(); // initialize on first render
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // content of each section of the about page here:
  // Intro Section

  const user = useAuthStore((state) => state.user);

  const hero = {
    eyebrow: "Our Story",
    title: "Developing Future Wizards On and Off the Pitch",
    subtitle:
      "Wizards Football Academy was founded with a passion for developing young talent and shaping the next generation of football wizards. We believe in building character, discipline, and sportsmanship alongside technical skills.",
    cardLabels: ["Ages 8-18", "Multi-Location Training"],
    cardText:
      "Professional coaching across Beirut, Jounieh, and Tripoli with tailored programs for every skill level.",
    buttonCard: "View Wizards Programs",
    buttonLink: "/academy",
  };
  // About Our Story Section
  const story = [
    "Founded by former professional players and certified coaches, Wizards Football Academy emerged from a vision to create a comprehensive football development platform for youth in Lebanon. We recognized the need for professional training infrastructure that focuses on both athletic excellence and personal growth.",
    "What started as a small training group has grown into a premier football academy with multiple locations, serving hundreds of young athletes across different age groups and skill levels.",
    "Today, we're proud to be shaping the future of Lebanese football through our structured academy programs, specialized clinics, and competitive tournaments that challenge and inspire our players.",
  ];
  // Wizards Core Programs Section where we highlight the main programs types offered by the academy
  // Three pathways for every young wizard's journey
  const programs = [
    {
      icon: "⚽",
      title: "Academy Training",
      text: "Year-round comprehensive football development with professional coaching, technical training, and tactical education for serious players.",
      meta: ["Ages 8-18", "All Locations"],
    },
    {
      icon: "🎯",
      title: "Skills Clinic",
      text: "Specialized intensive training focusing on specific skills: shooting, dribbling, goalkeeping, and positional play.",
      meta: ["Seasonal", "Beirut & Jounieh"],
    },
    {
      icon: "🏆",
      title: "Tournaments",
      text: "Competitive matches and tournaments that provide real-game experience and foster team spirit and sportsmanship.",
      meta: ["Monthly Events", "All Locations"],
    },
  ];
  // Training Locations Section
  const locations = [
    { city: "Beirut", facility: "📍City Sports Complex" },
    { city: "Jounieh", facility: "📍Coastal Football Center" },
    { city: "Tripoli", facility: "📍North Lebanon Sports Ground" },
  ];

  // Mission and Vision Section
  const missionVision = {
    mission: {
      icon: "🎯",
      title: "Our Mission",
      text: "To develop skilled football players with strong character, providing professional coaching and competitive opportunities that foster growth both on and off the pitch.",
    },
    vision: {
      icon: "👁️",
      title: "Our Vision",
      text: "To become Lebanon's leading football academy, recognized for producing technically excellent players with outstanding sportsmanship and team spirit.",
    },
  };

  // Why Choose Us Section
  const whyChooseUs = [
    {
      icon: "🤝",
      title: "Expert Coaches",
      text: "Our training is led by certified coaches and former professional players who focus on both technical and tactical development.",
    },
    {
      icon: "📍",
      title: "Strategic Training Locations",
      text: "With professional facilities in Beirut, Jounieh, and Tripoli, we provide safe, accessible, and high-quality environments for player development.",
    },
    {
      icon: "❯❯❯❯",
      title: "Structured Player Development",
      text: "A clear, progressive pathway for every age and ability level — from fundamentals to elite competitive performance.",
    },
    {
      icon: "🏆",
      title: "Competitive Exposure",
      text: "Regular matches, tournaments, and talent evaluations give our players real game experience and opportunities for advancement.",
    },
  ];

  // Stats Section about Wizards players, coaches, locations, tournaments won.
  const stats = [
    { number: "300+", label: "Active Players" },
    { number: "15", label: "Certified Coaches" },
    { number: "3", label: "Locations" },
    { number: "25+", label: "Tournaments Won" },
  ];

  //  Call to Action Section where we invite users to join the academy and contact
  const cta = {
    title: "Ready to Join Wizards Football Academy?",
    text: "Start your wizard journey with professional coaching at one of our three locations. Enroll and Contact us to unlock your full potential on the pitch!",
  };

  // layout structure of the about page
  return (
    <div className="about-page">
      <div className="app-root">
        {" "}
        {/* Wrapper div for the entire page*/}
        <Navbar /> {/* Navigation bar at the top of the About page*/}
        {/* Hero section at the top of the About page
         Hero section container*/}
        <section className="about-hero">
          {/* Overlay for visual effect */}
          <div className="about-hero__overlay"></div>
          {/* Container for centering content */}
          <div className="container">
            <div className="about-hero__inner">
              {" "}
              {/* Inner content wrapper*/}
              <div className="about-hero__content">
                {" "}
                {/* The actual Content area of the hero (intro)section*/}
                {/* The section Hero title text*/}
                <div className="about-hero__eyebrow">{hero.eyebrow}</div>
                {/*  Main title with "Wizards" highlighted*/}
                <h1 className="about-hero__title">
                  {" "}
                  {/*Main title with "Wizards" highlighted*/}
                  {hero.title.split("Wizards")[0]}
                  <span>Wizards</span>
                  {hero.title.split("Wizards")[1]}
                </h1>
                <p className="about-hero__subtitle">{hero.subtitle}</p>{" "}
                {/*Subtitle text of our intro About page*/}
              </div>
              {/* card section within the hero area next to the intro text
                          Card highlighting key info about the academy*/}
              <div className="about-hero__card">
                {/* Labels at the top of the card about age group and multi locations*/}
                <div className="about-hero__card-label">
                  {hero.cardLabels.join(" | ")}
                </div>

                <div className="about-hero__card-title">Wizards Training</div>

                {/* Description text within the card*/}
                <div className="about-hero__card-text">{hero.cardText}</div>
                {/*} button Card linking to full programs page*/}
                <Link to={hero.buttonLink} className="btn btn--ghost">
                  {hero.buttonCard}
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Story Section 

         Story section container where we tell the academy's Journey*/}
        <section className="section--story story-section-left">
          <div className="container">
            {" "}
            {/* Centered container for content */}
            <div className="story-content">
              {" "}
              {/* Actual content area */}
              <h2 className="story-content__title">Our Football Journey</h2>
              {/*Text area where we map through the story paragraphs*/}
              <div className="story-content__text">
                {story.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Featured Programs Section */}
        {/*Wizards Core Programs Section where we highlight the main programs types offered by the academy
         Three pathways for every young wizard's journey*/}
        <section className="section--programs">
          <div className="container">
            <div className="section-header">
              <div className="section-header__eyebrow">Our Offerings</div>
              <h2 className="section-header__title">Wizards Core Programs</h2>
              <p className="section-header__subtitle">
                Three pathways for every young wizard's journey
                <br />
                Comprehensive training for all ages and skill levels.
              </p>
            </div>
            <div className="programs-grid">
              {" "}
              {/*show the three main program types and their details*/}
              {programs.map((p, idx) => (
                <div key={idx} className="program-card">
                  <div className="program-card__icon">{p.icon}</div>
                  <h3 className="program-card__title">{p.title}</h3>
                  <p className="program-card__text">{p.text}</p>
                  <div className="program-card__meta">{p.meta.join(" | ")}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Mission & Vision */}
        {/* Mission and Vision Section*/}
        <section className="section--mission-vision">
          <div className="container">
            <div className="mv-grid">
              {/* Mission card*/}
              <div className="mv-card mv-card--mission">
                <div className="mv-card__icon">
                  {missionVision.mission.icon}
                </div>
                <h3 className="mv-card__title">
                  {missionVision.mission.title}
                </h3>
                <p className="mv-card__text">{missionVision.mission.text}</p>
              </div>
              {/*Vision card*/}
              <div className="mv-card mv-card--vision">
                <div className="mv-card__icon">{missionVision.vision.icon}</div>
                <h3 className="mv-card__title">{missionVision.vision.title}</h3>
                <p className="mv-card__text">{missionVision.vision.text}</p>
              </div>
            </div>
          </div>
        </section>
        {/* whyChooseUs Section */}
        {/* Why Choose Us Section */}
        <section className="section--choose-us">
          <div className="container">
            <div className="section-header">
              <div className="section-header__eyebrow">Our Advantage</div>
              <h2 className="section-header__title">Why Wizards</h2>
              <p className="section-header__subtitle">
                Discover what makes Wizards Football Academy the premier choice
                for youth development
              </p>
            </div>
            <div className="choose-us-grid">
              {whyChooseUs.map((v, i) => (
                <div key={i} className="choose-us-card">
                  <div className="choose-us-card__icon">{v.icon}</div>
                  <h3 className="choose-us-card__title">{v.title}</h3>
                  <p className="choose-us-card__text">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Stats Section */}
        {/*  Grid for the statistics nbr of players ,Certified Coaches,*/}
        {/* Locations and tornaments won*/}
        <section className="section--stats">
          <div className="container">
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-item__number">{s.number}</div>
                  <div className="stat-item__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        {/*Sign up and Contact Call to Action Section*/}
        {!user &&
                <section className="section--cta">
                  <div className="container">
                    <div className="cta-card">
                      <div className="cta-card__content">
                        <h2 className="cta-card__title">{cta.title}</h2>
                        <p className="cta-card__text">{cta.text}</p>
                      </div>
                      <div className="cta-card__actions">
                        <Link to="/signup" className="btn btn--primary">
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
        </section>
        }

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

        <Footer /> {/* Footer at the bottom of the About page*/}
      </div>
    </div>
  );
}
export default AboutPage;