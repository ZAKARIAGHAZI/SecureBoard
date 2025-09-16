import { useEffect, useState } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users"); // route Laravel pour récupérer les users
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: 220, padding: 20 }}>
      <h2>Gestion des utilisateurs</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles.map(r => r.name).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
