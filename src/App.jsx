import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // Fetch data from your backend
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => {
        console.error("Error connecting to backend:", err);
        setMessage("Error connecting to backend 😢");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Wizards Academy App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
