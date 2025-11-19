import React from "react";
import { useNavigate } from "react-router-dom";

function ServicesSection({ services = [] }) {
  const navigate = useNavigate();

  const handleLearnMore = (service) => {
    if (service.key === "academy") {
      navigate("/programs?type=Academy");
    } else {
      // TODO: Handle other service types when their pages are created
      console.log("Navigate to:", service.slug);
    }
  };

  return (
    <section id="services" className="section section--services">
      <div className="container">
        <header className="section-header">
          <p className="section-header__eyebrow">Our services</p>
          <h2 className="section-header__title">
            Everything your young wizard needs to grow.
          </h2>
          <p className="section-header__subtitle">
            From season-long academy programs to intensive clinics and
            tournaments, Wizards FA covers every step of the journey.
          </p>
        </header>

        <div className="services__grid">
          {services.map((service) => (
            <article key={service.key} className="services-card">
              <div className="services-card__glow" />

              <div className="services-card__header">
                <div className="services-card__icon">
                  {/* Placeholder icon – you can replace with an actual image or SVG */}
                  <span>⚡</span>
                </div>
                <h3 className="services-card__title">{service.name}</h3>
              </div>

              <p className="services-card__text">{service.shortDescription}</p>

              <button
                className="services-card__cta"
                onClick={() => handleLearnMore(service)}
              >
                Learn more <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
