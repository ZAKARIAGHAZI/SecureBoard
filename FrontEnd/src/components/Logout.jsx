import React from "react";
import api from "../api";

export default function Logout({ onLogout }) {

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // récupère le token stocké
      if (!token) return;

      // Appel API logout
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Supprimer le token et rôle du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Notifier le parent ou rediriger
      onLogout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#e74c3c",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Déconnexion
    </button>
  );
}
