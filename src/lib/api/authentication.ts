import axios from 'axios';

export function apiAuthentication(token: string) {
	return axios.get('http://localhost:8000/test', { headers: { Authorization: `Bearer ${token}` } });
}
