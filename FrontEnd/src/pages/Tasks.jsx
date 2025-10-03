import React, { useEffect, useState } from "react";
import api from "../api";

export default function Tasks({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);

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
      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);

      if (currentUser?.role === "user" && res.data.length === 1) {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Erreur mise à jour status:", err);
    }
  };

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...newTask,
        project_id: Number(newTask.project_id),
        user_id: Number(newTask.user_id),
      };

      let res;
      if (editingTaskId) {
        // Update task
        res = await api.put(`/tasks/${editingTaskId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTaskId ? res.data : t))
        );
      } else {
        // Create new task
        res = await api.post("/tasks", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) => [...prev, res.data]);
      }

      setShowForm(false);
      setEditingTaskId(null);
      setNewTask({
        title: "",
        description: "",
        project_id: "",
        status: "pending",
        user_id: currentUser?.role === "user" ? currentUser.id : "",
      });
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        console.error("Erreur création/mise à jour task:", err);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Erreur suppression task:", err);
    }
  };

  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description || "",
      project_id: task.project_id,
      status: task.status,
      user_id: task.user_id,
    });
    setEditingTaskId(task.id);
    setShowForm(true);
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

  const filteredTasks =
    currentUser?.role === "user"
      ? tasks.filter((task) => task.user_id === currentUser.id)
      : tasks;

  return (
    <div style={{ padding: "15px" }}>
      {/* Header */}
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
          onClick={() => {
            setShowForm(true);
            setEditingTaskId(null);
            setNewTask({
              title: "",
              description: "",
              project_id: "",
              status: "pending",
              user_id: currentUser?.role === "user" ? currentUser.id : "",
            });
          }}
          style={buttonStyle}
        >
          + Add Task
        </button>
      </div>

      {/* Cards */}
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
        ) : filteredTasks.length === 0 ? (
          <p style={{ color: "#fff" }}>Aucune tâche trouvée.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} style={cardStyle}>
              <h3 style={{ margin: "0 0 8px 0", color: "#222" }}>
                {task.title}
              </h3>
              <p style={{ margin: "0 0 8px 0", flex: 1 }}>
                {task.description || "Pas de description"}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#555",
                  marginBottom: "4px",
                }}
              >
                Projet: {task.project?.name || "N/A"}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#555",
                  marginBottom: "8px",
                }}
              >
                Utilisateur: {task.user?.name || "N/A"}
              </p>
              <select
                value={task.status || "pending"}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                style={{
                  ...statusSelectStyle,
                  ...getStatusStyle(task.status),
                }}
              >
                <option value="pending">pending</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
              </select>

              {/* Modify + Delete buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <button
                  style={{
                    ...buttonStyle,
                    background: "#facc15",
                    color: "#000",
                  }}
                  onClick={() => handleEditTask(task)}
                >
                  ✏️ Modify
                </button>
                <button
                  style={{ ...buttonStyle, background: "#dc2626" }}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleCreateOrUpdateTask} style={modalStyle}>
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#4e54c8",
                fontWeight: "bold",
              }}
            >
              {editingTaskId ? "✏️ Edit Task" : "➕ Add New Task"}
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
                setNewTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <select
              style={inputStyle}
              value={newTask.project_id}
              onChange={(e) =>
                setNewTask((prev) => ({
                  ...prev,
                  project_id: e.target.value,
                }))
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
            {currentUser?.role !== "user" && (
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
                onClick={() => {
                  setShowForm(false);
                  setEditingTaskId(null);
                }}
                style={cancelBtnStyle}
              >
                Cancel
              </button>
              <button type="submit" style={saveBtnStyle}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Styles
const cardStyle = {
  backgroundColor: "#fff",
  color: "#111",
  padding: "20px",
  borderRadius: "15px",
  minHeight: "200px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s, box-shadow 0.2s",
  width: "100%",
  maxWidth: "280px",
};
const buttonStyle = {
  background: "#4e54c8",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "10px",
};
const statusSelectStyle = {
  padding: "6px 12px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "12px",
  fontWeight: "bold",
  cursor: "pointer",
};
const modalOverlayStyle = {
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
};
const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
};
const cancelBtnStyle = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#e0e0e0",
  cursor: "pointer",
};
const saveBtnStyle = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#4e54c8",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
