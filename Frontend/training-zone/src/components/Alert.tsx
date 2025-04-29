import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface AlertProps {
  icon: "success" | "error" | "warning" | "info" | "question";
  text: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  timer: number;
  showConfirmButton?: boolean;
  navigatePath: string;
}

const Alert: React.FC<AlertProps> = ({
  icon,
  text,
  position,
  timer,
  showConfirmButton = false,
  navigatePath = "/",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: icon,
      text: text,
      position: position,
      showConfirmButton: showConfirmButton,
      timer: timer,
      toast: true,
      animation: true,
    });
  }, [icon, text, position, timer, showConfirmButton, navigatePath, navigate]);

  return null; // No es necesario renderizar nada en el DOM
};

export default Alert;
