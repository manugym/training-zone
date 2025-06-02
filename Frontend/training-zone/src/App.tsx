import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/app-routes";
import { use, useEffect } from "react";
import apiService from "./services/api.service";
import userService from "./services/user.service";

function App() {
  useEffect(() => {
    const fetchUser = async () => {
      if (apiService.jwt) {
        try {
          await userService.loadCurrentUser();
        } catch (error) {
          console.error("Error loading current user:", error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
