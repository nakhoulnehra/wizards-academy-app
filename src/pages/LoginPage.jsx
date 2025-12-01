import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call backend via authStore -> authService
    const result = await login(email, password);

    if (!result.success) {
      alert(result.error || "Login failed");
      return;
    }

    // On success, go to academies page (admin or normal user)
    navigate("/");
  };

  return (
    <div className="app-root">
      <Navbar />

      <main className="auth">
        <div className="auth__overlay" />
        <div className="container auth__inner">
          <section className="auth-card">
            <header className="auth-card__header">
              <p className="auth-card__eyebrow">Welcome back</p>
              <h1 className="auth-card__title">Log in to Wizards Academy</h1>
              <p className="auth-card__subtitle">
                Access your player profiles, program applications, and
                schedules.
              </p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit}>
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
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form__row auth-form__row--between">
                <label className="auth-form__checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="auth-form__link-button"
                  onClick={() => {
                    console.log("TODO: navigate to forgot-password");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="btn btn--primary auth-form__submit"
              >
                Log in
              </button>
            </form>

            <p className="auth-card__footer">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="auth-form__link-button"
                onClick={() => navigate("/signup")}
              >
                Create One
              </button>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
