import React, { useState, useEffect } from "react";
import Users from "./Users";
import api from "../api"; // ton axios configuré avec baseURL
import Projects from "./Projects";

import Logout from "../components/Logout";
import api from "../api";
import Tasks from "./Tasks";


export default function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("home"); // home, users, projects
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération user:", err);
        onLogout(); // si token invalide => logout
      }
    };
    fetchUser();
  }, [onLogout]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#2c3e50",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "40px" }}>🚀 SecureBoard</h2>

        {/* Profil utilisateur */}
        {user && (
          <div
            style={{
              backgroundColor: "#34495e",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#8f94fb",
                margin: "0 auto 10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <p style={{ margin: "5px 0", fontWeight: "bold" }}>{user.name}</p>
            <p style={{ margin: "0", fontSize: "12px", color: "#ccc" }}>
              {user.email}
            </p>
          </div>
        )}

        {/* Navigation */}
        <button
          onClick={() => setActivePage("home")}
          style={sidebarButtonStyle(activePage === "home")}
        >
          🏠 Dashboard
        </button>
        <button
          onClick={() => setActivePage("users")}
          style={sidebarButtonStyle(activePage === "users")}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActivePage("projects")}
          style={sidebarButtonStyle(activePage === "projects")}
        >
          📊 Projects
        </button>
        <button
          onClick={() => setActivePage("tasks")}
          style={sidebarButtonStyle(activePage === "tasks")}
        >
          📝 Tasks
        </button>

        {/* Déconnexion */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={onLogout}
            style={{
              ...sidebarButtonStyle(false),
              backgroundColor: "#e74c3c",
              marginTop: "20px",
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content - prend toute la largeur restante */}
      <main
        style={{
          flex: 2, // ← prend tout l'espace restant
          padding: "40px",
          background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          width: "940px", // ← important pour s'étendre
        }}
      >
        {activePage === "home" && <h1>Bienvenue {user ? user.name : ""} 👋</h1>}

        {activePage === "users" && (
          <div style={{ flex: 1, width: "100%" }}>
            <h1>👥 Gestion des utilisateurs</h1>
            <Users />
          </div>
        )}

        {activePage === "projects" && (
          <div style={{ flex: 1, width: "100%" }}>
            <h1>📊 Gestion des projets</h1>
            <p>Liste et gestion des projets ici.</p>
            <Projects />
          </div>
        )}

        {activePage === "tasks" && (
          <div style={{ flex: 1, width: "100%" }}>
            <h1>📝 Gestion des tâches</h1>
            <p></p>
            <Tasks />
          </div>
        )}
      </main>
    </div>
  );
}

// Style pour les boutons du sidebar
const sidebarButtonStyle = (active) => ({
  backgroundColor: active ? "#34495e" : "transparent",
  border: "none",
  color: "#fff",
  padding: "12px 20px",
  marginBottom: "10px",
  borderRadius: "8px",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: active ? "bold" : "normal",
});
