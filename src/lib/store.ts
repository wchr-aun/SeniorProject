import { writable } from 'svelte/store';

export const loginModalShown$ = writable<boolean>(false);
export function toggleLoginModal(): void {
	loginModalShown$.update((status) => !status);
}

export const isLogin$ = writable<boolean>(false);
export function setIsLogin(status: boolean): void {
	isLogin$.set(status);
}

export const authToken$ = writable<string>(null);
export function setAuthToken(token: string): void {
	authToken$.set(token);
}

export const userProfile$ = writable<{ displayName: string; photoUrl: string }>(null);
export function setUserProfile(displayName: string, photoUrl: string): void {
	userProfile$.set({ displayName, photoUrl });
}
