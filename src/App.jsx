import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AllProgramsPage from "./pages/AllProgramsPage";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/programs" element={<AllProgramsPage />} />
      </Routes>

      {/* 
        <div className="backend-status">
          <span className="backend-status__label">Backend:</span>
          <span className="backend-status__message">{message}</span>
        </div>
      */}

    </Router>
  );
}

export default App;
