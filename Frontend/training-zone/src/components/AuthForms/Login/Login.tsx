import React, { useState } from "react";
import "../Form.css";
import AuthService from "../../../services/auth.service";

function Login() {
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    try {
      await AuthService.login(
        {
          credential: credentials,
          password: password,
        },
        rememberMe
      );
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="credential"></label>
      <input
        type="text"
        id="credential"
        placeholder="Email or Phone"
        value={credentials}
        onChange={(e) => setCredentials(e.target.value)}
        required
      ></input>

      <label htmlFor="password"></label>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      ></input>

      <div className="remember-me">
        <input
          onChange={handleCheckboxChange}
          type="checkbox"
          name="remember"
          id="remember"
        ></input>
        <label htmlFor="remember">Remember</label>
      </div>

      {error && <span className="error">{error}</span>}

      <button>Login</button>
    </form>
  );
}

export default Login;
