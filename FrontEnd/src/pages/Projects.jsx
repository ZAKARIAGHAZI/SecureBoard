import { useEffect, useState } from "react";
import api from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [projectErrors, setProjectErrors] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: "en cours" });
  const [statusError, setStatusError] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    user_id: "",
  });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "en cours",
  });

  // Ouvrir la modale statut
  const handleOpenStatusModal = (project) => {
    setSelectedProject(project);
    setStatusUpdate({ status: project.status || "en cours" });
    setStatusError("");
    setShowStatusModal(true);
  };

  // Mettre à jour le statut projet
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setStatusError("");
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/projects/${selectedProject.id}`,
        { status: statusUpdate.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id ? { ...p, status: statusUpdate.status } : p
        )
      );
      setShowStatusModal(false);
      setSelectedProject(null);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.errors &&
        err.response.data.errors.status
      ) {
        setStatusError(err.response.data.errors.status[0]);
      } else {
        setStatusError("Erreur lors de la mise à jour du statut");
      }
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetch users", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Erreur fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (project) => {
    setSelectedProject(project);
    setShowForm(true);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      user_id: "",
    });
    setErrors({});
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...newTask,
        project_id: selectedProject.id,
      };
      await api.post("/tasks", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setSelectedProject(null);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        user_id: "",
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Erreur lors de la création de la tâche");
      }
    }
  };

  const handleOpenProjectForm = () => {
    setShowProjectForm(true);
    setNewProject({ name: "", description: "", status: "en cours" });
    setProjectErrors({});
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setProjectErrors({});
    try {
      const token = localStorage.getItem("token");
      let userId = null;
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userId = userObj.id;
        } catch {
          console.error("Erreur parsing user depuis localStorage");
        }
      }
      if (!userId) {
        alert("Impossible de déterminer l'utilisateur connecté.");
        return;
      }
      const payload = { ...newProject, user_id: userId };
      await api.post("/projects", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowProjectForm(false);
      setNewProject({ name: "", description: "", status: "en cours" });
      fetchProjects();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setProjectErrors(err.response.data.errors);
      } else {
        alert("Erreur lors de la création du projet");
      }
    }
  };

  return (
    <div>
      {/* Bouton Créer projet */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <button
          style={{
            background: "#4e54c8",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={handleOpenProjectForm}
        >
          ➕ Créer un projet
        </button>
      </div>

      {/* MODAL FORM PROJET */}
      {showProjectForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleCreateProject}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              width: 350,
              color: "#222",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#4e54c8" }}>Créer un projet</h3>
            <input
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
              }}
              type="text"
              placeholder="Nom du projet"
              value={newProject.name}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            {projectErrors.name && (
              <div style={{ color: "#e53935", fontSize: 13 }}>
                {projectErrors.name[0]}
              </div>
            )}
            <textarea
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
                minHeight: 50,
              }}
              placeholder="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            {projectErrors.description && (
              <div style={{ color: "#e53935", fontSize: 13 }}>
                {projectErrors.description[0]}
              </div>
            )}
            <select
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
              }}
              value={newProject.status}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, status: e.target.value }))
              }
              required
            >
              <option value="en cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
            {projectErrors.status && (
              <div style={{ color: "#e53935", fontSize: 13 }}>
                {projectErrors.status[0]}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setShowProjectForm(false);
                  setProjectErrors({});
                }}
                style={{
                  background: "#aaa",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  marginRight: 5,
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                style={{
                  background: "#4e54c8",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste projets */}
      <div className="projects-container">
        {loading ? (
          <p>Chargement des projets...</p>
        ) : projects.length === 0 ? (
          <p>Aucun projet trouvé.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3 style={{ margin: "0 0 10px 0" }}>{project.name}</h3>
              <p style={{ flex: 1 }}>
                {project.description || "Pas de description"}
              </p>
              <small
                style={{
                  color: project.status === "termine" ? "#16a34a" : "#facc15",
                  fontWeight: "bold",
                }}
              >
                Statut: {project.status === "termine" ? "Terminé" : "En cours"}
              </small>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  style={{
                    background: "#4e54c8",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleOpenForm(project)}
                >
                  ➕ Ajouter une tâche
                </button>
                <button
                  style={{
                    background: "#ff9800",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleOpenStatusModal(project)}
                >
                  ✏ Modifier le statut
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL STATUT */}
      {showStatusModal && selectedProject && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: 10,
          }}
        >
          <form
            onSubmit={handleUpdateStatus}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              width: "95%",
              maxWidth: 350,
              color: "#222",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#ff9800" }}>
              Modifier le statut du projet
            </h3>
            <div style={{ marginBottom: 16 }}>
              <strong>Projet:</strong> {selectedProject.name}
            </div>
            <select
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
              }}
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate({ status: e.target.value })}
              required
            >
              <option value="en cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
            {statusError && (
              <div style={{ color: "#e53935", fontSize: 13 }}>{statusError}</div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusError("");
                }}
                style={{
                  background: "#aaa",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  marginRight: 5,
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                style={{
                  background: "#ff9800",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL FORM TÂCHE */}
      {showForm && selectedProject && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleCreateTask}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              width: 350,
              color: "#222",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#4e54c8" }}>
              Ajouter une tâche à{" "}
              <span style={{ color: "#222" }}>{selectedProject.name}</span>
            </h3>
            <input
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
              }}
              type="text"
              placeholder="Titre"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            {errors.title && (
              <div style={{ color: "#e53935", fontSize: 13 }}>
                {errors.title[0]}
              </div>
            )}
            <textarea
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
                minHeight: 50,
              }}
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            {errors.description && (
              <div style={{ color: "#e53935", fontSize: 13 }}>
                {errors.description[0]}
              </div>
            )}
            <select
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
              }}
              value={newTask.user_id}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, user_id: e.target.value }))
              }
              required
            >
              <option value="">Assigner à un utilisateur</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.user_id && (
              <div style={{ color: "#e53935", fontSize: 13 }}>
                {errors.user_id[0]}
              </div>
            )}
            <select
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 10,
              }}
              value={newTask.status}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, status: e.target.value }))
              }
              required
            >
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
            </select>
            {errors.status && (
              <div style={{ color: "#e53935", fontSize: 13 }}>
                {errors.status[0]}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedProject(null);
                  setErrors({});
                }}
                style={{
                  background: "#aaa",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  marginRight: 5,
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                style={{
                  background: "#4e54c8",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}