import axios from 'axios';

export function apiAuthentication(token: string): void {
	axios.post(`${import.meta.env.VITE_API_URL}/api/auth`, {
		headers: { Authorization: `Bearer ${token}` }
	});
}
