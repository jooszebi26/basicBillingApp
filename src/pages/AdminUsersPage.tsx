import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  updateUserRoles,
  deleteUser,
  type AdminUser,
} from "../api/admin";

const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  // Globális szerepkörök – de ADMIN-t később kiszűrjük admin sor esetén
  const AVAILABLE_ROLES = ["USER", "ACCOUNTANT"];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();

      setUsers(
        data.map((u) => ({
          ...u,
          roles: u.roles ?? [],
        }))
      );
    } catch (err) {
      setError("Nem sikerült lekérni a felhasználókat.");
    } finally {
      setLoading(false);
    }
  };

  const handleRolesChange = (username: string, selected: string[]) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.username === username ? { ...u, roles: selected } : u
      )
    );
  };

  const handleRolesSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    username: string
  ) => {
    const selectedRoles = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    handleRolesChange(username, selectedRoles);
  };

  const handleSaveRoles = async (user: AdminUser) => {
    try {
      setSavingUser(user.username);
      await updateUserRoles(user.username, user.roles ?? []);
    } catch (err) {
      setError("Nem sikerült elmenteni a szerepkör módosítást.");
    } finally {
      setSavingUser(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(
      `Biztosan törölni szeretnéd a(z) "${user.username}" felhasználót?`
    );
    if (!confirmed) return;

    try {
      setDeletingUser(user.username);
      await deleteUser(user.username);
      setUsers((prev) => prev.filter((u) => u.username !== user.username));
    } catch (err) {
      setError("Nem sikerült törölni a felhasználót.");
    } finally {
      setDeletingUser(null);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Adatok betöltése...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <h1>Adminisztrációs oldal – Felhasználók</h1>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#e0e0e0",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Vissza
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            color: "#b30000",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <p>Nincs megjeleníthető felhasználó.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f3f3" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Név
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Felhasználónév
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Jelenlegi szerepkörök
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Szerepkörök módosítása
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Műveletek
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const roles = user.roles ?? [];
              const isAdminRow = roles.includes("ADMIN"); // Admin felhasználó

              // 🔥 ADMIN-nál ne jelenjen meg ADMIN a selectben
              const roleOptionsForUser = isAdminRow
                ? AVAILABLE_ROLES.filter((r) => r !== "ADMIN")
                : AVAILABLE_ROLES;

              return (
                <tr key={user.username}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {user.name}
                  </td>

                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {user.username}
                  </td>

                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {roles.length === 0 ? "Nincs szerepkör" : roles.join(", ")}
                  </td>

                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    <select
                      multiple
                      value={roles}
                      onChange={(e) => handleRolesSelectChange(e, user.username)}
                      disabled={isAdminRow} // Admin tilos
                      style={{
                        width: "100%",
                        minHeight: "70px",
                        padding: "4px",
                        backgroundColor: isAdminRow ? "#f3f4f6" : "white",
                        cursor: isAdminRow ? "not-allowed" : "pointer",
                      }}
                    >
                      {roleOptionsForUser.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>

                    {isAdminRow && (
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Az ADMIN szerepkör nem módosítható.
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    <button
                      onClick={() => handleSaveRoles(user)}
                      disabled={savingUser === user.username || isAdminRow}
                      style={{
                        background: isAdminRow ? "#cbd5e1" : "#3182ce",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: isAdminRow ? "not-allowed" : "pointer",
                        marginRight: "8px",
                        fontSize: "14px",
                      }}
                    >
                      {savingUser === user.username ? "Mentés..." : "Mentés"}
                    </button>

                    <button
                      onClick={() => handleDelete(user)}
                      disabled={deletingUser === user.username || isAdminRow}
                      style={{
                        background: isAdminRow ? "#cbd5e1" : "#e53e3e",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: isAdminRow ? "not-allowed" : "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {deletingUser === user.username ? "Törlés..." : "Törlés"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;
