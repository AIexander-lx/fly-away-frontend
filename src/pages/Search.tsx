import { useState, type FormEvent } from 'react';
import api, { getErrorMessage } from '../api';
import type { Flight, FlightSearchResponse } from '../types';
import { addBookingId, isAuthenticated } from '../auth';
import { useNavigate } from 'react-router-dom';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function Search() {
  const navigate = useNavigate();
  const [flightNumber, setFlightNumber] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [departureFrom, setDepartureFrom] = useState('');
  const [departureTo, setDepartureTo] = useState('');
  const [results, setResults] = useState<Flight[] | null>(null);
  const [searchError, setSearchError] = useState('');
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSearchError('');
    setBookingMessage(null);

    const params: Record<string, string> = {};
    if (flightNumber) params.flightNumber = flightNumber;
    if (airlineName) params.airlineName = airlineName;
    if (departureFrom) params.estDepartureTimeFrom = new Date(departureFrom).toISOString();
    if (departureTo) params.estDepartureTimeTo = new Date(departureTo).toISOString();

    try {
      const res = await api.get<FlightSearchResponse>('/flights/search', { params });
      setResults(res.data.items);
    } catch (error) {
      setSearchError(getErrorMessage(error, 'No se pudo realizar la búsqueda.'));
      setResults(null);
    }
  }

  async function handleBook(flightId: number) {
    setBookingMessage(null);

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.post<{ id: number }>('/flights/book', { flightId });
      addBookingId(res.data.id);
      setBookingId(res.data.id);
      setBookingMessage({ type: 'success', text: `¡Reserva exitosa! ID de reserva: ${res.data.id}` });
    } catch (error) {
      setBookingMessage({ type: 'error', text: getErrorMessage(error, 'No se pudo reservar el vuelo.') });
    }
  }

  return (
    <div className="page">
      <h1>Buscar vuelos</h1>
      <form onSubmit={handleSearch} className="form form-inline">
        <label>
          Número de vuelo
          <input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
        </label>
        <label>
          Aerolínea
          <input value={airlineName} onChange={(e) => setAirlineName(e.target.value)} />
        </label>
        <label>
          Salida desde
          <input type="datetime-local" value={departureFrom} onChange={(e) => setDepartureFrom(e.target.value)} />
        </label>
        <label>
          Salida hasta
          <input type="datetime-local" value={departureTo} onChange={(e) => setDepartureTo(e.target.value)} />
        </label>
        <button type="submit">Buscar</button>
      </form>

      {searchError && <p className="error">{searchError}</p>}
      {bookingMessage && (
        <p className={bookingMessage.type === 'success' ? 'success' : 'error'}>{bookingMessage.text}</p>
      )}
      {bookingId && (
        <p>
          <a href={`/bookings/${bookingId}`}>Ver detalle de la reserva #{bookingId}</a>
        </p>
      )}

      {results !== null && results.length === 0 && <p>No se encontraron vuelos con esos criterios.</p>}

      {results !== null && results.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Aerolínea</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Asientos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.flightNumber}</td>
                <td>{flight.airlineName}</td>
                <td>{formatDate(flight.estDepartureTime)}</td>
                <td>{formatDate(flight.estArrivalTime)}</td>
                <td>{flight.availableSeats}</td>
                <td>
                  <button onClick={() => handleBook(flight.id)}>Reservar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
