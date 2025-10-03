import React, { useState, useEffect } from "react";

import Users from "./Users";
import Projects from "./Projects";
import Tasks from "./Tasks";
import DashboardHome from "./DashboardHome";
import Logout from "../components/Logout";
import "./Dashboard.css";

export default function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Récupération utilisateur connecté depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      onLogout();
    }
  }, [onLogout]);

  // Normalisation pour affichage
  const getUserName = (u) => u?.name || "Utilisateur";
  const getUserEmail = (u) => u?.email || "Aucun email";
  const getUserRole = (u) => u?.role || null;

  const renderUserProfile = () => {
    if (!user || !sidebarOpen) return null;

    return (
      <div
        style={{
          backgroundColor: "#34495e",
          padding: "18px 12px 14px 12px",
          borderRadius: "10px",
          marginBottom: "24px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(52,73,94,0.08)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#4e54c8,#8f94fb)",
            margin: "0 auto 12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "28px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 1,
            boxShadow: "0 2px 8px rgba(78,84,200,0.10)",
          }}
        >
          {getUserName(user)
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <p
          style={{
            margin: "5px 0 2px 0",
            fontWeight: "bold",
            fontSize: 16,
            color: "#fff",
          }}
        >
          {getUserName(user)}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#ccc",
            wordBreak: "break-all",
          }}
        >
          {getUserEmail(user)}
        </p>
        {getUserRole(user) && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: "#facc15",
              fontWeight: 600,
            }}
          >
            Rôle : {getUserRole(user)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
        style={{
          backgroundColor: "#2c3e50",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: sidebarOpen ? "20px" : "0",
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            marginBottom: "40px",
            display: sidebarOpen ? "block" : "none",
          }}
        >
          SecureBoard
        </h2>

        {/* Profil utilisateur */}
        {renderUserProfile()}

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
          <Logout onLogout={onLogout} />
        </div>
      </aside>

      {/* Main content */}
      <main
        className="dashboard-main"
        style={{
          background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
          color: "#fff",
          minWidth: 0,
        }}
      >
        {activePage === "home" && <DashboardHome />}
        {activePage === "users" && (
          <div style={{ flex: 1, width: "100%" }}>
            <h1> Gestion des utilisateurs</h1>
            <Users />
          </div>
        )}
        {activePage === "projects" && (
          <div style={{ flex: 1, width: "100%" }}>
            <h1> Gestion des projets</h1>
            <Projects />
          </div>
        )}
        {activePage === "tasks" && user && (
          <div style={{ flex: 1, width: "100%" }}>
            <h1>📝 Gestion des tâches</h1>
            <Tasks currentUser={user} />
          </div>
        )}
      </main>
    </div>
  );
}

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