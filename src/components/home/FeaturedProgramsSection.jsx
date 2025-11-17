import React from "react";

function FeaturedProgramsSection() {
  // TODO: later, replace this with data from the backend
  const programs = [
    {
      id: 1,
      title: "Spring 2026 Academy Season",
      tag: "Academy • Beirut",
      description:
        "Full-season training cycle with weekly sessions, friendly matches, and progress reports for players U11–U13.",
      startDate: "Starts March 15, 2026",
    },
    {
      id: 2,
      title: "Goalkeeper Intensive Clinic",
      tag: "Clinic • All locations",
      description:
        "Short, high-intensity clinic focused on shot-stopping, positioning, and distribution for keepers U12–U16.",
      startDate: "Starts April 2, 2026",
    },
    {
      id: 3,
      title: "Summer Tournament Series",
      tag: "Tournament • Multi-city",
      description:
        "Competitive summer tournament with group stages and finals for academy and invited teams.",
      startDate: "Starts July 5, 2026",
    },
  ];

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
          {programs.map((program) => (
            <article key={program.id} className="program-card">
              <div className="program-card__image">
                <div className="program-card__badge">Featured</div>
              </div>

              <div className="program-card__body">
                <p className="program-card__tag">{program.tag}</p>
                <h3 className="program-card__title">{program.title}</h3>
                <p className="program-card__description">
                  {program.description}
                </p>
                <p className="program-card__start">{program.startDate}</p>

                <div className="program-card__actions">
                  <button className="btn btn--primary btn--sm">
                    View details
                  </button>
                  <button className="btn btn--ghost btn--sm">Apply now</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProgramsSection;
