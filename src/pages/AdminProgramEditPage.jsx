import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import useAuthStore from "../store/authStore";
import { getProgramById, updateProgram } from "../services/programsService";

const AGE_GROUP_OPTIONS = [
  { code: "U8", label: "U8 (7–8 years)" },
  { code: "U10", label: "U10 (9–10 years)" },
  { code: "U12", label: "U12 (11–12 years)" },
  { code: "U14", label: "U14 (13–14 years)" },
  { code: "U16", label: "U16 (15–16 years)" },
  { code: "U18", label: "U18 (17–18 years)" },
];

function AdminProgramEditPage() {
  const { programId } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin());

  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
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

  // 🔒 Protect page
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const p = await getProgramById(programId);
        setProgram(p);
        setForm({
          title: p.title || "",
          description: p.description || "",
          startDate: p.startDate || "",
          endDate: p.endDate || "",
          ageGroupCode: p.ageGroupCode || "",
          price: p.price || "",
          currency: p.currency || "EUR",
        });
      } catch (err) {
        console.error(err);
        alert(err.message || "Failed to load program");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [programId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "currency"
          ? value.toUpperCase().slice(0, 3)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!program) return;

    setSubmitting(true);

    try {
      await updateProgram(programId, {
        ...form,
        type: program.type, // keep existing type (ACADEMY / CLINIC)
      });

      // Go back to academy detail page
      navigate(`/academy/${program.academyId}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update program");
    } finally {
      setSubmitting(false);
    }
  };

  const prettyType =
    program && program.type === "CLINIC" ? "Clinic" : "Academy";

  return (
    <div className="app-root">
      <Navbar />
      <main className="home">
        <section className="section section--programs">
          <div className="container">
            <header className="section-header">
              <p className="section-header__eyebrow">Admin</p>
              <h2 className="section-header__title">Edit program</h2>
              <p className="section-header__subtitle">
                Update the program details. Required fields must be completed
                before saving.
              </p>
            </header>

            {program && (
              <form className="auth-form" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="auth-form__field">
                  <label htmlFor="program-title">Program title *</label>
                  <input
                    id="program-title"
                    type="text"
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
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Dates */}
                <div className="auth-form__row auth-form__row--two">
                  <div className="auth-form__field">
                    <label htmlFor="program-start">Start date (optional)</label>
                    <input
                      id="program-start"
                      type="date"
                      value={form.startDate}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="auth-form__field">
                    <label htmlFor="program-end">End date (optional)</label>
                    <input
                      id="program-end"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Age group */}
                <div className="auth-form__field">
                  <label htmlFor="program-age">Age group *</label>
                  <select
                    id="program-age"
                    value={form.ageGroupCode}
                    onChange={(e) =>
                      handleChange("ageGroupCode", e.target.value)
                    }
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
                <div className="auth-form__row auth-form__row--two">
                  <div className="auth-form__field">
                    <label htmlFor="program-price">Price *</label>
                    <input
                      id="program-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                    />
                  </div>
                  <div className="auth-form__field">
                    <label htmlFor="program-currency">
                      Currency (3 letters) *
                    </label>
                    <input
                      id="program-currency"
                      type="text"
                      maxLength={3}
                      value={form.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn--primary auth-form__submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save changes"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminProgramEditPage;
