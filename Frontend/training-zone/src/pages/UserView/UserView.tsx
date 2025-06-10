import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import userService from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api.service";
import NavBar from "../../components/NavBar/NavBar";
import defaultAvatar from "../../assets/default-avatar-.jpg";
import "./UserView.css";

export default function EditUser() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiService.jwt) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Necesitas iniciar sesión para ver tu perfil",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      navigate("/auth", { state: { from: location.pathname } });
    }

    async function loadCurrentUser() {
      if (!userService.getCurrentUser()) await userService.loadCurrentUser();
    }

    loadCurrentUser();
  }, []);

  useEffect(() => {
    const subscription = userService.currentUser$.subscribe((user) => {
      setName(user.Name || "");
      setEmail(user.Email || "");
      setPhone(user.Phone || "");
      setImagePreview(user.AvatarImageUrl || defaultAvatar);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9}$/;

    if (!email || !emailRegex.test(email)) return "Correo inválido.";
    if (!phone || !phoneRegex.test(phone)) return "Teléfono inválido.";
    if (password && password.length < 6) return "Contraseña muy corta.";
    if (password && password !== confirmPassword)
      return "Las contraseñas no coinciden.";

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
      Swal.fire({
        icon: "success",
        title: "Datos actualizados correctamente",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: "top-end",
      });
    } catch (err: any) {
      setError(err.message || "Error al actualizar.");
    }
  };

  return (
    <>
      <NavBar />
      <main className="update-user-data-page">
        <div className="update-user-data-container">
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

          <form className="form register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Ej. juan@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Ej. 123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Nueva contraseña (opcional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit">Actualizar</button>
          </form>
        </div>
      </main>
    </>
  );
}
