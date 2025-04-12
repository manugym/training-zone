import React, { useState } from "react";
import "../Form.css";

function Login() {
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  return (
    <form action="">
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

      {error && <span className="error">{error}</span>}

      <button>Login</button>
    </form>
  );
}

export default Login;
