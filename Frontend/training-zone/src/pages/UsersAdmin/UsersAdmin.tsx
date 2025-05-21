import React, { useEffect } from "react";
import "./UsersAdmin.css";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user.service";

export default function UsersAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCurrentUser() {
      await userService.loadCurrentUser();
      const currentUser = userService.getCurrentUser();

      if (!currentUser) {
        navigate("/auth", { state: { from: location.pathname } });
      }

      if (currentUser.Role !== "admin") navigate("/forbidden");
    }

    loadCurrentUser();
  }, []);

  return <div>UsersAdmin</div>;
}
