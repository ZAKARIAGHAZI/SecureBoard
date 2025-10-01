import { useState } from "react";
import api from "../api.jsx"; // notre axios centralisé
import BackgroundCanvas from "../components/BackgroundCanvas.jsx";


export default function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      const response = await api.post("/login", { email, password });
      console.log("Login response:", response.data);

      // Stocker token et user dans localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Appeler la fonction de login dans App.jsx pour rediriger vers Dashboard
      onLogin();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422 || err.response?.status === 401) {
        setError("Email ou mot de passe incorrect !");
      } else {
        setError("Une erreur est survenue, réessayez plus tard.");
      }
    }
  };

  return (
    <>
      <BackgroundCanvas />
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{
          width: 350,
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          backgroundColor: "#476eb3"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: 20, color: "#fff" }}>Connexion</h2>

          <label style={{ fontWeight: "bold", color: "#fff" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" }}
          />

          <label style={{ fontWeight: "bold", color: "#fff" }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" }}
          />

          {error && <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: 12,
              marginTop: 10,
              borderRadius: 5,
              border: "none",
              backgroundColor: "#2575fc",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Se connecter
          </button>

          <p style={{ textAlign: "center", marginTop: 15, color: "#fff" }}>
            Pas de compte ?{" "}
            <span style={{ color: "#ff7eb3", cursor: "pointer", fontWeight: "bold" }} onClick={switchToRegister}>
              S'inscrire
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
