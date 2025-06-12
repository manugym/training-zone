import "./ToggleTheme.css";
import { FaRegMoon } from "react-icons/fa";
import { HiSun } from "react-icons/hi";
import { usePreferencesStore } from "../../store/preferences";

function ToggleTheme() {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  
  const isDarkMode = theme === "dark";

  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
    
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        checked={isDarkMode}
        onChange={toggleTheme}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <FaRegMoon className="icon moon" />
        <span className="toggle_ball" />
        <HiSun className="icon sun" />
      </label>
    </div>
  );
}

export default ToggleTheme;
