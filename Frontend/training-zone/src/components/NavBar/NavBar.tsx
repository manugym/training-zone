import { FaDumbbell } from "react-icons/fa";
import ToggleTheme from "../ToggleTheme/ToggleTheme";
import "./NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-icon">
        <Link to="/" className="nav-logo">
          <FaDumbbell className="icon" />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/trainers">Entrenadores</Link>
        <Link to="/classes">Clases</Link>
        <Link to="/chat">Chat</Link>
      </div>
      <ToggleTheme />
    </nav>
  );
}

export default NavBar;
