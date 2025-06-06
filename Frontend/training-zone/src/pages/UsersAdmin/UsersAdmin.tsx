import { useEffect, useState } from "react";
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

  async function handleRoleChange(id: number, role: string): Promise<void> {
    const user = allUsers?.find((user) => user.Id === id);

    if (!user && user.Role === role) return;

    const updatedUser = { ...user, Role: role };
    const updatedUsers = allUsers?.map((user) =>
      user.Id === id ? updatedUser : user
    );
    setAllUsers(updatedUsers || null);

    await userService.changeUserRole(id, role);
  }

  return (
    <>
      <NavBar />

      <main className="view-container">
        <h1>Users Admin Page</h1>

        <div className="table-container">
          {allUsers && allUsers.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.Id}>
                    <td>{user.Email}</td>
                    <td>
                      <select
                        className="select"
                        value={user.Role}
                        onChange={async (e) =>
                          await handleRoleChange(user.Id, e.target.value)
                        }
                      >
                        <option value="user">user</option>
                        <option value="trainer">trainer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay usuarios</p>
          )}
        </div>

        {loading && <Spinner />}
      </main>
    </>
  );
}
