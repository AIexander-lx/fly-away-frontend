import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '' });
  const [fieldError, setFieldError] = useState('');
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!form.email || !form.firstName || !form.lastName || !form.password) {
      setFieldError('Todos los campos son obligatorios.');
      return;
    }
    setFieldError('');
    setSubmitting(true);

    try {
      await api.post('/users/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo completar el registro.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </label>
        <label>
          Nombre
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </label>
        <label>
          Apellido
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </label>

        {fieldError && <p className="error">{fieldError}</p>}
        {serverError && <p className="error">{serverError}</p>}
        {success && <p className="success">¡Registro exitoso! Redirigiendo al login...</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
