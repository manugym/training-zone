import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SectionLogReg.css";
import logoDark from "../../assets/home-logo-dark.svg";
import logoLight from "../../assets/home-logo-light.svg";

const SectionLogReg: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const currentTheme = document.body.getAttribute("data-theme");
    setIsDarkTheme(currentTheme === "dark");

    const observer = new MutationObserver(() => {
      const updatedTheme = document.body.getAttribute("data-theme");
      setIsDarkTheme(updatedTheme === "dark");
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="section-one" className="home-section-one">
      <div className="section-one-content">
        <div className="logo-wrapper">
          <div className="logo">
            <img
              src={isDarkTheme ? logoDark : logoLight}
              alt="image"
              className="home-logo"
            />
          </div>
        </div>
        <div className="auth-buttons">
          <button className="login-button" onClick={() => navigate("/auth")}>
            Inicia Sesión{" "}
          </button>
          <button className="register-button" onClick={() => navigate("/auth")}>
            Regístrate
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionLogReg;
