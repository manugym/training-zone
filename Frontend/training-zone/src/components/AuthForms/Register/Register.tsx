import React, { useState } from "react";
import "./Register.css";
import "../Form.css";
import defaultAvatar from "../../../assets/default-avatar-.jpg";
import AuthService from "../../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert";

function Register() {
  const navigate = useNavigate();
  const alertTimer = 3000;

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    // Validación del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Por favor, ingresa un correo electrónico válido.";
    }

    // Validación del teléfono (exactamente 9 dígitos)
    const phoneRegex = /^[0-9]{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return "El número de teléfono debe tener exactamente 9 dígitos.";
    }

    // Validación de la contraseña
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    // Confirmación de contraseña
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await AuthService.register(
        {
          name: name,
          phone: phone,
          email: email,
          password: password,
          image: image,
        },
        rememberMe
      );

      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        navigate("/");
      }, alertTimer);
    } catch (err: any) {
      setError(err.message || "Error desconocido al registrar.");
    }
  };

  return (
    <div className="register-container">
      <div className="profile-image-container">
        <label htmlFor="image" className="image-label">
          <img
            src={imagePreview || defaultAvatar}
            alt="profile"
            className="profile-image"
          />
          <span className="add-image-btn">+</span>
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            placeholder="Ej. Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Ej. juan@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            id="phone"
            placeholder="Ej. 123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="remember-me">
          <input
            onChange={handleCheckboxChange}
            type="checkbox"
            name="remember"
            id="remember"
          ></input>
          <label htmlFor="remember">Remember</label>
        </div>

        <button type="submit">Registrar</button>
      </form>

      {showAlert && (
        <Alert
          icon="success"
          text="Registro exitoso!"
          position="top-right"
          timer={alertTimer}
          navigatePath="/"
        />
      )}
    </div>
  );
}

export default Register;
