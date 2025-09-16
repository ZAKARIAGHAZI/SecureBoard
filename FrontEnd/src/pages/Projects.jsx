import { useEffect, useState } from "react";
import api from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects"); // route Laravel pour récupérer les projets
      setProjects(res.data);
    } catch (err) {
      console.error("Erreur fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: 220, padding: 20 }}>
      <h2>Gestion des projets</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom du projet</th>
              <th>Créateur</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.user.name}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
