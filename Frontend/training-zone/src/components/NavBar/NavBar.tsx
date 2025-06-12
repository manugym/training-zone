import { FaDumbbell } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import ToggleTheme from "../ToggleTheme/ToggleTheme";
import "./NavBar.css";
import { useUserStore } from "../../store/userStore";

function NavBar() {
  
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
  const user = useUserStore((state) => state.currentUser);
  return (
    <nav className="navbar">
      <div className="nav-icon">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <FaDumbbell className="icon" />
        </Link>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/trainers" onClick={closeMenu}>Entrenadores</Link>
        <Link to="/classes" onClick={closeMenu}>Clases</Link>
        <Link to="/chat" onClick={closeMenu}>Chat</Link>
      </div>

      <div className="navbar-right">
        {user && <span className="user-name">¡Bienvenido, {user.Name}!</span>}
        {user?.AvatarImageUrl && (
        <img src={user.AvatarImageUrl} alt="Avatar" className="user-avatar" />)}
        <ToggleTheme />
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
