import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import register from "../api/registerApi";
import "../styles/Auth.css";

const RegisterPage = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

            if (!name.trim()) {
      setError("Kérlek töltsd ki a neved!");
      return;
    }

    if (!username.trim()) {
      setError("Kérlek töltsd ki a felhasználónevet és a jelszót!");
      return;
    }

        if (!password.trim()) {
      setError("Kérlek töltsd ki a jelszót!");
      return;
    }

            if (!role.trim()) {
      setError("Kérlek válassz szerepkört!");
      return;
    }

    setIsLoading(true);

    const registerRes = await register(name, username, password, role);

    setIsLoading(false);

    if (registerRes) {
      navigate("/login");      // <--- SAJÁT REDIRECT
    } else {
      setError("Hibás regisztráció!");
    }
  };


  return (
  <div className="auth-container">
    <div className="auth-card">
      <h2 className="auth-title">Regisztráció</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Név</label>
          <input
            id="name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Felhasználónév</label>
          <input
            id="username"
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Jelszó</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Szerepkör</label>
          <select
            id="role"
            className="form-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Válassz szerepkört...</option>
            <option value="USER">Felhasználó</option>
            <option value="ACCOUNTANT">Könyvelő</option>
          </select>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? "Regisztrálás..." : "Regisztráció"}
        </button>
      </form>

      <button
        className="secondary-button"
        onClick={() => navigate("/login")}
      >
        Már van fiókod? Jelentkezz be!
      </button>
    </div>
  </div>
);
};

export default RegisterPage;