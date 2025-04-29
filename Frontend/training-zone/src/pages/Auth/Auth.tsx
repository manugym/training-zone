import { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import "./Auth.css";
import Register from "../../components/AuthForms/Register/Register";
import Login from "../../components/AuthForms/Login/Login";
import strongMan from "../../assets/strong-man.png";
import fatMan from "../../assets/fat-man.png";

function Auth() {
  const [formType, setFormType] = useState<"login" | "register">("login");

  const getFormText = () => {
    if (formType === "login") {
      return (
        <div className="form-text">
          <h2>Welcome back! Please log in.</h2>
          <p>We are glad to see you again!</p>
        </div>
      );
    }

    return (
      <div className="form-text">
        <h2>Join us today!</h2>
        <p>Create an account to enjoy our services.</p>
      </div>
    );
  };

  return (
    <>
      <NavBar />

      <main className="auth-wrapper">
        <div className="auth-main">
          <div className="form-header">
            {getFormText()}
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
        </div>
      </main>
    </>
  );
}

export default Auth;
