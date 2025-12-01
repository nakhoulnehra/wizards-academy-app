// src/pages/ProgramsPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getPrograms,
  getProgramFilters,
  deleteProgram,
  registerForProgram,
} from "../services/programsService";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import useAuthStore from "../store/authStore";

function ProgramsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAdmin = useAuthStore((state) => state.isAdmin());
  const user = useAuthStore((state) => state.user);

  const [registeringProgramId, setRegisteringProgramId] = useState(null);

  const [filters, setFilters] = useState({
    locations: [],
    ageGroups: [],
    types: [],
  });

  const [selected, setSelected] = useState({
    city: searchParams.get("city") || "",
    ageGroup: searchParams.get("ageGroup") || "",
    type: searchParams.get("type") || "",
  });

  const [programs, setPrograms] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✨ NEW — delete confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    programId: null,
    title: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Load filters
  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await getProgramFilters();
        setFilters({
          locations: data.locations || [],
          ageGroups: data.ageGroups || [],
          types: data.types || [],
        });
      } catch (e) {
        console.error(e);
      }
    }
    loadFilters();
  }, []);

  // Load programs
  useEffect(() => {
    async function loadPrograms() {
      setLoading(true);
      setError("");

      try {
        const result = await getPrograms({
          city: selected.city || undefined,
          ageGroup: selected.ageGroup || undefined,
          type: selected.type || undefined,
          page,
          pageSize,
          sortBy: "startDate",
          sortDir: "asc",
        });

        setPrograms(result.data || []);
        setPage(result.page || 1);
        setTotal(result.total || 0);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load programs");
      } finally {
        setLoading(false);
      }
    }

    loadPrograms();
  }, [page, pageSize, selected]);

  const handleFilterChange = (field, value) => {
    setSelected((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleRegister = async (programId) => {
    // If not logged in, send to login first
    if (!user) {
      navigate("/login");
      return;
    }
    // Admins shouldn’t register into programs
    if (isAdmin) {
      return;
    }
    try {
      setRegisteringProgramId(programId);
      const result = await registerForProgram(programId);

      // Optimistically mark as registered so the button disappears right away
      setPrograms((prev) =>
        prev.map((p) => (p.id === programId ? { ...p, isRegistered: true } : p))
      );
      alert("Successfully registered for program")
    } catch (err) {
      console.error("Register error:", err);
      alert("Failed to register for program")
    } finally {
      setRegisteringProgramId(null);
    }
  };

  const clearFilters = () => {
    setSelected({ city: "", ageGroup: "", type: "" });
    setPage(1);
  };

  // ✨ Ask delete
  const askDeleteProgram = (program) => {
    setConfirmDelete({
      open: true,
      programId: program.id,
      title: program.title,
    });
  };

  const cancelDeleteProgram = () => {
    if (deleting) return;
    setConfirmDelete({ open: false, programId: null, title: "" });
  };

  // ✨ Confirm delete
  const confirmDeleteProgram = async () => {
    if (!confirmDelete.programId) return;

    try {
      setDeleting(true);
      await deleteProgram(confirmDelete.programId);

      // Remove from list
      setPrograms((prev) =>
        prev.filter((p) => p.id !== confirmDelete.programId)
      );
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete program");
    } finally {
      setDeleting(false);
      setConfirmDelete({ open: false, programId: null, title: "" });
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="app-root">
      <Navbar />

      <main className="home">
        {/* TOP HEADER */}
        <section className="section section--programs">
          <div className="container">
            <header className="section-header">
              <p className="section-header__eyebrow">Programs</p>
              <h1 className="section-header__title">All training programs</h1>
              <p className="section-header__subtitle">
                Browse every academy program and clinic currently offered by
                Wizards Football Academy.
              </p>
            </header>

            {/* FILTERS */}
            <div className="program-filter">
              <div className="program-filter__fields">
                {/* City */}
                <div className="field">
                  <label htmlFor="city-select">City</label>
                  <select
                    id="city-select"
                    value={selected.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                  >
                    <option value="">All locations</option>
                    {filters.locations.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age Group */}
                <div className="field">
                  <label htmlFor="age-select">Age group</label>
                  <select
                    id="age-select"
                    value={selected.ageGroup}
                    onChange={(e) =>
                      handleFilterChange("ageGroup", e.target.value)
                    }
                  >
                    <option value="">All age groups</option>
                    {filters.ageGroups.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div className="field">
                  <label htmlFor="type-select">Program type</label>
                  <select
                    id="type-select"
                    value={selected.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                  >
                    <option value="">All types</option>
                    {filters.types.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="program-filter__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setPage(1)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Apply filters"}
                </button>

                <button
                  type="button"
                  className="link-button"
                  onClick={clearFilters}
                  disabled={loading}
                >
                  Clear filters
                </button>

                <span style={{ marginLeft: "auto", fontSize: "0.85rem" }}>
                  Showing {programs.length} of {total} programs
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAM GRID */}
        <section className="section section--featured-programs">
          <div className="container">
            {error && (
              <p style={{ color: "#f87171", marginBottom: "1rem" }}>{error}</p>
            )}

            <div className="featured-programs__grid">
              {programs.map((program) => (
                <article
                  key={program.id}
                  className={`program-card program-card--${
                    program.type?.toLowerCase() || "academy"
                  }`}
                >
                  <div className="program-card__image">
                    <span className="program-card__badge">{program.type}</span>
                    {program.isRegistered && (
                      <span className="program-card__badge program-card__badge--registered">Registered</span>
                    )}
                  </div>

                  <div className="program-card__body">
                    <p className="program-card__tag">
                      {program.location || "Location TBA"} •{" "}
                      {program.ageGroup || "All ages"}
                    </p>

                    <h3 className="program-card__title">{program.title}</h3>

                    {program.startDate && (
                      <p className="program-card__start">
                        Starts on {program.startDate}
                      </p>
                    )}

                    <p className="program-card__description">
                      {program.price
                        ? `${program.price} ${program.currency}`
                        : "Price on request"}
                    </p>

                    <div className="program-card__actions">
                      {/* ALWAYS VISIBLE — WHITE BUTTON */}
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => navigate(`/programs/${program.id}`)}
                      >
                        View details
                      </button>

                      {/* CLIENT REGISTER BUTTON (non-admin, logged in, not already registered) */}
                      {user && !isAdmin && !program.isRegistered && (
                        <button
                          className="btn btn--primary btn--sm"
                          style={{ marginLeft: "0.5rem" }}
                          onClick={() => handleRegister(program.id)}
                          disabled={registeringProgramId === program.id}
                        >
                          {registeringProgramId === program.id
                            ? "Registering..."
                            : "Register"}
                        </button>
                      )}

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

            {/* PAGINATION */}
            {/* (unchanged) */}
          </div>
        </section>
      </main>

      {/* ✨ DELETE CONFIRM MODAL */}
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
              You are about to delete:
              <br />
              <strong>{confirmDelete.title}</strong>
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                className="btn btn--ghost btn--sm"
                onClick={cancelDeleteProgram}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="btn btn--outline btn--sm"
                style={{ borderColor: "#ff7b7b", color: "#ff7b7b" }}
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

export default ProgramsPage;
