import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAuthenticated } from '../auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const authed = isAuthenticated();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/search">Buscar vuelos</Link>
        {authed && <Link to="/my-bookings">Mis reservas</Link>}
      </div>
      <div className="navbar-auth">
        {authed ? (
          <>
            {user && <span className="navbar-user">Hola, {user.firstName ?? user.username}</span>}
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}
