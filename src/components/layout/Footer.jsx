import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__inner container">
        <div className="footer__col">
          <h3 className="footer__title">Wizards Football Academy</h3>
          <p className="footer__text">
            Developing young players with discipline, creativity, and passion
            for the beautiful game.
          </p>
        </div>

        <div className="footer__col footer__col--links">
          <h4>Quick links</h4>
          <Link to="/programs">Programs</Link>
          <a href="#teams">Teams</a>
          <a href="#tournaments">Tournaments</a>
          <Link to="/about">About</Link>
        </div>

        <div className="footer__col footer__col--social">
          <h4>Follow us</h4>
          <div className="footer__social-row">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>
            <a href="#" aria-label="Twitter">
              Twitter
            </a>
            <a href="#" aria-label="YouTube">
              YouTube
            </a>
            <a href="#" aria-label="TikTok">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>
            © {new Date().getFullYear()} Wizards Football Academy. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;