import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Auth from "../pages/Auth/Auth";
import AllTrainers from "../pages/AllTrainers/AllTrainers";
import AllClasses from "../pages/AllClasses/AllClasses"; 
import Trainer from "../pages/Trainer/Trainer";
import Chat from "../pages/Chat/Chat";
import UsersAdmin from "../pages/UsersAdmin/UsersAdmin";
import ForbiddenPage from "../pages/Errors/ForbiddenPage";
import PageNotFound from "../pages/Errors/PageNotFound";
import ClassDetail from "../pages/ClassDetail/ClassDetail";
import UserView from "../pages/UserProfile/UserProfile";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/trainers" element={<AllTrainers />} />
      <Route path="/classes" element={<AllClasses />} />
      <Route path="/trainer/:id" element={<Trainer />} />
      <Route path="/class/:classId" element={<ClassDetail />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/users-admin" element={<UsersAdmin />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/me" element={<UserView />} />
      + <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoutes;
