import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";

import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/auth.css"; 

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // Fetch data from your backend
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Error connecting to backend:", err);
        setMessage("Error connecting to backend 😢");
      });
  }, []);

  return (
    <>
      <HomePage />

      {/* Tiny debug/status badge – optional */}
      <div className="backend-status">
        <span className="backend-status__label">Backend:</span>
        <span className="backend-status__message">{message}</span>
      </div>
    </>
  );
}

export default App;
