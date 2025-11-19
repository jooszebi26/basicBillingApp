
import React, { useEffect, useState } from "react";
import { getUserDetails } from "../api/userDetailsApi";
import "../styles/ProfilePage.css";

const ProfilePage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserDetails();
        setUserDetails(data);
      } catch (err) {
        setError("Nem sikerült lekérni a profil adatokat.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="profile-container">
      <h1 className="profile-title">Saját profil</h1>
      <p className="profile-subtitle">
        Itt láthatod a saját fiókod adatait és szerepköreidet.
      </p>

      {error && <div className="profile-alert profile-alert--error">{error}</div>}

      {loading ? (
        <p className="profile-loading">Adatok betöltése...</p>
      ) : (
        userDetails && (
          <section className="profile-card">
            <h2 className="profile-card-title">Fiók adatai</h2>

            <div className="profile-row">
              <span className="profile-label">Név:</span>
              <span className="profile-value">{userDetails.name}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Felhasználónév:</span>
              <span className="profile-value">{userDetails.username}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Szerepkör(ök):</span>
              <span className="profile-value">
                {Array.isArray(userDetails.role)
                  ? userDetails.role.join(", ")
                  : userDetails.role}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Utolsó belépés:</span>
              <span className="profile-value">
                {userDetails.lastLoginDate}
              </span>
            </div>
          </section>
        )
      )}
    </div>
  );
};

export default ProfilePage;