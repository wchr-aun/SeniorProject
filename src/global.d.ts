/// <reference types="@sveltejs/kit" />

interface ImportMeta {
	env: {
		VITE_FIREBASE_API_KEY: string;
		VITE_FIREBASE_AUTH_DOMAIN: string;
		VITE_FIREBASE_PROJECT_ID: string;
		VITE_FIREBASE_APP_ID: string;
		VITE_API_URL: string;
	};
}
