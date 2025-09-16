import { useState } from "react";
import BackgroundCanvas from "../components/BackgroundCanvas.jsx";

// Simuler API pour test
const api = {
  post: async (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ data: { token: "fake-token", user: { roles: [{ name: "user" }] } } });
      }, 500);
    });
  }
};

export default function Register({ onRegister, switchToLogin }) {
  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [passwordConfirmation, setPasswordConfirmation] = useState("password123");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await api.post("/register", { name, email, password, password_confirmation: passwordConfirmation });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.roles[0].name);
      setSuccess("Inscription réussie !");
      setError("");
      onRegister();
    } catch (err) {
      setError("Erreur lors de l'inscription");
      setSuccess("");
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
          <h2 style={{ textAlign: "center", marginBottom: 20, color: "#333" }}>Inscription</h2>

          <label style={{ fontWeight: "bold" }}>Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 5, border: "1px solid #ccc" }}
          />

          <label style={{ fontWeight: "bold" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 5, border: "1px solid #ccc" }}
          />

          <label style={{ fontWeight: "bold" }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 5, border: "1px solid #ccc" }}
          />

          <label style={{ fontWeight: "bold" }}>Confirmer mot de passe</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 5, border: "1px solid #ccc" }}
          />

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

          <button
            onClick={handleSubmit}
            style={{ width: "100%", padding: 12, marginTop: 10, borderRadius: 5, border: "none", backgroundColor: "#2575fc", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
          >
            S'inscrire
          </button>

          <p style={{ textAlign: "center", marginTop: 15 }}>
            Déjà un compte ?{" "}
            <span style={{ color: "#ff7eb3", cursor: "pointer", fontWeight: "bold" }} onClick={switchToLogin}>
              Se connecter
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
