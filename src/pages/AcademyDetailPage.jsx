import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAcademyById } from "../services/academiesService";
import { getProgramsByAcademy } from "../services/programsService";

function AcademyDetailPage() {
  const { id } = useParams(); // /academy/:id
  const navigate = useNavigate();

  const [academy, setAcademy] = useState(null);
  const [academyPrograms, setAcademyPrograms] = useState([]);
  const [clinicPrograms, setClinicPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        // 1) Academy info
        const academyData = await getAcademyById(id);
        setAcademy(academyData);

        // 2) Programs by type
        const [academyDataPrograms, clinicDataPrograms] = await Promise.all([
          getProgramsByAcademy(id, { type: "Academy" }),
          getProgramsByAcademy(id, { type: "Clinic" }),
        ]);

        setAcademyPrograms(academyDataPrograms || []);
        setClinicPrograms(clinicDataPrograms || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load academy details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <div className="app-root">
      <Navbar />

      <main className="home">
        <section className="section section--programs">
          <div className="container">
            {loading && <p>Loading...</p>}
            {error && !loading && <p>{error}</p>}

            {!loading && !error && academy && (
              <>
                {/* Top academy card – same style as AcademyPage */}
                <article
                  className="program-card"
                  style={{ marginBottom: "3rem" }}
                >
                  <div className="program-card__image">
                    <div className="program-card__badge">
                      {academy.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <div className="program-card__body">
                    <p className="program-card__tag">
                      {academy.city}, {academy.countryCode}
                    </p>
                    <h1 className="program-card__title">{academy.name}</h1>
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

                    <div className="program-card__actions">
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => navigate("/academy")}
                      >
                        Back to all academies
                      </button>
                    </div>
                  </div>
                </article>

                {/* ---------------- Academy Programs ---------------- */}
                <header
                  className="section-header"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <p className="section-header__eyebrow">Programs</p>
                  <h2 className="section-header__title">
                    Academy programs at this academy
                  </h2>
                  <p className="section-header__subtitle">
                    All academy-type programs offered at this location.
                  </p>
                </header>

                {academyPrograms.length === 0 ? (
                  <p>No academy programs found for this academy.</p>
                ) : (
                  <div
                    className="featured-programs__grid"
                    style={{ marginBottom: "3rem" }}
                  >
                    {academyPrograms.map((program) => (
                      <article key={program.id} className="program-card">
                        <div className="program-card__image">
                          <div className="program-card__badge">
                            {program.type}
                          </div>
                        </div>

                        <div className="program-card__body">
                          <p className="program-card__tag">
                            {program.startDate
                              ? new Date(program.startDate).toLocaleDateString()
                              : "Start date TBA"}
                          </p>
                          <h3 className="program-card__title">
                            {program.title}
                          </h3>
                          <p className="program-card__description">
                            {program.description}
                          </p>
                          {program.price && (
                            <p className="program-card__start">
                              💰 {program.price} {program.currency || ""}
                            </p>
                          )}
                          {program.ageGroup && (
                            <p className="program-card__start">
                              🧒 Age group: {program.ageGroup}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* ---------------- Clinic Programs ---------------- */}
                <header
                  className="section-header"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <p className="section-header__eyebrow">Clinics</p>
                  <h2 className="section-header__title">
                    Clinic programs at this academy
                  </h2>
                  <p className="section-header__subtitle">
                    All clinic-type programs offered at this location.
                  </p>
                </header>

                {clinicPrograms.length === 0 ? (
                  <p>No clinic programs found for this academy.</p>
                ) : (
                  <div className="featured-programs__grid">
                    {clinicPrograms.map((program) => (
                      <article key={program.id} className="program-card">
                        <div className="program-card__image">
                          <div className="program-card__badge">
                            {program.type}
                          </div>
                        </div>

                        <div className="program-card__body">
                          <p className="program-card__tag">
                            {program.startDate
                              ? new Date(program.startDate).toLocaleDateString()
                              : "Start date TBA"}
                          </p>
                          <h3 className="program-card__title">
                            {program.title}
                          </h3>
                          <p className="program-card__description">
                            {program.description}
                          </p>
                          {program.price && (
                            <p className="program-card__start">
                              💰 {program.price} {program.currency || ""}
                            </p>
                          )}
                          {program.ageGroup && (
                            <p className="program-card__start">
                              🧒 Age group: {program.ageGroup}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AcademyDetailPage;
