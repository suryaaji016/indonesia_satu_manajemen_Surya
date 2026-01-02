import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AddApplication from "../pages/AddAplication";
import UpdateApplication from "../pages/UpdateAplication";
import ScoringForm from "../pages/ScoringForm";
import Navbar from "../components/Navbar";

function AuthLayout() {
  let access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-application" element={<AddApplication />} />
          <Route
            path="/update-application/:id"
            element={<UpdateApplication />}
          />
          <Route path="/scoring/:id" element={<ScoringForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
