import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Auth from "../pages/Auth/Auth";
import AllTrainers from "../pages/AllTrainers/AllTrainers";
import Trainer from "../pages/Trainer/Trainer";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/trainers" element={<AllTrainers />} />
      <Route path="/trainer/:id" element={<Trainer />} />
      + <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
}

export default AppRoutes;
