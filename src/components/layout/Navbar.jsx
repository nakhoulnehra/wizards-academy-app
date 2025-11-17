import React from "react";
import logo from "../../assets/images/wfa-logo.png";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <div className="navbar__brand">
          <img
            src={logo}
            alt="Wizards Football Academy logo"
            className="navbar__logo"
          />
          <div className="navbar__brand-text">
            <span className="navbar__brand-title">Wizards</span>
            <span className="navbar__brand-subtitle">Football Academy</span>
          </div>
        </div>

        <nav className="navbar__nav">
          <a href="#programs">Programs</a>
          <a href="#teams">Teams</a>
          <a href="#tournaments">Tournaments</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navbar__auth">
          <button className="btn btn--ghost btn--sm">Log in</button>
          <button className="btn btn--primary btn--sm">Create account</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
