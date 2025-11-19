

import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import LogoutButton from "./LogoutButton";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem("username") ?? "";
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

  const canCreateBills = isAccountant || isAdmin;
  const canSeeUsers = isAdmin;

  const goHome = () => {
    
    navigate("/profil");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    "navbar-link" + (isActive ? " navbar-link--active" : "");

  const preventIfDisabled = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    disabled: boolean
  ) => {
    if (disabled) {
      e.preventDefault();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-logo" onClick={goHome}>
          SzámlaApp
        </button>

        <nav className="navbar-links">
          <NavLink to="/profil" className={navClass}>
            Profil
          </NavLink>

          <NavLink to="/bills" className={navClass}>
            Számlák
          </NavLink>

          <NavLink
            to="/bills/create"
            className={({ isActive }) =>
              navClass({ isActive }) +
              (!canCreateBills ? " navbar-link--disabled" : "")
            }
            aria-disabled={!canCreateBills}
            onClick={(e) => preventIfDisabled(e, !canCreateBills)}
          >
            Új számla
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              navClass({ isActive }) +
              (!canSeeUsers ? " navbar-link--disabled" : "")
            }
            aria-disabled={!canSeeUsers}
            onClick={(e) => preventIfDisabled(e, !canSeeUsers)}
          >
            Felhasználók
          </NavLink>
        </nav>
      </div>

      <div className="navbar-right">
        {storedUsername && (
          <span className="navbar-user">Bejelentkezve: {storedUsername}</span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
};

export default Navbar;
