import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAcademyById } from "../services/academiesService";
import { createProgram } from "../services/programsService";

const AGE_GROUP_OPTIONS = [
  { code: "U8", label: "U8 (7–8 years)" },
  { code: "U10", label: "U10 (9–10 years)" },
  { code: "U12", label: "U12 (11–12 years)" },
  { code: "U14", label: "U14 (13–14 years)" },
  { code: "U16", label: "U16 (15–16 years)" },
  { code: "U18", label: "U18 (17–18 years)" },
];

function AdminProgramCreatePage() {
  const { academyId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const type = params.get("type") || "ACADEMY";
  const prettyType = type === "CLINIC" ? "Clinic" : "Academy";

  const [academy, setAcademy] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    ageGroupCode: "",
    price: "",
    currency: "EUR",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const a = await getAcademyById(academyId);
        setAcademy(a);
      } catch (err) {
        console.error(err);
        setError("Failed to load academy details.");
      }
    };
    load();
  }, [academyId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await createProgram(academyId, type, form);
      navigate(`/academy/${academyId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating program");
      setSubmitting(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar />
      <main className="home">
        <section className="section section--programs">
          <div className="container">
            {/* Back button */}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => navigate(-1)}
              style={{ marginBottom: "1.5rem" }}
            >
              ← Back
            </button>

            {/* Header – matches AdminAcademyCreatePage */}
            <header className="section-header">
              <p className="section-header__eyebrow">Admin · Programs</p>
              <h2 className="section-header__title">
                Create {prettyType} Program
              </h2>
              <p className="section-header__subtitle">
                For academy:{" "}
                <strong>{academy?.name || "Loading academy..."}</strong>
              </p>
            </header>

            {/* Form – same structure & classes as Add new academy */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <p style={{ color: "#ff7b7b", marginBottom: "1rem" }}>
                  {error}
                </p>
              )}

              {/* Program title */}
              <div className="auth-form__field">
                <label htmlFor="program-title">Program title *</label>
                <input
                  id="program-title"
                  type="text"
                  placeholder="e.g. U12 Spring Academy"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="auth-form__field">
                <label htmlFor="program-description">Description *</label>
                <textarea
                  id="program-description"
                  placeholder="Short description of the program..."
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>

              {/* Dates row */}
              <div className="auth-form__row">
                <div className="auth-form__field">
                  <label htmlFor="program-start">Start date *</label>
                  <input
                    id="program-start"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form__field">
                  <label htmlFor="program-end">End date *</label>
                  <input
                    id="program-end"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Age group */}
              <div className="auth-form__field">
                <label htmlFor="program-age-group">Age group *</label>
                <select
                  id="program-age-group"
                  value={form.ageGroupCode}
                  onChange={(e) => handleChange("ageGroupCode", e.target.value)}
                  required
                >
                  <option value="">Select age group…</option>
                  {AGE_GROUP_OPTIONS.map((ag) => (
                    <option key={ag.code} value={ag.code}>
                      {ag.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price + currency */}
              <div className="auth-form__row">
                <div className="auth-form__field">
                  <label htmlFor="program-price">Price *</label>
                  <input
                    id="program-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 249.00"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form__field">
                  <label htmlFor="program-currency">Currency *</label>
                  <input
                    id="program-currency"
                    type="text"
                    value={form.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className="btn btn--primary auth-form__submit"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? `Creating ${prettyType} Program…`
                  : `Create ${prettyType} Program`}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminProgramCreatePage;
