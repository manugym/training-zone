import ToggleTheme from "../ToggleTheme/ToggleTheme";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
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
