import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/app-routes";
import { useEffect } from "react";
import apiService from "./services/api.service";
import userService from "./services/user.service";
import { usePreferencesStore } from "./store/preferences";
import { useUserStore } from "./store/userStore";

function App() {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (apiService.jwt) {
        try {
          const user = await userService.getAuthenticatedUser();
          if(user) {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error loading current user:", error);
        }
      }
    };

    fetchUser();
  }, []);

  const theme = usePreferencesStore((state) => state.theme);

  useEffect(()=> {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
