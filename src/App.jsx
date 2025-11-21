import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AcademyPage from "./pages/AcademyPage";
import AdminAcademyCreatePage from "./pages/AdminAcademyCreatePage";
import AdminAcademyEditPage from "./pages/AdminAcademyEditPage";
import AboutPage from "./pages/AboutPage";

// Treat the FeaturedProgramsSection as a page for /programs
import ProgramsPage from "./components/home/FeaturedProgramsSection.jsx";

// STORE
import useAuthStore from "./store/authStore";

// GLOBAL STYLES
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/auth.css";

function App() {
  const [message, setMessage] = useState("Loading...");
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth from localStorage
    initializeAuth();

    // Backend connection check removed - root endpoint doesn't exist
    // The backend only has /auth, /programs, and /academies routes
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/academy" element={<AcademyPage />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/academies/new" element={<AdminAcademyCreatePage />} />
        <Route path="/admin/academies/:id/edit" element={<AdminAcademyEditPage />} />
      </Routes>

      {/* Backend status block from the branch */}
      <div className="backend-status">
        <span className="backend-status__label">Backend:</span>
        <span className="backend-status__message">{message}</span>
      </div>
    </Router>
  );
}

export default App;
