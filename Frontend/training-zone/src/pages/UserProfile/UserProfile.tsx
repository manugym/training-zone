import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import userService from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api.service";
import NavBar from "../../components/NavBar/NavBar";
import defaultAvatar from "../../assets/default-avatar-.jpg";
import "./UserProfile.css";
import authService from "../../services/auth.service";
import { useTranslation } from "react-i18next";

export default function EditUser() {
  const SERVER_IMAGE_URL = `${
    import.meta.env.VITE_SERVER_URL
  }/UserProfilePicture`;

  const navigate = useNavigate();
  const { t } = useTranslation("user");
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

      if (user.AvatarImageUrl)
        setImagePreview(`${SERVER_IMAGE_URL}/${user.AvatarImageUrl}`);
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
      userService.editUseData({
        name,
        email,
        phone,
        password,
        image,
      });

      Swal.fire({
        icon: "success",
        title: "Datos actualizados correctamente",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: "top-end",
      });

      if (password) {
        authService.logout();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Necesitas iniciar sesión de nuevo",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        navigate("/auth", { state: { from: location.pathname } });
      }
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
                placeholder={t("placeholder_name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder={t("placeholder_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder={t("placeholder_phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder={t("placeholder_new_password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder={t("placeholder_confirm_password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit">{t("update_button")}</button>
          </form>
        </div>
      </main>
    </>
  );
}
