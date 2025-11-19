

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBills, type BillRes, type AdminBillRes } from "../api/billsApi";
import "../styles/Bills.css";

const BillsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<BillRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedRolesRaw = localStorage.getItem("roles");
  let roles: string[] = [];
  try {
    roles = storedRolesRaw ? JSON.parse(storedRolesRaw) : [];
  } catch {
    roles = [];
  }

  const isUser = roles.includes("USER");
  const isAccountant = roles.includes("ACCOUNTANT");
  const isAdmin = roles.includes("ADMIN");
  const isAdminView = isAccountant || isAdmin; 

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllBills();
        setBills(data);
      } catch (err: any) {
        setError(err.message || "Nem sikerült lekérni a számlákat.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goToDetails = (id: number) => {
    navigate(`/bills/${id}`);
  };

  return (
    <div className="page-container">
      <h1>Számlák</h1>

      {error && <div className="page-alert page-alert--error">{error}</div>}

      {loading ? (
        <p>Számlák betöltése...</p>
      ) : bills.length === 0 ? (
        <p>Nincs megjeleníthető számla.</p>
      ) : (
        <div className="table-wrapper">
          <table className="bills-table">
            <thead>
              <tr>
                
                {isAdminView && <th>ID</th>}
                {isAdminView && <th>Felhasználó</th>}
                <th>Kibocsátás dátuma</th>
                <th>Fizetési határidő</th>
                <th>Megnevezés</th>
                <th>Összeg</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => {
                const isAdminBill =
                  (bill as AdminBillRes).username !== undefined;

                return (
                  <tr
                    key={bill.id}
                    className="clickable-row"
                    onClick={() => goToDetails(bill.id)}
                  >
                    
                    {isAdminView && <td>{bill.id}</td>}

                    {isAdminView && (
                      <td>
                        {isAdminBill ? (bill as AdminBillRes).username : "-"}
                      </td>
                    )}

                    <td>{bill.exhibitionDate}</td>
                    <td>{bill.dueDate}</td>
                    <td>{bill.name}</td>
                    <td>{bill.amount} Ft</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillsPage;
