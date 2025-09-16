import React from "react";

export default function Dashboard({ onLogout }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          padding: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>🚀 SecureBoard</h2>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#ff4b5c",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Déconnexion
        </button>
      </header>

      {/* Contenu principal */}
      <main
        style={{
          flex: 1,
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h3>👥 Utilisateurs</h3>
          <p>Gérer les utilisateurs de la plateforme.</p>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h3>📊 Projets</h3>
          <p>Consultez et organisez vos projets.</p>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h3>⚙️ Paramètres</h3>
          <p>Configurer les paramètres de sécurité.</p>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "15px",
          textAlign: "center",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <p style={{ margin: 0 }}>© 2025 SecureBoard. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
