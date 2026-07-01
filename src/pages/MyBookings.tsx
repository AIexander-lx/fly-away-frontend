import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import type { Booking } from '../types';
import { getBookingIds } from '../auth';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getBookingIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    Promise.allSettled(ids.map((id) => api.get<Booking>(`/flights/book/${id}`))).then((results) => {
      const loaded: Booking[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') loaded.push(result.value.data);
      }
      setBookings(loaded);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page">
      <h1>Mis reservas</h1>
      {loading && <p>Cargando...</p>}
      {!loading && bookings.length === 0 && <p>Todavía no tienes reservas. Ve a buscar un vuelo.</p>}
      {!loading && bookings.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Salida</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.flightNumber}</td>
                <td>{formatDate(booking.estDepartureTime)}</td>
                <td>
                  <Link to={`/bookings/${booking.id}`}>Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
