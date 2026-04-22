import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movie";
import Booking from "./pages/Booking";
import Navbar from "../src/components/Navbar";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/movies" element={<Movies />} />
  <Route path="/booking/:movieId" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;