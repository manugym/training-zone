import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/app-routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
