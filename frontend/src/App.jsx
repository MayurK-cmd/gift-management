import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import GiftManager from "./pages/GiftManager";

function App() {
  return (
    <div>
    <ToastContainer position="top-right" /> 
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/:eventId" element={<GiftManager />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </div>
  );
}

export default App;
