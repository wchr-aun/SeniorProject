import { writable } from 'svelte/store';

export const loginModalShown$ = writable(false);
export function toggleLoginModal() {
	loginModalShown$.update((status) => !status);
}

export const isLogin$ = writable(false);
export function setIsLogin(status: boolean) {
	isLogin$.set(status);
}

export const userProfile$ = writable(null);
// export function setUserProfile() {
//   userProfile.set();
// }
