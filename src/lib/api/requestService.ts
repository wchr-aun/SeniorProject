import axios from 'axios';
import { auth } from '$lib/firebase';
import { setIsLoading } from '$lib/store';

export async function requestService<T>(
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	url: string,
	params?: Record<string, string | number | boolean>,
	body?: Record<string, string | number | boolean>
): Promise<T> {
	setIsLoading(true);

	const token = await auth.currentUser.getIdToken(true);
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const query = generateQuery(params);
	let response: T;
	try {
		switch (method) {
			case 'GET':
				response = (await axios.get(`${url}?${query}`, config)).data;
				break;
			case 'POST':
				response = (await axios.post(url, body, config)).data;
				break;
			case 'PUT':
				response = (await axios.put(url, body, config)).data;
				break;
			case 'PATCH':
				response = await (await axios.patch(url, body, config)).data;
				break;
			case 'DELETE':
				response = await (await axios.delete(`${url}?${query}`, config)).data;
				break;
			default:
				break;
		}
		setIsLoading(false);
		return response;
	} catch (err) {
		setIsLoading(false);
		throw err;
	}
}

function generateQuery(params: Record<string, string | number | boolean>) {
	if (params) return '';
	let query = '';
	for (const key in params) {
		if (!key) continue;
		if (query != '') query += '&';
		query += key + '=' + encodeURIComponent(params[key]);
	}
	return query;
}
