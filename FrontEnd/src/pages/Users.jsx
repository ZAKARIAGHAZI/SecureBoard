import { useEffect, useState } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");

  // Formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, email, role };
      if (!editUser || password) {
        payload.password = password;
      }

      if (editUser) {
        const res = await api.put(`/user/${editUser.id}`, payload);
        setUsers(users.map((u) => (u.id === editUser.id ? res.data : u)));
      } else {
        const res = await api.post("/user", payload);

        setUsers([...users, res.data]);
      }

      // Reset form
      setShowForm(false);
      setEditUser(null);
      setName("");
      setEmail("");
      setRole("");
    } catch (err) {
      console.error(
        "Erreur ajout/modification user",
        err.response?.data || err
      );
    }
  };


  const handleDeleteUser = async (id) => {
    if (!window.confirm("⚠️ Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erreur suppression user", err);
    }
  };

  const openEditForm = (user) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role || (user.roles?.[0]?.name ?? ""));
    setShowForm(true);
  };

  // 🔎 Filtrer les utilisateurs
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <div style={contentWrapper}>
        <h2 style={titleStyle}>👥 Gestion des utilisateurs</h2>

        {/* Recherche + Ajouter */}
        <div style={topBar}>
          <input
            type="text"
            placeholder="🔎 Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
          <button style={addButton} onClick={() => setShowForm(true)}>
            ➕ Ajouter un utilisateur
          </button>
        </div>

        {/* Formulaire modal */}
        {showForm && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h3>
                {editUser
                  ? "✏️ Modifier un utilisateur"
                  : "➕ Ajouter un utilisateur"}
              </h3>
              <form onSubmit={handleAddOrUpdateUser} style={formStyle}>
                <label>Nom :</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                />

                <label>Email :</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />

                <label>Rôle :</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={inputStyle}
                >
                  <option value="">-- Sélectionner un rôle --</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">Utilisateur</option>
                </select>

                <div style={{ marginTop: 15, textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditUser(null);
                    }}
                    style={cancelButton}
                  >
                    Annuler
                  </button>
                  <button type="submit" style={saveButton}>
                    {editUser ? "Mettre à jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tableau */}
        {loading ? (
          <p style={{ textAlign: "center", fontWeight: "bold" }}>Chargement...</p>
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rôle</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr
                    key={u.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ececec",
                    }}
                  >
                    <td style={tdStyle}>{u.id}</td>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      {u.roles && u.roles.length > 0
                        ? u.roles.map((r) => (
                            <span key={r.name} style={roleBadge}>
                              {r.name}
                            </span>
                          ))
                        : u.role || "Aucun rôle"}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => openEditForm(u)} style={editButton}>
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        style={deleteButton}
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 Styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "30vh",
  background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
  padding: 20,
};

const contentWrapper = {
  width: "100%",
  maxWidth: "1000px",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};

const titleStyle = {
  marginBottom: 20,
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#333",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const searchInput = {
  flex: 1,
  marginRight: "10px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const addButton = {
  padding: "10px 20px",
  backgroundColor: "#4e54c8",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const tableWrapper = {
  overflowX: "auto",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#4e54c8",
  color: "#fff",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const roleBadge = {
  display: "inline-block",
  padding: "4px 10px",
  margin: "2px",
  borderRadius: "20px",
  backgroundColor: "#4e54c8",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "bold",
};

// Modal
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "12px",
  width: "400px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const cancelButton = {
  backgroundColor: "#aaa",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  color: "#fff",
  marginRight: "10px",
  cursor: "pointer",
};

const saveButton = {
  backgroundColor: "#4e54c8",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
};

const editButton = {
  backgroundColor: "#ff9800",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  color: "#fff",
  marginRight: "8px",
  cursor: "pointer",
};

const deleteButton = {
  backgroundColor: "#e53935",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
};
