import React, { useEffect, useState } from "react";
import "./UsersAdmin.css";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user.service";
import { User } from "../../models/user";
import NavBar from "../../components/NavBar/NavBar";
import Spinner from "../../components/Spinner/Spinner";

export default function UsersAdmin() {
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function getAllUsers() {
      try {
        const allUsers = await userService.getAllUsers();
        setAllUsers(allUsers);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    getAllUsers();
  }, []);

  return (
    <>
      <NavBar />

      <main className="view-container">
        <h1>Users Admin Page</h1>

        <div className=".content-container"></div>

        {loading && <Spinner />}
      </main>
    </>
  );
}
