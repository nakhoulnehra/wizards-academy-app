import React from "react";
import { Link } from "react-router-dom"; // ⬅️ ADD THIS
import logo from "../../assets/images/wfa-logo.png";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        {/* LEFT SIDE - BRAND */}
        <div className="navbar__brand">
          <Link to="/">
            {" "}
            {/* ⬅️ MAKE LOGO CLICKABLE */}
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
          <Link to="/programs">All Programs</Link>
          <a href="#tournaments">Tournaments</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* RIGHT SIDE AUTH BUTTONS */}
        <div className="navbar__auth">
          <Link to="/login" className="btn btn--ghost btn--sm">
            Log in
          </Link>

          <Link to="/signup" className="btn btn--primary btn--sm">
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
