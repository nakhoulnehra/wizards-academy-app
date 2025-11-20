import React, { useEffect, useState } from "react";
import { getRecentPrograms } from "../../services/programsService";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return `Starts ${date.toLocaleDateString("en-US", options)}`;
};

function FeaturedProgramsSection() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecentPrograms(3)
      .then((data) => {
        if (data.success) {
          setPrograms(data.programs);
        } else {
          setError("Failed to load programs");
        }
      })
      .catch((err) => {
        console.error("Error fetching recent programs:", err);
        setError("Failed to load programs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="section section--featured-programs">
        <div className="container">
          <header className="section-header">
            <p className="section-header__eyebrow">Featured programs</p>
            <h2 className="section-header__title">
              Upcoming programs you can enroll in.
            </h2>
            <p className="section-header__subtitle">
              A quick look at some of the key academy cycles, clinics, and
              tournaments you don&apos;t want to miss.
            </p>
          </header>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p>Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section section--featured-programs">
        <div className="container">
          <header className="section-header">
            <p className="section-header__eyebrow">Featured programs</p>
            <h2 className="section-header__title">
              Upcoming programs you can enroll in.
            </h2>
            <p className="section-header__subtitle">
              A quick look at some of the key academy cycles, clinics, and
              tournaments you don&apos;t want to miss.
            </p>
          </header>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--featured-programs">
      <div className="container">
        <header className="section-header">
          <p className="section-header__eyebrow">Featured programs</p>
          <h2 className="section-header__title">
            Upcoming programs you can enroll in.
          </h2>
          <p className="section-header__subtitle">
            A quick look at some of the key academy cycles, clinics, and
            tournaments you don&apos;t want to miss.
          </p>
        </header>

        <div className="featured-programs__grid">
          {programs.length === 0 ? (
            <p style={{ textAlign: "center", padding: "3rem" }}>
              No programs available at the moment.
            </p>
          ) : (
            programs.map((program) => {
              const tag = `${program.type}${
                program.location ? ` • ${program.location}` : ""
              }`;
              const startDateFormatted = formatDate(program.startDate);

              return (
                <article key={program.id} className="program-card">
                  <div className="program-card__image">
                    <div className="program-card__badge">Featured</div>
                  </div>

                  <div className="program-card__body">
                    <p className="program-card__tag">{tag}</p>
                    <h3 className="program-card__title">{program.title}</h3>
                    <p className="program-card__description">
                      {program.description ||
                        "Program details available on registration."}
                    </p>
                    {startDateFormatted && (
                      <p className="program-card__start">
                        {startDateFormatted}
                      </p>
                    )}

                    <div className="program-card__actions">
                      <button className="btn btn--primary btn--sm">
                        View details
                      </button>
                      <button className="btn btn--ghost btn--sm">
                        Apply now
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProgramsSection;
