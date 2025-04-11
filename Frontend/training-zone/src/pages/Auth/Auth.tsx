import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import "./Auth.css";
import Register from "../../components/Register/Register";
import Login from "../../components/Login/Login";
import strongMan from "../../assets/strong-man.png";
import fatMan from "../../assets/fat-man.png";

function Auth() {
  const [formType, setFormType] = useState<"login" | "register">("login");

  const getFormText = () => {
    return formType === "login" ? "Login" : "Register";
  };

  return (
    <>
      <NavBar />

      <main className="auth-main">
        <div className="form-header">
          <h1>{getFormText()}</h1>
          <img
            src={formType === "login" ? strongMan : fatMan}
            alt={formType === "login" ? "Strong Man" : "Fat Man"}
          />
        </div>

        <div className="form-container">
          <div className="form-types">
            <h3
              className={formType === "login" ? "active" : ""}
              onClick={() => setFormType("login")}
            >
              Login
            </h3>
            <h3
              className={formType === "register" ? "active" : ""}
              onClick={() => setFormType("register")}
            >
              Register
            </h3>
          </div>

          {formType === "login" ? <Login /> : <Register />}
        </div>
      </main>
    </>
  );
}

export default Auth;
