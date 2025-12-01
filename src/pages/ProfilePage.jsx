// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import useAuthStore from "../store/authStore";
import { getMyEnrolledPrograms } from "../services/programsService";
import { getMyProfile, updateMyProfile } from "../services/meService";

function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUserInStore =
    useAuthStore((state) => state.setUser) || null; // optional if exposed

  // Local "me" so UI updates instantly after saving
  const [me, setMe] = useState(user || null);

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programsError, setProgramsError] = useState("");

  const isClient = (me || user)?.role === "CLIENT";
  const isAdmin = (me || user)?.role === "ADMIN";

  // initials for avatar
  const base = me || user;
  const initials = base
    ? (
        ((base.firstName || "").charAt(0) + (base.lastName || "").charAt(0)) ||
        (base.email || "").charAt(0)
      ).toUpperCase()
    : "";

  // Helpers for enrolled programs cards
  const niceStart = (iso) => {
    if (!iso) return "Starts TBA";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const makeTag = (p) => {
    const left = p.type || "Program";
    const right = p.location || p.academyName || "TBA";
    return `${left} • ${right}`;
  };

  // Redirect if not logged in + keep local me in sync
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    setMe(user || null);
  }, [user, navigate]);

  // Load enrolled programs (CLIENT only)
  useEffect(() => {
    if (!user || user.role !== "CLIENT") {
      setPrograms([]);
      setLoadingPrograms(false);
      setProgramsError("");
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoadingPrograms(true);
        const data = await getMyEnrolledPrograms(controller.signal);
        setPrograms(data);
        setProgramsError("");
      } catch (err) {
        console.error("load enrolled programs error:", err);
        setProgramsError(err.message || "Failed to load enrolled programs");
      } finally {
        setLoadingPrograms(false);
      }
    })();

    return () => controller.abort();
  }, [user]);

  // ── Edit Profile modal state ─────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // polished modal styles
  const modalUI = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(5,8,15,0.6)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
    },
    panel: {
      width: "100%",
      maxWidth: 560,
      borderRadius: 20,
      padding: "1.25rem 1.25rem 1rem",
      background:
        "linear-gradient(180deg, rgba(22,22,27,0.98) 0%, rgba(15,15,20,0.98) 100%)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow:
        "0 20px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
      position: "relative",
    },
    title: { margin: 0, fontSize: "1.25rem", fontWeight: 700 },
    subtitle: {
      margin: "0.35rem 0 1rem",
      opacity: 0.65,
      fontSize: "0.9rem",
    },
    close: {
      position: "absolute",
      top: 10,
      right: 12,
      width: 36,
      height: 36,
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.04)",
      color: "#cbd5e1",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
    },
    grid: { display: "grid", gap: "0.9rem" },
    row2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.9rem",
    },
    label: { display: "grid", gap: 6 },
    input: {
      height: 42,
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.05)",
      color: "white",
      padding: "0 12px",
      outline: "none",
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.6rem",
      marginTop: "1rem",
    },
  };

  const openEdit = async () => {
    setEditError("");
    setEditOpen(true);
    try {
      const controller = new AbortController();
      const profile = await getMyProfile(controller.signal);
      setForm({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
      });
      setMe((prev) => ({ ...(prev || {}), ...profile }));
    } catch (e) {
      setEditError(e.message || "Failed to load your profile");
    }
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError("");
    try {
      const updated = await updateMyProfile(form);
      setMe((prev) => ({ ...(prev || {}), ...updated }));
      if (typeof setUserInStore === "function") {
        setUserInStore(updated);
      }
      setEditOpen(false);
    } catch (err) {
      setEditError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    // brief guard; redirect effect will run
    return null;
  }

  return (
    <div className="app-root">
      <Navbar />

      <main className="home">
        {/* TOP: USER INFO */}
        <section className="section">
          <div className="container">
            {/* MODERN PROFILE CARD */}
            <div
              className="auth-form"
              style={{
                maxWidth: "1000px",
                width: "100%",
                marginTop: "2rem",
                marginLeft: 0,
                marginRight: "auto",
                padding: "2.5rem",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "300px",
                  height: "300px",
                  background:
                    "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)",
                  pointerEvents: "none",
                  borderRadius: "50%",
                  transform: "translate(40%, -40%)",
                }}
              />

              {/* Small eyebrow text */}
              <p
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  opacity: 0.5,
                  marginBottom: "1.5rem",
                  fontWeight: 600,
                }}
              >
                Profile
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "2rem",
                  position: "relative",
                  flexWrap: "wrap",
                }}
              >
                {/* LEFT: Avatar + Info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    flex: "1",
                    minWidth: "250px",
                  }}
                >
                  {/* Icon Badge */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(168, 85, 247, 0.1)",
                      border: "2px solid rgba(168, 85, 247, 0.3)",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "#a855f7" }}
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  {/* Name, Email, Role stacked */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {(me || user)?.firstName} {(me || user)?.lastName}
                    </h1>

                    <p
                      style={{
                        fontSize: "0.95rem",
                        opacity: 0.7,
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>✉</span>
                      {(me || user)?.email}
                    </p>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "12px",
                        background: "rgba(168, 85, 247, 0.15)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        width: "fit-content",
                        color: "#c4b5fd",
                      }}
                    >
                      {(me || user)?.role}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Edit button */}
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={openEdit}
                  style={{
                    alignSelf: "center",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Edit profile
                </button>
              </div>

              {/* Subtitle below */}
              <p
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.6,
                  marginTop: "1.5rem",
                  marginBottom: 0,
                  lineHeight: 1.6,
                }}
              >
                Manage your personal information
                {isClient && " and see your enrolled programs and outstanding fees."}
                {isAdmin && " as an administrator of Wizards Football Academy."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 1 + 2 ONLY FOR CLIENTS */}
        {isClient && (
          <>
            {/* SECTION 1: ENROLLED PROGRAMS */}
            <section className="section section--featured-programs">
              <div className="container">
                <header className="section-header">
                  <p className="section-header__eyebrow">Your training</p>
                  <h2 className="section-header__title">Enrolled programs</h2>
                  <p className="section-header__subtitle">
                    All academy programs and clinics you are currently registered
                    in.
                  </p>
                </header>

                {loadingPrograms && (
                  <p style={{ padding: "1rem 0" }}>Loading your programs…</p>
                )}

                {programsError && !loadingPrograms && (
                  <p style={{ padding: "1rem 0", color: "#f87171" }}>
                    {programsError}
                  </p>
                )}

                {!loadingPrograms && !programsError && (
                  <>
                    {programs.length === 0 ? (
                      <p style={{ padding: "1rem 0" }}>
                        You&apos;re not enrolled in any programs yet.
                      </p>
                    ) : (
                      <div className="featured-programs__grid">
                        {programs.map((program) => (
                          <article
                            key={program.id}
                            className={`program-card program-card--${
                              program.type?.toLowerCase() || "academy"
                            }`}
                          >
                            <div className="program-card__image">
                              <span className="program-card__badge">
                                {program.type}
                              </span>
                              <span className="program-card__badge program-card__badge--registered">
                                Enrolled
                              </span>
                            </div>

                            <div className="program-card__body">
                              <p className="program-card__tag">
                                {makeTag(program)}
                              </p>
                              <h3 className="program-card__title">
                                {program.title}
                              </h3>
                              <p className="program-card__description">
                                {program.description}
                              </p>
                              <p className="program-card__start">
                                {niceStart(program.startDate)}
                              </p>

                              <div className="program-card__actions">
                                <button
                                  className="btn btn--ghost btn--sm"
                                  onClick={() =>
                                    navigate(`/programs/${program.id}`)
                                  }
                                >
                                  View details
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* SECTION 2: DUE FEES (placeholder for now) */}
            <section className="section">
              <div className="container">
                <header className="section-header">
                  <p className="section-header__eyebrow">Payments</p>
                  <h2 className="section-header__title">Due fees</h2>
                  <p className="section-header__subtitle">
                    Any outstanding payments for your active programs will appear
                    here.
                  </p>
                </header>

                <p style={{ padding: "1rem 0" }}>
                  (We&apos;ll wire this up next – currently no due fees data is
                  loaded.)
                </p>
              </div>
            </section>
          </>
        )}

        {/* For admins we simply stop after the profile card for now */}
        {isAdmin && (
          <section className="section">
            <div className="container">
              <p
                style={{
                  padding: "1rem 0",
                  opacity: 0.8,
                  fontSize: "0.9rem",
                }}
              >
                As an administrator, you don&apos;t have enrolled programs or
                personal fees. Use the navigation above to manage academies and
                programs.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Edit Profile Modal (polished) */}
      {editOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={modalUI.overlay}
          onMouseDown={closeEdit}
        >
          <div
            className="auth-form"
            style={modalUI.panel}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              style={modalUI.close}
              onClick={closeEdit}
            >
              ×
            </button>

            <h3 style={modalUI.title}>Edit profile</h3>
            <p style={modalUI.subtitle}>
              Keep your details up to date. Changes reflect instantly.
            </p>

            {editError && (
              <p style={{ color: "#f87171", marginBottom: "0.75rem" }}>
                {editError}
              </p>
            )}

            <form onSubmit={handleSave}>
              <div style={modalUI.grid}>
                <div style={modalUI.row2}>
                  <label style={modalUI.label}>
                    <span>First name</span>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="input"
                      style={modalUI.input}
                      placeholder="First name"
                      required
                    />
                  </label>
                  <label style={modalUI.label}>
                    <span>Last name</span>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="input"
                      style={modalUI.input}
                      placeholder="Last name"
                      required
                    />
                  </label>
                </div>

                <label style={modalUI.label}>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                    style={modalUI.input}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label style={modalUI.label}>
                  <span>Phone (optional)</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="input"
                    style={modalUI.input}
                    placeholder="+961 ..."
                  />
                </label>
              </div>

              <div style={modalUI.actions}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProfilePage;
