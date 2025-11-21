import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./components/home/FeaturedProgramsSection.jsx"; 

// GLOBAL STYLES
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/auth.css";
import "./styles/about.css";


function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Error connecting to backend:", err);
        setMessage("Error connecting to backend 😢");
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/programs" element={<ProgramsPage />} /> 
        
      </Routes>

      { 
        <div className="backend-status">
          <span className="backend-status__label">Backend:</span>
          <span className="backend-status__message">{message}</span>
        </div>
      }

    </Router>
  );
}

export default App;
