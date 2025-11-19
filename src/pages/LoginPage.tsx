

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import login, { type LoginError } from "../api/loginApi";
import "../styles/Auth.css";

const SITE_KEY = "6LdTHBEsAAAAAJG75SmN4UWThk-2qsVNlvVCmSiU"; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaToken(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Kérlek töltsd ki a felhasználónevet és a jelszót!");
      return;
    }

    
    if (showCaptcha && !captchaToken) {
      setError("Kérlek igazold, hogy nem vagy robot!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(username, password, showCaptcha ? captchaToken : null);

      
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", res.username);
      localStorage.setItem("roles", JSON.stringify(res.roles));

      navigate("/profil");
    } catch (err) {
      const loginErr = err as LoginError;

      
      if (
        loginErr.captchaRequired ||
        (loginErr.message &&
          loginErr.message.toLowerCase().includes("captcha"))
      ) {
        setShowCaptcha(true);
        setCaptchaToken(null); 
      }

      setError(
        loginErr.message || "Hiba történt a bejelentkezés során."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Belépés</h2>

        <form onSubmit={handleSubmit} className="auth-form">
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
              autoComplete="current-password"
            />
          </div>

         
          {showCaptcha && (
            <div className="form-group">
              <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptchaChange} />
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? "Beléptetés..." : "Belépés"}
          </button>
        </form>

        <button
          className="secondary-button"
          onClick={() => navigate("/register")}
        >
          Regisztráció
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
