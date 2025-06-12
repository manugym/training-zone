import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaUserEdit, FaUsersCog, } from "react-icons/fa";
import authService from "../../services/auth.service";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import "./UserDropdownMenu.css"

const UserDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useCurrentUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  }

  return (
    <div className="user-dropdown">
      <button className="user-dropdown-toggle" onClick={toggleDropdown}>
        <FaUserCircle />
        <span>{user.Name}</span>
        <span>▼</span>
      </button>
      {isOpen && (
        <div className="user-dropdown-menu">
          <Link to="/me" onClick={closeDropdown}><FaUserEdit /> Perfil</Link>
          {user.Role === "admin" && (
            <>
              <Link to="/users-admin" onClick={closeDropdown}><FaUsersCog /> Usuarios</Link>
              <Link to="/schedule-admin" onClick={closeDropdown}><FaUserEdit /> Panel Admin</Link>
            </>
          )}
          <button onClick={handleLogout}><FaSignOutAlt /> Cerrar sesión</button>
        </div>
      )}
    </div>
  );
};

export default UserDropdownMenu;