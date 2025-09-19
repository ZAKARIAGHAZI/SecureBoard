import React, { useEffect, useState } from "react";
import api from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project_id: "",
    status: "pending",
    user_id: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Erreur fetch tasks:", err);
    } finally {
      setLoading(false);
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
      console.error("Erreur fetch projects:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);

      // if normal user, auto assign self
      const role = localStorage.getItem("role");
      if (role === "user" && res.data.length === 1) {
        setNewTask((prev) => ({ ...prev, user_id: res.data[0].id }));
      }
    } catch (err) {
      console.error("Erreur fetch users:", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Erreur mise à jour status:", err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...newTask,
        project_id: Number(newTask.project_id),
        user_id: Number(newTask.user_id),
      };
      const res = await api.post("/tasks", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => [...prev, res.data]);
      setShowForm(false);
      setNewTask({
        title: "",
        description: "",
        project_id: "",
        status: "pending",
        user_id:
          localStorage.getItem("role") === "user"
            ? Number(localStorage.getItem("user_id"))
            : "",
      });
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        console.error("Erreur création task:", err);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return { backgroundColor: "#16a34a", color: "#fff" };
      case "in_progress":
        return { backgroundColor: "#facc15", color: "#000" };
      default:
        return { backgroundColor: "#d1d5db", color: "#000" };
    }
  };

  const inputStyle = {
    width: "95%",
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "14px",
  };

  return (
    <div style={{ padding: "15px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h3 style={{ margin: 0, color: "#fff", flex: "1 1 200px" }}>
          📋 Liste et gestion des tâches
        </h3>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#4e54c8",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px",
            flex: "0 0 auto",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3f44a8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4e54c8")}
        >
          + Add Task
        </button>
      </div>

      {/* TASK CARDS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <p style={{ color: "#fff" }}>Chargement des tâches...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: "#fff" }}>Aucune tâche trouvée.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: "#fff",
                color: "#111",
                padding: "20px",
                borderRadius: "15px",
                minHeight: "180px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s, box-shadow 0.2s",
                width: "100%",
                maxWidth: "280px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", color: "#222" }}>
                {task.title}
              </h3>
              <p style={{ margin: "0 0 8px 0", flex: 1 }}>
                {task.description || "Pas de description"}
              </p>
              <p
                style={{ fontSize: "12px", color: "#555", marginBottom: "8px" }}
              >
                Projet: {task.project?.name || "N/A"}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                <select
                  value={task.status || "pending"}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    ...getStatusStyle(task.status),
                  }}
                >
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                </select>
                {task.assigned_by_role &&
                  ["manager", "admin"].includes(task.assigned_by_role) && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        flex: "1 1 100%",
                      }}
                    >
                      Assigned by: {task.assigned_by_name}
                    </span>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div
          style={{
            background: "rgba(0,0,0,0.7)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleCreateTask}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#4e54c8",
                fontWeight: "bold",
              }}
            >
              ➕ Add New Task
            </h2>
            <input
              style={inputStyle}
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }}
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            <select
              style={inputStyle}
              value={newTask.project_id}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, project_id: e.target.value }))
              }
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Role-based User Selection */}
            {localStorage.getItem("role") !== "user" && (
              <select
                style={inputStyle}
                value={newTask.user_id}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, user_id: e.target.value }))
                }
                required
              >
                <option value="">Assign to User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}

            <select
              style={inputStyle}
              value={newTask.status}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#e0e0e0",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#4e54c8",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
