import { FaDumbbell } from "react-icons/fa";
import ToggleTheme from "../ToggleTheme/ToggleTheme";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-icon">
        <a href="/" className="nav-logo">
          <FaDumbbell className="icon" />
        </a>
      </div>

      <div className="nav-links">
        <a href="#home">Entrenadores</a>
        <a href="#services">Clases</a>
        <a href="#contact">Chat</a>
      </div>
      <ToggleTheme />
    </nav>
  );
}

export default NavBar;
