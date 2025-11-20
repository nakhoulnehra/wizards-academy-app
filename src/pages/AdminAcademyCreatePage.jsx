import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAuthHeaders } from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AdminAcademyCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    city: "",
    countryCode: "",
    addressLine1: "",
    phone: "",
    latitude: "",
    longitude: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "countryCode"
          ? value.toUpperCase()
          : field === "isActive"
          ? !!value
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Force main descriptive fields to be filled
    if (
      !form.name.trim() ||
      !form.city.trim() ||
      !form.countryCode.trim() ||
      !form.addressLine1.trim() ||
      !form.phone.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      countryCode: form.countryCode.trim(),
      addressLine1: form.addressLine1.trim(),
      phone: form.phone.trim(),
      isActive: !!form.isActive,
    };

    // Optional numeric fields
    if (form.latitude.trim()) {
      const lat = Number(form.latitude);
      if (Number.isNaN(lat)) {
        alert("Latitude must be a number");
        return;
      }
      payload.latitude = lat;
    }

    if (form.longitude.trim()) {
      const lng = Number(form.longitude);
      if (Number.isNaN(lng)) {
        alert("Longitude must be a number");
        return;
      }
      payload.longitude = lng;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/academies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Backend uses { message, errors } on validation errors
        if (data.errors && Array.isArray(data.errors)) {
          alert(`Validation error:\n- ${data.errors.join("\n- ")}`);
        } else {
          alert(data.message || "Failed to create academy");
        }
        return;
      }

      // Success – go back to academies list
      navigate("/academy");
    } catch (err) {
      console.error("Create academy error:", err);
      alert("Failed to create academy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar />
      <main className="home">
        <section className="section section--programs">
          <div className="container">
            <header className="section-header">
              <p className="section-header__eyebrow">Admin</p>
              <h2 className="section-header__title">Add a new academy</h2>
              <p className="section-header__subtitle">
                Fill in all academy details. Required fields must be completed
                before saving.
              </p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="auth-form__field">
                <label htmlFor="academy-name">Name *</label>
                <input
                  id="academy-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              {/* City */}
              <div className="auth-form__field">
                <label htmlFor="academy-city">City *</label>
                <input
                  id="academy-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
              </div>

              {/* Country code */}
              <div className="auth-form__field">
                <label htmlFor="academy-country">
                  Country code (2 letters) *
                </label>
                <input
                  id="academy-country"
                  type="text"
                  maxLength={2}
                  value={form.countryCode}
                  onChange={(e) => handleChange("countryCode", e.target.value)}
                  required
                />
              </div>

              {/* Address */}
              <div className="auth-form__field">
                <label htmlFor="academy-address">Address line 1 *</label>
                <input
                  id="academy-address"
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="auth-form__field">
                <label htmlFor="academy-phone">Phone *</label>
                <input
                  id="academy-phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>

              {/* Lat / Lng (optional) */}
              <div className="auth-form__row auth-form__row--two">
                <div className="auth-form__field">
                  <label htmlFor="academy-latitude">Latitude (optional)</label>
                  <input
                    id="academy-latitude"
                    type="text"
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    placeholder="e.g. 24.7136"
                  />
                </div>
                <div className="auth-form__field">
                  <label htmlFor="academy-longitude">
                    Longitude (optional)
                  </label>
                  <input
                    id="academy-longitude"
                    type="text"
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    placeholder="e.g. 46.6753"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <div className="auth-form__field">
                <label className="auth-form__checkbox">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                  <span>Academy is active</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn--primary auth-form__submit"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save academy"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminAcademyCreatePage;
