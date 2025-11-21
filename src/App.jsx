import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// FROM about-page branch
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./components/home/FeaturedProgramsSection.jsx";

// FROM main branch
import AcademyPage from "./pages/AcademyPage";
import AdminAcademyCreatePage from "./pages/AdminAcademyCreatePage";
import AdminAcademyEditPage from "./pages/AdminAcademyEditPage";

// STORE
import useAuthStore from "./store/authStore";

// GLOBAL STYLES
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/auth.css";
import "./styles/about.css";

function App() {
  const [message, setMessage] = useState("Loading...");
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* FROM about-page */}
        <Route path="/programs" element={<ProgramsPage />} />

        {/* FROM main */}
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/admin/academies/new" element={<AdminAcademyCreatePage />} />
        <Route path="/admin/academies/:id/edit" element={<AdminAcademyEditPage />} />
      </Routes>

      <div className="backend-status">
        <span className="backend-status__label">Backend:</span>
        <span className="backend-status__message">{message}</span>
      </div>
    </Router>
  );
}

export default App;
