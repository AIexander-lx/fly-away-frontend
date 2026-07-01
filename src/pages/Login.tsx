import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    if (!email || !password) {
      setFieldError('Email y contraseña son obligatorios.');
      return;
    }
    setFieldError('');
    setSubmitting(true);

    try {
      const res = await api.post<{ token: string }>('/auth/login', { email, password });
      await loginWithToken(res.data.token);
      navigate('/search');
    } catch (error) {
      setServerError(getErrorMessage(error, 'Credenciales incorrectas.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {fieldError && <p className="error">{fieldError}</p>}
        {serverError && <p className="error">{serverError}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}
