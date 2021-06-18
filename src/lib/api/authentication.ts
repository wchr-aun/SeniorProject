import type { IUserReponse } from './api.model';
import { requestService } from './requestService';

export function apiGetAuthentication(): Promise<IUserReponse> {
	return requestService<IUserReponse>('GET', `${import.meta.env.VITE_API_URL}/api/auth`);
}

export function apiPostAuthentication(
	fullname: string,
	phonenumber: string,
	photourl: string
): Promise<IUserReponse> {
	return requestService<IUserReponse>('POST', `${import.meta.env.VITE_API_URL}/api/auth`, null, {
		fullname,
		phonenumber,
		photourl
	});
}
