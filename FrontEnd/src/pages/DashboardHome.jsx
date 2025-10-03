import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import api from "../api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function DashboardHome() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/user"),
      api.get("/projects"),
      api.get("/tasks"),
    ]).then(([usersRes, projectsRes, tasksRes]) => {
      // Si la réponse est un tableau (indexé), c'est la liste des users, sinon c'est un seul user
      const usersData = Array.isArray(usersRes.data)
        ? usersRes.data
        : [usersRes.data];
      setUsers(usersData);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    });
  }, []);

  // Statistiques
  const totalUsers = users.length;
  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  // Statut des projets
  const statusCounts = projects.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    { "en cours": 0, termine: 0 }
  );

  // Tâches par utilisateur
  const tasksByUser = users.map((u) => ({
    name: u.name,
    count: tasks.filter((t) => t.user_id === u.id).length,
    id: u.id,
  }));

  // Top contributeur (utilisateur avec le plus de tâches)
  const topContributor = tasksByUser.reduce(
    (max, u) => (u.count > (max?.count || 0) ? u : max),
    null
  );

  // Tâches en retard (exemple: status !== 'completed' et deadline dépassée)
  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== "completed" &&
      t.deadline &&
      new Date(t.deadline) < new Date()
  );

  // Progression globale des projets (en % de projets terminés)
  const projectProgress =
    totalProjects > 0
      ? Math.round((statusCounts["termine"] / totalProjects) * 100)
      : 0;

  // Données pour les graphiques
  const pieData = {
    labels: ["En cours", "Terminé"],
    datasets: [
      {
        data: [statusCounts["en cours"], statusCounts["termine"]],
        backgroundColor: ["#60a5fa", "#34d399"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: tasksByUser.map((u) => u.name),
    datasets: [
      {
        label: "Tâches par utilisateur",
        data: tasksByUser.map((u) => u.count),
        backgroundColor: "#818cf8",
      },
    ],
  };

  // Listes récentes
  const recentProjects = [...projects].reverse().slice(0, 5);
  const recentTasks = [...tasks].reverse().slice(0, 5);

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div
      className="dashboard-home"
      style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}
    >
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <div
          className="card"
          style={{
            ...cardStyle,
            borderTop: "4px solid #4e54c8",
            boxShadow: "0 4px 16px rgba(78,84,200,0.07)",
          }}
          title="Nombre total d'utilisateurs enregistrés"
        >
          <div
            style={{
              ...cardNumber,
              color: "#4e54c8",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span role="img" aria-label="Utilisateurs">
              👥
            </span>{" "}
            {totalUsers}
          </div>
          <div style={{ fontWeight: 600 }}>Utilisateurs</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            Collaborateurs inscrits sur la plateforme
          </div>
          {topContributor && (
            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#34d399",
                fontWeight: 600,
              }}
            >
              Top contributeur : {topContributor.name} ({topContributor.count}{" "}
              tâches)
            </div>
          )}
        </div>
        <div
          className="card"
          style={{
            ...cardStyle,
            borderTop: "4px solid #34d399",
            boxShadow: "0 4px 16px rgba(52,211,153,0.07)",
          }}
          title="Nombre total de projets suivis"
        >
          <div
            style={{
              ...cardNumber,
              color: "#34d399",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span role="img" aria-label="Projets">
              📊
            </span>{" "}
            {totalProjects}
          </div>
          <div style={{ fontWeight: 600 }}>Projets</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            Tous les projets créés et suivis
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "#818cf8",
              fontWeight: 600,
            }}
          >
            Progression globale :{" "}
            <span
              style={{ color: projectProgress === 100 ? "#34d399" : "#facc15" }}
            >
              {projectProgress}%
            </span>
          </div>
        </div>
        <div
          className="card"
          style={{
            ...cardStyle,
            borderTop: "4px solid #818cf8",
            boxShadow: "0 4px 16px rgba(129,140,248,0.07)",
          }}
          title="Nombre total de tâches assignées"
        >
          <div
            style={{
              ...cardNumber,
              color: "#818cf8",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span role="img" aria-label="Tâches">
              📝
            </span>{" "}
            {totalTasks}
          </div>
          <div style={{ fontWeight: 600 }}>Tâches</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            Tâches à réaliser ou terminées
          </div>
          {overdueTasks.length > 0 && (
            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#e11d48",
                fontWeight: 600,
              }}
            >
              Tâches en retard : {overdueTasks.length}
            </div>
          )}
        </div>
      </div>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          marginBottom: 32,
        }}
      >
        <div
          className="card"
          style={{
            ...cardStyle,
            borderLeft: "6px solid #60a5fa",
            background: "#f8fafc",
          }}
          title="Répartition des statuts de projets"
        >
          <h2 style={cardTitle}>
            <span role="img" aria-label="Statut">
              📈
            </span>{" "}
            Statut des projets
          </h2>
          <Pie data={pieData} />
          <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
            Visualisez la part de projets en cours et terminés
          </div>
        </div>
        <div
          className="card"
          style={{
            ...cardStyle,
            borderLeft: "6px solid #818cf8",
            background: "#f8fafc",
          }}
          title="Nombre de tâches par utilisateur"
        >
          <h2 style={cardTitle}>
            <span role="img" aria-label="Tâches par utilisateur">
              👤
            </span>{" "}
            Tâches par utilisateur
          </h2>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
          <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
            Répartition des tâches entre les membres
          </div>
        </div>
      </div>
      <div
        className="grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
      >
        <div
          className="card"
          style={{
            ...cardStyle,
            background: "#fff7ed",
            borderLeft: "6px solid #f59e42",
          }}
          title="Derniers projets ajoutés"
        >
          <h2 style={cardTitle}>
            <span role="img" aria-label="Projets récents">
              🆕
            </span>{" "}
            Projets récents
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {recentProjects.map((p) => (
              <li
                key={p.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span
                  style={{
                    fontSize: 12,
                    borderRadius: 6,
                    padding: "2px 8px",
                    background: p.status === "termine" ? "#d1fae5" : "#dbeafe",
                    color: p.status === "termine" ? "#059669" : "#2563eb",
                    fontWeight: 600,
                  }}
                >
                  {p.status === "termine" ? "Terminé" : "En cours"}
                </span>
                {p.description && (
                  <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>
                    {p.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="card"
          style={{
            ...cardStyle,
            background: "#f1f5f9",
            borderLeft: "6px solid #e11d48",
          }}
          title="Dernières tâches créées"
        >
          <h2 style={cardTitle}>
            <span role="img" aria-label="Tâches récentes">
              ⏳
            </span>{" "}
            Tâches récentes
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {recentTasks.map((t) => (
              <li
                key={t.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 500 }}>{t.title}</span>
                <span style={{ fontSize: 12, color: "#888" }}>
                  {users.find((u) => u.id === t.user_id)?.name || "?"}
                </span>
                {t.status && (
                  <span
                    style={{
                      fontSize: 11,
                      color: t.status === "completed" ? "#34d399" : "#f59e42",
                      marginLeft: 8,
                    }}
                  >
                    {t.status}
                  </span>
                )}
                {t.deadline && (
                  <span
                    style={{ fontSize: 11, color: "#e11d48", marginLeft: 8 }}
                  >
                    ⏰ {new Date(t.deadline).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  padding: 24,
  minHeight: 180,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
const cardNumber = {
  fontSize: 40,
  fontWeight: 700,
  color: "#4e54c8",
  marginBottom: 8,
};
const cardTitle = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 16,
  color: "#4e54c8",
};
