const TOKEN_KEY = 'token';
const BOOKING_IDS_KEY = 'bookingIds';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getBookingIds(): number[] {
  const raw = localStorage.getItem(BOOKING_IDS_KEY);
  return raw ? (JSON.parse(raw) as number[]) : [];
}

export function addBookingId(id: number): void {
  const ids = getBookingIds();
  if (!ids.includes(id)) {
    localStorage.setItem(BOOKING_IDS_KEY, JSON.stringify([...ids, id]));
  }
}

export function clearBookingIds(): void {
  localStorage.removeItem(BOOKING_IDS_KEY);
}
