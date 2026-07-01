import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import type { Booking } from '../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Booking>(`/flights/book/${id}`)
      .then((res) => setBooking(res.data))
      .catch((err) => setError(getErrorMessage(err, 'No se pudo cargar la reserva.')));
  }, [id]);

  return (
    <div className="page">
      <h1>Detalle de reserva #{id}</h1>
      {error && <p className="error">{error}</p>}
      {booking && (
        <ul className="detail-list">
          <li>Vuelo: {booking.flightNumber}</li>
          <li>Fecha de reserva: {formatDate(booking.bookingDate)}</li>
          <li>Salida: {formatDate(booking.estDepartureTime)}</li>
          <li>Llegada: {formatDate(booking.estArrivalTime)}</li>
          <li>
            Pasajero: {booking.customerFirstName} {booking.customerLastName}
          </li>
        </ul>
      )}
      <Link to="/my-bookings">Volver a mis reservas</Link>
    </div>
  );
}
