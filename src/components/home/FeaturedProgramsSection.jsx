import React, { useEffect, useState } from "react";
import { getRecentPrograms } from "../../services/programsService";
import { useNavigate } from "react-router-dom";

function FeaturedProgramsSection({ limit = 3 }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Small date formatter: "Starts Mar 15, 2026"
  const niceStart = (iso) => {
    if (!iso) return "Starts TBA";
    const d = new Date(iso);
    return `Starts ${d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  // Build the small tag line like "Academy • Beirut" (fallbacks if city missing)
  const makeTag = (p) => {
    // p.type comes as Title Case from backend (via toTitle), location is city
    const left = p.type || "Program";
    const right = p.location || p.academyName || "TBA";
    return `${left} • ${right}`;
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const data = await getRecentPrograms(limit, controller.signal);
        setPrograms(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load programs");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [limit]);

  return (
    <section className="section section--featured-programs">
      <div className="container">
        <header className="section-header">
          <p className="section-header__eyebrow">Featured programs</p>
          <h2 className="section-header__title">
            Upcoming programs you can enroll in.
          </h2>
          <p className="section-header__subtitle">
            A quick look at key academy cycles, clinics, and tournaments you
            don&apos;t want to miss.
          </p>
        </header>

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading featured programs…</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="featured-programs__grid">
            {programs.length === 0 ? (
              <p style={{ textAlign: "center", padding: "2rem" }}>
                No upcoming programs yet. Check back soon.
              </p>
            ) : (
              programs.map((program) => (
                <article 
                  key={program.id} 
                  className={`program-card program-card--${program.type?.toLowerCase() || 'academy'}`}
                >
                  <div className="program-card__image">
                    <div className="program-card__badge">Featured</div>
                  </div>

                  <div className="program-card__body">
                    <p className="program-card__tag">{makeTag(program)}</p>
                    <h3 className="program-card__title">{program.title}</h3>
                    <p className="program-card__description">
                      {program.description}
                    </p>
                    <p className="program-card__start">
                      {niceStart(program.startDate)}
                    </p>

                    <div className="program-card__actions">
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() =>
                          navigate(`/programs/${program.slug || program.id}`)
                        }
                      >
                        View details
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() =>
                          navigate(`/apply?programId=${program.id}`)
                        }
                      >
                        Apply now
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProgramsSection;
