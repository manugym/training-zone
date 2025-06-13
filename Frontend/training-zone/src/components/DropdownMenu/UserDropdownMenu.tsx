import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaUserEdit, FaUsersCog, } from "react-icons/fa";
import authService from "../../services/auth.service";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import "./UserDropdownMenu.css"
import { useTranslation } from "react-i18next";

const UserDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation("dropdown");

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
          <Link to="/me" onClick={closeDropdown}><FaUserEdit /> {t("profile")}</Link>
          {user.Role === "admin" && (
            <>
              <Link to="/users-admin" onClick={closeDropdown}><FaUsersCog /> {t("admin_users")}</Link>
              <Link to="/schedule-admin" onClick={closeDropdown}><FaUserEdit /> {t("admin_panel")}</Link>
            </>
          )}
          <button onClick={handleLogout}><FaSignOutAlt /> {t("logout")}</button>
        </div>
      )}
    </div>
  );
};

export default UserDropdownMenu;