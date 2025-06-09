import React, { useEffect, useState } from "react";
import "./ToggleTheme.css";
import { FaRegMoon } from "react-icons/fa";
import { HiSun } from "react-icons/hi";

function ToggleTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if the user has a stored theme preference or system preference
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // If the user has a stored theme preference, use that
    // Otherwise, use the system preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || (storedTheme === null && prefersDark)) {
      setIsDarkMode(true);
      document.body.setAttribute("data-theme", "dark");
    } else {
      setIsDarkMode(false);
      document.body.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setIsDarkMode(e.target.checked);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // Save the user's preference in local storage
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
