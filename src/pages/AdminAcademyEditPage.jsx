import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getAuthHeaders } from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AdminAcademyEditPage() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
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

  // Load existing academy
  useEffect(() => {
    const fetchAcademy = async () => {
      try {
        const res = await fetch(`${API_URL}/academies/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to load academy");
          navigate("/academy");
          return;
        }

        setForm({
          name: data.name || "",
          city: data.city || "",
          countryCode: data.countryCode || "",
          addressLine1: data.addressLine1 || "",
          phone: data.phone || "",
          latitude:
            typeof data.latitude === "number" ? String(data.latitude) : "",
          longitude:
            typeof data.longitude === "number" ? String(data.longitude) : "",
          isActive: !!data.isActive,
        });
      } catch (err) {
        console.error("Failed to load academy:", err);
        alert("Failed to load academy");
        navigate("/academy");
      } finally {
        setLoading(false);
      }
    };

    fetchAcademy();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const res = await fetch(`${API_URL}/academies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          alert(`Validation error:\n- ${data.errors.join("\n- ")}`);
        } else {
          alert(data.message || "Failed to update academy");
        }
        return;
      }

      navigate("/academy");
    } catch (err) {
      console.error("Update academy error:", err);
      alert("Failed to update academy");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-root">
        <Navbar />
        <main className="home">
          <section className="section section--programs">
            <div className="container">
              <p>Loading academy...</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-root">
      <Navbar />
      <main className="home">
        <section className="section section--programs">
          <div className="container">
            <header className="section-header">
              <p className="section-header__eyebrow">Admin</p>
              <h2 className="section-header__title">Edit academy</h2>
              <p className="section-header__subtitle">
                Update the academy details. Required fields must be completed
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
                {submitting ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminAcademyEditPage;
