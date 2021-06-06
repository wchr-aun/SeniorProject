import axios from 'axios';

export function apiAuthentication(token: string): void {
	axios.get(import.meta.env.VITE_API_URL, { headers: { Authorization: `Bearer ${token}` } });
}
