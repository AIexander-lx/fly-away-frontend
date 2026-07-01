import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import type { Booking, Flight } from '../types';
import { getBookingIds } from '../auth';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

interface BookingRow extends Booking {
  airlineName: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getBookingIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    Promise.allSettled(ids.map((id) => api.get<Booking>(`/flights/book/${id}`))).then(async (results) => {
      const loadedBookings: Booking[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') loadedBookings.push(result.value.data);
      }

      const withAirline = await Promise.all(
        loadedBookings.map(async (booking) => {
          try {
            const flight = await api.get<Flight>(`/flights/${booking.flightId}`);
            return { ...booking, airlineName: flight.data.airlineName };
          } catch {
            return { ...booking, airlineName: '—' };
          }
        })
      );

      setBookings(withAirline);
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
              <th>Aerolínea</th>
              <th>Salida</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.flightNumber}</td>
                <td>{booking.airlineName}</td>
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
