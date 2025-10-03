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
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user");
      console.log("API Users:", res.data); // Vérifie ici la structure des rôles
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateUser = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    try {
      let payload = { name, email, role };
      if (!editUser || password) {
        payload.password = password;
      }
      let res;
      if (editUser) {
        res = await api.put(`/user/${editUser.id}`, payload);
        setUsers(users.map((u) => (u.id === editUser.id ? res.data : u)));
      } else {
        res = await api.post("/user", payload);
        setUsers([...users, res.data]);
      }

      // Reset
      setShowForm(false);
      setEditUser(null);
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        setGlobalError(err.response.data.message);
      } else {
        setGlobalError("Erreur inattendue lors de l'ajout ou modification.");
      }
      console.error("Erreur ajout/modification user", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("⚠ Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/user/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erreur suppression user", err);
    }
  };

  const openEditForm = (user) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRole(user.role?.name || (user.roles?.[0]?.name ?? user.role ?? ""));
    setShowForm(true);
  };

  // 🔎 Filtrer les utilisateurs
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Fonction pour récupérer le rôle correctement
  const getUserRole = (u) => {
    if (u.role && typeof u.role === "object" && u.role.name) return u.role.name;
    if (u.roles && Array.isArray(u.roles) && u.roles.length > 0)
      return u.roles.map((r) => r.name).join(", ");
    if (u.role && typeof u.role === "string") return u.role;
    return "Aucun rôle";
  };

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
              <h3>{editUser ? " Modifier un utilisateur" : "Ajouter un utilisateur"}</h3>
              <form onSubmit={handleAddOrUpdateUser} style={formStyle}>
                {globalError && (
                  <div style={{ color: "#e53935", marginBottom: 10, fontWeight: "bold" }}>{globalError}</div>
                )}
                <label>Nom :</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                {errors.name && <div style={{ color: "#e53935", fontSize: 13 }}>{errors.name[0]}</div>}

                <label>Email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                {errors.email && <div style={{ color: "#e53935", fontSize: 13 }}>{errors.email[0]}</div>}

                <label>Password :</label>
                <input
                  type="password"
                  placeholder={editUser ? "Laisser vide pour ne pas changer" : "Mot de passe"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editUser}
                  style={inputStyle}
                />
                {errors.password && <div style={{ color: "#e53935", fontSize: 13 }}>{errors.password[0]}</div>}

                <label>Rôle :</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required style={inputStyle}>
                  <option value="">-- Sélectionner un rôle --</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">Utilisateur</option>
                </select>
                {errors.role && <div style={{ color: "#e53935", fontSize: 13 }}>{errors.role[0]}</div>}

                <div style={{ marginTop: 15, textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditUser(null);
                      setErrors({});
                      setGlobalError("");
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
                  <tr key={u.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ececec" }}>
                    <td style={tdStyle}>{u.id}</td>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={roleBadge}>{getUserRole(u)}</span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => openEditForm(u)} style={editButton}> Modifier</button>
                      <button onClick={() => handleDeleteUser(u.id)} style={deleteButton}> Supprimer</button>
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
  width: "100%",
};

const contentWrapper = {
  width: "100%",
  maxWidth: "1000px",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};

const titleStyle = { marginBottom: 20, fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#333" };
const topBar = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 };
const searchInput = { flex: 1, marginRight: 10, padding: 10, borderRadius: 6, border: "1px solid #ccc" };
const addButton = { padding: "10px 20px", backgroundColor: "#4e54c8", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" };
const tableWrapper = { overflowX: "auto", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const tableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" };
const thStyle = { padding: 12, textAlign: "left", backgroundColor: "#4e54c8", color: "#fff", fontWeight: "bold" };
const tdStyle = { padding: 12, borderBottom: "1px solid #ddd", color: "#333" };
const roleBadge = { display: "inline-block", padding: "4px 10px", margin: 2, borderRadius: 20, backgroundColor: "#4e54c8", color: "#fff", fontSize: 12, fontWeight: "bold" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContent = { backgroundColor: "#fff", padding: 15, borderRadius: 12, width: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", color: "#333" };
const formStyle = { display: "flex", flexDirection: "column" };
const inputStyle = { padding: 10, margin: "8px 0", borderRadius: 6, border: "1px solid #ccc" };
const cancelButton = { backgroundColor: "#aaa", border: "none", padding: "8px 16px", borderRadius: 16, color: "#fff", marginRight: 10, cursor: "pointer" };
const saveButton = { backgroundColor: "#4e54c8", border: "none", padding: "8px 16px", borderRadius: 16, color: "#fff", cursor: "pointer" };
const editButton = { backgroundColor: "#6adae2ff", border: "none", padding: "6px 12px", borderRadius: 16, color: "#fff", marginRight: 8, cursor: "pointer" };
const deleteButton = { backgroundColor: "#85312fff", border: "none", padding: "6px 12px", borderRadius: 16, color: "#fff", cursor: "pointer" };