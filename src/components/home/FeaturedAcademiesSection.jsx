import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedAcademies } from "../../services/academiesService";

function FeaturedAcademiesSection() {
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ THIS WAS MISSING

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getFeaturedAcademies(); // array from backend
        setAcademies(list);
      } catch (err) {
        console.error(err);
        setError("Could not load academies.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <section className="section section--programs">
        <div className="container">
          <p>Loading academies…</p>
        </div>
      </section>
    );
  }

  if (error || academies.length === 0) {
    return null;
  }

  return (
    <section className="section section--programs">
      <div className="container">
        <header className="section-header">
          <p className="section-header__eyebrow">Featured academies</p>
          <h2 className="section-header__title">
            Academies with upcoming programs.
          </h2>
          <p className="section-header__subtitle">
            A quick look at a few Wizards locations that have academy programs
            starting soon.
          </p>
        </header>

        <div className="featured-programs__grid">
          {academies.map((academy) => {
            const isActive = academy.isActive !== false;

            return (
              <article 
                key={academy.id} 
                className="program-card program-card--academy-entity"
              >
                <div className="program-card__image">
                  <div className={`program-card__badge ${isActive ? 'badge--active' : 'badge--inactive'}`}>
                    {isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="program-card__body">
                  <p className="program-card__tag">
                    {academy.city}, {academy.countryCode}
                  </p>

                  <h3 className="program-card__title">{academy.name}</h3>

                  <p className="program-card__description">
                    {academy.addressLine1 || "Address not available"}
                  </p>

                  {academy.phone && (
                    <p className="program-card__start">📞 {academy.phone}</p>
                  )}

                  {academy.programCount > 0 && (
                    <p className="program-card__start">
                      ⚽ {academy.programCount} program
                      {academy.programCount !== 1 ? "s" : ""} available
                    </p>
                  )}

                  {academy.nextProgram && academy.nextProgram.startDate && (
                    <p className="program-card__start">
                      📅 Next program starts{" "}
                      {new Date(
                        academy.nextProgram.startDate
                      ).toLocaleDateString()}
                    </p>
                  )}

                  <div className="program-card__actions">
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => navigate(`/academy/${academy.id}`)} // ✅ FIXED
                    >
                      View details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* VIEW MORE BUTTON */}
        <div
          className="section-footer"
          style={{ marginTop: "2rem", textAlign: "center" }}
        >
          <a href="/academy" className="btn btn--outline">
            View more →
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturedAcademiesSection;
