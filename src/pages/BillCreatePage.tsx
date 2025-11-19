

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBill } from "../api/billsApi";
import "../styles/BillCreate.css";

const BillCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // Szerepkörök lekérése
  const raw = localStorage.getItem("roles");
  let roles: string[] = [];
  try {
    roles = raw ? JSON.parse(raw) : [];
  } catch {
    roles = [];
  }

  const isAccountantOrAdmin =
    roles.includes("ACCOUNTANT") || roles.includes("ADMIN");

  const [username, setUsername] = useState("");
  const [exhibitionDate, setExhibitionDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  if (!isAccountantOrAdmin) {
    return (
      <div className="page-container bill-create-page">
        <div className="page-header">
          <h1 className="page-title">Új számla</h1>
          <p className="page-subtitle">
            Csak könyvelő vagy admin hozhat létre új számlát.
          </p>
        </div>

        <div className="page-alert page-alert--error">
          Nincs jogosultságod számla létrehozásához.
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/bills")}
        >
          Vissza a számlákhoz
        </button>
      </div>
    );
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Kérlek adj meg egy felhasználónevet!");
      return;
    }

    if (!exhibitionDate || !dueDate || !name.trim() || amount === "") {
      setError("Kérlek tölts ki minden kötelező mezőt!");
      return;
    }

    try {
      setIsLoading(true);

      await createBill({
        username: username.trim(),
        exhibitionDate,
        dueDate,
        name: name.trim(),
        comment: comment.trim(),
        amount: Number(amount),
      });

      navigate("/bills");
    } catch (err: any) {
      setError(err.message || "Nem sikerült létrehozni a számlát.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container bill-create-page">
      <div className="page-header">
        <h1 className="page-title">Új számla létrehozása</h1>
        <p className="page-subtitle">
          Add meg a számla adatait, és rendeld egy felhasználóhoz.
        </p>
      </div>

      {error && <div className="page-alert page-alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card bill-create-form">
        
        <div className="form-row">
          <label htmlFor="username" className="form-label">
            Felhasználónév*
          </label>
          <input
            id="username"
            type="text"
            className="form-input"
            placeholder="pl: jancsika99"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-row form-row--inline">
          <div className="form-field">
            <label className="form-label">Kibocsátás dátuma*</label>
            <input
              type="date"
              className="form-input"
              value={exhibitionDate}
              onChange={(e) => setExhibitionDate(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Határidő*</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Megnevezés*</label>
          <input
            type="text"
            className="form-input"
            placeholder="Szolgáltatás neve"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Megjegyzés</label>
          <textarea
            className="form-textarea"
            placeholder="Opcionális megjegyzés"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Összeg (Ft)*</label>
          <input
            type="number"
            min={1}
            className="form-input"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/bills")}
          >
            Mégse
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={isLoading}
          >
            {isLoading ? "Mentés..." : "Számla létrehozása"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillCreatePage;