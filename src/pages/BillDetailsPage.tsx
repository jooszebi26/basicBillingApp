

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBillById, type BillRes, type AdminBillRes } from "../api/billsApi";
import "../styles/BillDetails.css";

const BillDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<BillRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedRolesRaw = localStorage.getItem("roles");
  let roles: string[] = [];
  try {
    roles = storedRolesRaw ? JSON.parse(storedRolesRaw) : [];
  } catch {
    roles = [];
  }

  const isAccountantOrAdmin =
    roles.includes("ACCOUNTANT") || roles.includes("ADMIN");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getBillById(Number(id));
        setBill(data);
      } catch (err: any) {
        setError(err.message || "Nem sikerült lekérni a számla részleteit.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const goBack = () => {
    navigate("/bills");
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Számla betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-alert page-alert--error">{error}</div>
        <button onClick={goBack} className="primary-button">
          Vissza a számlákhoz
        </button>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="page-container">
        <p>Nem található a számla.</p>
        <button onClick={goBack} className="primary-button">
          Vissza a számlákhoz
        </button>
      </div>
    );
  }

  const isAdminBill = (bill as AdminBillRes).username !== undefined;

return (
  <div className="bill-details-container">
    <div className="bill-details-header">

    
      {isAccountantOrAdmin ? (
        <h1 className="bill-details-title">Számla #{bill.id}</h1>
      ) : (
        <h1 className="bill-details-title">Számla részletek</h1>
      )}

      <p className="bill-details-subtitle">Részletek áttekintése</p>
    </div>

    <div className="bill-details-card">

      <div className="bill-details-grid">
        
        {isAccountantOrAdmin && isAdminBill && (
          <div className="bill-details-item">
            <span className="bill-details-label">Felhasználó</span>
            <span className="bill-details-value">
              {(bill as AdminBillRes).username}
            </span>
          </div>
        )}

        <div className="bill-details-item">
          <span className="bill-details-label">Kibocsátás dátuma</span>
          <span className="bill-details-value">{bill.exhibitionDate}</span>
        </div>

        <div className="bill-details-item">
          <span className="bill-details-label">Fizetési határidő</span>
          <span className="bill-details-value">{bill.dueDate}</span>
        </div>

        <div className="bill-details-item">
          <span className="bill-details-label">Megnevezés</span>
          <span className="bill-details-value">{bill.name}</span>
        </div>

        <div className="bill-details-item">
          <span className="bill-details-label">Összeg</span>
          <span className="bill-details-value">{bill.amount} Ft</span>
        </div>
      </div>

      
      <div className="bill-details-comment-section">
        <h3 className="bill-details-comment-title">Megjegyzés</h3>
        <p className="bill-details-comment">
          {bill.comment || "Nincs megjegyzés."}
        </p>
      </div>
    </div>

    <button onClick={goBack} className="bill-details-back">
      ← Vissza a számlákhoz
    </button>
  </div>
);

};

export default BillDetailsPage;
