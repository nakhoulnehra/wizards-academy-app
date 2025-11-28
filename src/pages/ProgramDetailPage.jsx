// src/pages/ProgramDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getPublicProgramById } from "../services/programsService";

function ProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getPublicProgramById(programId);
        setProgram(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load program");
      } finally {
        setLoading(false);
      }
    }

    if (programId) {
      load();
    }
  }, [programId]);

  return (
    <div className="app-root">
      <Navbar />

      <main className="home">
        <section className="section section--programs">
          <div className="container">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => navigate("/programs")}
              style={{ marginBottom: "1.5rem" }}
            >
              ← Back to all programs
            </button>

            <header className="section-header">
              <p className="section-header__eyebrow">Program details</p>
              <h1 className="section-header__title">
                {program ? program.title : "Loading program..."}
              </h1>
              {program && (
                <p className="section-header__subtitle">
                  {program.location && <span>{program.location}</span>}
                  {program.ageGroup && (
                    <span>
                      {" "}
                      • Age group: <strong>{program.ageGroup}</strong>
                    </span>
                  )}
                  {program.type && (
                    <span>
                      {" "}
                      • Type: <strong>{program.type}</strong>
                    </span>
                  )}
                </p>
              )}
            </header>

            {loading && <p>Loading program…</p>}
            {error && !loading && (
              <p style={{ color: "#f87171", marginTop: "1rem" }}>{error}</p>
            )}

            {!loading && !error && program && (
              <article className="program-card" style={{ marginTop: "1.5rem" }}>
                <div className="program-card__image">
                  <div className="program-card__badge">{program.type}</div>
                </div>

                <div className="program-card__body">
                  <p className="program-card__tag">
                    {program.location || "Location TBA"}
                    {program.ageGroup
                      ? ` • ${program.ageGroup}`
                      : " • All ages"}
                  </p>

                  {program.startDate && (
                    <p className="program-card__start">
                      Starts on {program.startDate}
                    </p>
                  )}
                  {program.endDate && (
                    <p className="program-card__start">
                      Ends on {program.endDate}
                    </p>
                  )}

                  <p className="program-card__description">
                    {program.description || "More information coming soon."}
                  </p>

                  <p className="program-card__description">
                    {program.price
                      ? `Price: ${program.price} ${program.currency}`
                      : "Price on request"}
                  </p>

                  {program.academyName && (
                    <p className="program-card__description">
                      Academy: <strong>{program.academyName}</strong>
                    </p>
                  )}
                </div>
              </article>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProgramDetailPage;
