import { writable } from 'svelte/store';

export const loginModalShown$ = writable<boolean>(false);
export function toggleLoginModal(): void {
	loginModalShown$.update((status) => !status);
}

export const isLogin$ = writable<boolean>(false);
export function setIsLogin(status: boolean): void {
	isLogin$.set(status);
}

export const userProfile$ =
	writable<{ displayName: string; phoneNumber: string; photoUrl: string }>(null);
export function setUserProfile(displayName: string, phoneNumber: string, photoUrl: string): void {
	userProfile$.set({ displayName, phoneNumber, photoUrl });
}

export const isLoading$ = writable<boolean>(false);
export function setIsLoading(v: boolean): void {
	isLoading$.set(v);
}
