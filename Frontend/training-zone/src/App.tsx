import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Main from "./pages/Home/Home";
import AppRoutes from "./routes/app-routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
