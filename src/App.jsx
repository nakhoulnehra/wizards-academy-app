import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AcademyPage from "./pages/AcademyPage";
import AdminAcademyCreatePage from "./pages/AdminAcademyCreatePage";
import AdminAcademyEditPage from "./pages/AdminAcademyEditPage";
import AcademyDetailPage from "./pages/AcademyDetailPage";
import AboutPage from "./pages/AboutPage";
import AdminProgramCreatePage from "./pages/AdminProgramCreatePage";
import AdminProgramEditPage from "./pages/AdminProgramEditPage"; 
import ProgramsPage from "./pages/ProgramsPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import ContactPage from "./pages/contact";

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
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:programId" element={<ProgramDetailPage />} />
        <Route path="/academy/:id" element={<AcademyDetailPage />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/academies/new" element={<AdminAcademyCreatePage />} />
        <Route path="/admin/academies/:id/edit" element={<AdminAcademyEditPage />} />
        <Route path="/admin/academies/:academyId/add-program" element={<AdminProgramCreatePage />} />
        <Route path="/admin/programs/:programId/edit" element={<AdminProgramEditPage />} />

        {/* ✅ ADDED CONTACT ROUTE */}
        <Route path="/contact" element={<ContactPage />} />
 
      </Routes>

      <div className="backend-status">
        <span className="backend-status__label">Backend:</span>
        <span className="backend-status__message">{message}</span>
      </div>
    </Router>
  );
}

export default App;
