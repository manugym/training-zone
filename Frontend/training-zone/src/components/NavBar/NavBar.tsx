import { FaDumbbell } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import ToggleTheme from "../ToggleTheme/ToggleTheme";
import "./NavBar.css";
import UserDropdownMenu from "../DropdownMenu/UserDropdownMenu";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
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
        <ToggleTheme />
        <LanguageSwitcher />
        <UserDropdownMenu />
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
