import React, { useEffect, useState } from "react";
import api from "../api"; // axios configuré avec baseURL et token

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Erreur fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
      {loading ? (
        <p>Chargement des projets...</p>
      ) : projects.length === 0 ? (
        <p>Aucun projet trouvé.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: "#ffffff20",
              padding: "20px",
              borderRadius: "15px",
              width: "250px",
              minHeight: "150px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#fff",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{project.name}</h3>
            <p style={{ flex: 1 }}>{project.description || "Pas de description"}</p>
            <small style={{ color: "#ccc" }}>Status: {project.status || "En cours"}</small>
          </div>
        ))
      )}
    </div>
  );
}
