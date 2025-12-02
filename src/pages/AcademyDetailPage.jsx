import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAcademyById } from "../services/academiesService";
import {
  getProgramsByAcademy,
  deleteProgram,
} from "../services/programsService";
import useAuthStore from "../store/authStore";

function AcademyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [academy, setAcademy] = useState(null);
  const [academyPrograms, setAcademyPrograms] = useState([]);
  const [clinicPrograms, setClinicPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Admin check
  const isAdmin = useAuthStore((state) => state.isAdmin());

  // ✨ state for pretty delete confirmation
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    programId: null,
    title: "",
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const academyData = await getAcademyById(id);
        setAcademy(academyData);

        const [academyDataPrograms, clinicDataPrograms] = await Promise.all([
          getProgramsByAcademy(id, "ACADEMY"),
          getProgramsByAcademy(id, "CLINIC"),
        ]);

        setAcademyPrograms(academyDataPrograms);
        setClinicPrograms(clinicDataPrograms);
      } catch (err) {
        console.error(err);
        setError("Failed to load academy details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Open the nice confirm dialog
  const askDeleteProgram = (program) => {
    setConfirmDelete({
      open: true,
      programId: program.id,
      title: program.title,
    });
  };

  // Cancel dialog
  const cancelDeleteProgram = () => {
    if (deleting) return;
    setConfirmDelete({ open: false, programId: null, title: "" });
  };

  // Actually delete
  const confirmDeleteProgram = async () => {
    if (!confirmDelete.programId) return;
    try {
      setDeleting(true);
      await deleteProgram(confirmDelete.programId);

      // Remove from both lists
      setAcademyPrograms((prev) =>
        prev.filter((p) => p.id !== confirmDelete.programId)
      );
      setClinicPrograms((prev) =>
        prev.filter((p) => p.id !== confirmDelete.programId)
      );
    } catch (err) {
      console.error("Delete program error:", err);
      alert(err.message || "Failed to delete program");
    } finally {
      setDeleting(false);
      setConfirmDelete({ open: false, programId: null, title: "" });
    }
  };

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
                {/* Academy Card */}
                <article
                  className="program-card program-card--academy-entity"
                  style={{ marginBottom: "3rem" }}
                >
                  <div className="program-card__image">
                    <div
                      className={`program-card__badge ${
                        academy.isActive ? "badge--active" : "badge--inactive"
                      }`}
                    >
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

                    {isAdmin && (
                      <div
                        className="program-card__actions"
                        style={{ marginTop: "1rem" }}
                      >
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={() =>
                            navigate(
                              `/admin/academies/${id}/add-program?type=ACADEMY`
                            )
                          }
                        >
                          ➕ Add Academy Program
                        </button>

                        <button
                          className="btn btn--outline btn--sm"
                          style={{ marginLeft: "1rem" }}
                          onClick={() =>
                            navigate(
                              `/admin/academies/${id}/add-program?type=CLINIC`
                            )
                          }
                        >
                          ➕ Add Clinic Program
                        </button>
                      </div>
                    )}

                    <button
                      className="btn btn--ghost btn--sm"
                      style={{ marginTop: "1rem" }}
                      onClick={() => navigate("/academy")}
                    >
                      ← Back to all academies
                    </button>
                  </div>
                </article>

                {/* Academy Programs */}
                <header
                  className="section-header"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <p className="section-header__eyebrow">Programs</p>
                  <h2 className="section-header__title">Academy Programs</h2>
                </header>

                <div className="featured-programs__grid">
                  {academyPrograms.map((program) => (
                    <article
                      key={program.id}
                      className={`program-card program-card--${
                        program.type?.toLowerCase() || "academy"
                      }`}
                    >
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
                        <h3 className="program-card__title">{program.title}</h3>
                        <p className="program-card__description">
                          {program.description}
                        </p>

                        {/* SINGLE ACTION ROW */}
                        <div className="program-card__actions">
                          {/* ALWAYS VISIBLE */}
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => navigate(`/programs/${program.id}`)}
                          >
                            View details
                          </button>

                          {/* ADMIN BUTTONS */}
                          {isAdmin && (
                            <>
                              <button
                                className="btn btn--outline btn--sm"
                                style={{ marginLeft: "0.5rem" }}
                                onClick={() =>
                                  navigate(`/admin/programs/${program.id}/edit`)
                                }
                              >
                                Update
                              </button>

                              <button
                                className="btn btn--outline btn--sm"
                                style={{
                                  marginLeft: "0.5rem",
                                  borderColor: "#ff7b7b",
                                  color: "#ff7b7b",
                                }}
                                onClick={() => askDeleteProgram(program)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Clinic Programs */}
                <header
                  className="section-header"
                  style={{ margin: "3rem 0 1.5rem" }}
                >
                  <h2 className="section-header__title">Clinic Programs</h2>
                </header>

                <div className="featured-programs__grid">
                  {clinicPrograms.map((program) => (
                    <article
                      key={program.id}
                      className={`program-card program-card--${
                        program.type?.toLowerCase() || "clinic"
                      }`}
                    >
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
                        <h3 className="program-card__title">{program.title}</h3>
                        <p className="program-card__description">
                          {program.description}
                        </p>

                        {/* SINGLE ACTION ROW */}
                        <div className="program-card__actions">
                          {/* ALWAYS VISIBLE */}
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => navigate(`/programs/${program.id}`)}
                          >
                            View details
                          </button>

                          {/* ADMIN BUTTONS */}
                          {isAdmin && (
                            <>
                              <button
                                className="btn btn--outline btn--sm"
                                style={{ marginLeft: "0.5rem" }}
                                onClick={() =>
                                  navigate(`/admin/programs/${program.id}/edit`)
                                }
                              >
                                Update
                              </button>

                              <button
                                className="btn btn--outline btn--sm"
                                style={{
                                  marginLeft: "0.5rem",
                                  borderColor: "#ff7b7b",
                                  color: "#ff7b7b",
                                }}
                                onClick={() => askDeleteProgram(program)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* ✨ PRETTY DELETE CONFIRM MODAL */}
      {confirmDelete.open && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            className="auth-form"
            style={{
              maxWidth: "480px",
              width: "100%",
              padding: "1.75rem 2rem",
              borderRadius: "24px",
              background:
                "radial-gradient(circle at top left, rgba(164,120,255,0.25), transparent 55%), rgba(6,10,33,0.95)",
              boxShadow: "0 18px 60px rgba(0, 0, 0, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <h3
              className="section-header__title"
              style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
            >
              Delete program?
            </h3>
            <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
              You&apos;re about to delete:
              <br />
              <strong>{confirmDelete.title}</strong>
            </p>
            <p style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              This action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={cancelDeleteProgram}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                style={{
                  borderColor: "#ff7b7b",
                  color: "#ff7b7b",
                }}
                onClick={confirmDeleteProgram}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AcademyDetailPage;
