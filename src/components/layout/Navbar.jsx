import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/wfa-logo.png";
import useAuthStore from "../../store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout(); // clear token + user
    navigate("/"); // go to home page
  };

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        {/* LEFT SIDE - BRAND */}
        <div className="navbar__brand">
          <Link to="/">
            <img
              src={logo}
              alt="Wizards Football Academy logo"
              className="navbar__logo"
            />
          </Link>
          <div className="navbar__brand-text">
            <span className="navbar__brand-title">Wizards</span>
            <span className="navbar__brand-subtitle">Football Academy</span>
          </div>
        </div>

        {/* CENTER NAV LINKS */}
        <nav className="navbar__nav">
          <a href="#programs">Programs</a>
          <Link to="/academy">Academies</Link>
          <a href="#tournaments">Tournaments</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* RIGHT SIDE AUTH BUTTONS */}
        <div className="navbar__auth">
          {!user ? (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">
                Log in
              </Link>
              <Link to="/signup" className="btn btn--primary btn--sm">
                Create account
              </Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: "1rem" }}>
                Hello, {user.firstName || "User"}
              </span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;