import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { auth } from '$lib/firebase';
import { setIsLoading } from '$lib/store';

export async function requestService<T>(
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	url: string,
	params?: Record<string, string | number | boolean>,
	body?: Record<string, string | number | boolean>
): Promise<T> {
	setIsLoading(true);

	const token = await auth.currentUser.getIdToken();
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const query = generateQuery(params);
	let response: T;
	try {
		response = await sendRequest(method, url, query, body, config).catch(async (e: AxiosError) => {
			if (!e.response || e.response.status !== 401) throw e;
			const token = await auth.currentUser.getIdToken(true);
			const config = { headers: { Authorization: `Bearer ${token}` } };
			return await sendRequest(method, url, query, body, config);
		});
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

async function sendRequest(
	method: string,
	url: string,
	query: string,
	body: Record<string, string | number | boolean>,
	config: AxiosRequestConfig
) {
	switch (method) {
		case 'GET':
			return (await axios.get(`${url}?${query}`, config)).data;
		case 'POST':
			return (await axios.post(url, body, config)).data;
		case 'PUT':
			return (await axios.put(url, body, config)).data;
		case 'PATCH':
			return (await axios.patch(url, body, config)).data;
		case 'DELETE':
			return (await axios.delete(`${url}?${query}`, config)).data;
		default:
			return null;
	}
}
