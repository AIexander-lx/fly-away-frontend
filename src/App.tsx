import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Search from './pages/Search';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/search" replace />} />
      </Routes>
    </>
  );
}

export default App;
