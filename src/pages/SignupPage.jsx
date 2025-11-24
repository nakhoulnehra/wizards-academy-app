import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

function SignupPage() {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedParent = parentName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedParent || !trimmedEmail || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    // Split parent name into first/last for backend
    const parts = trimmedParent.split(" ").filter(Boolean);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || parts[0];

    try {
      setSubmitting(true);

      const result = await signup({
        email: trimmedEmail.toLowerCase(),
        password,
        firstName,
        lastName,
        phone: null,
      });

      alert(
        result.message || "Account created successfully. You can now log in."
      );

      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message || "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar />

      <main className="auth">
        <div className="auth__overlay" />
        <div className="container auth__inner">
          <section className="auth-card">
            <header className="auth-card__header">
              <p className="auth-card__eyebrow">Create account</p>
              <h1 className="auth-card__title">
                Join Wizards Football Academy
              </h1>
              <p className="auth-card__subtitle">
                Create a parent account to enroll players, manage applications,
                and stay updated on programs.
              </p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form__field">
                <label htmlFor="parentName">Parent / Guardian name</label>
                <input
                  id="parentName"
                  type="text"
                  placeholder="Full name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form__field">
                <label htmlFor="playerName">Player name (optional now)</label>
                <input
                  id="playerName"
                  type="text"
                  placeholder="Player's name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>

              <div className="auth-form__row auth-form__row--two">
                <div className="auth-form__field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form__field">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary auth-form__submit"
                disabled={submitting}
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="auth-card__footer">
              Already have an account?{" "}
              <button
                type="button"
                className="auth-form__link-button"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SignupPage;
