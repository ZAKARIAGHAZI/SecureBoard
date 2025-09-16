import { useState } from "react";
import BackgroundCanvas from "../components/BackgroundCanvas.jsx";
import Register from "./Register.jsx";

// Simuler API pour test
const api = {
  post: async (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email === "admin@example.com" && data.password === "password123") {
          resolve({ data: { token: "fake-token", user: { roles: [{ name: "admin" }] } } });
        } else {
          reject("Invalid credentials");
        }
      }, 500);
    });
  }
};

export default function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.roles[0].name);
      onLogin();
    } catch (err) {
      setError("Email ou mot de passe incorrect !");
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
          <h2 style={{ textAlign: "center", marginBottom: 20, color: "#333" }}>Connexion</h2>

          <label style={{ fontWeight: "bold" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" }}
          />

          <label style={{ fontWeight: "bold" }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" }}
          />

          {error && <p style={{ color: "red", textAlign: "center",fontWeight: "bold" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            style={{ width: "100%", padding: 12, marginTop: 10, borderRadius: 5, border: "none", backgroundColor: "#2575fc", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
          >
            Se connecter
          </button>

          <p style={{ textAlign: "center", marginTop: 15 }}>
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
