import Firebase from 'firebase';
import '@firebase/auth';

if (!Firebase.apps.length) {
	Firebase.initializeApp({
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'FIREBASE_API_KEY',
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'FIREBASE_AUTH_DOMAIN',
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'FIREBASE_PROJECT_ID',
		appId: import.meta.env.VITE_FIREBASE_APP_ID || 'FIREBASE_APP_ID'
	});
} else {
	Firebase.app();
}

export const auth = Firebase.auth();
export const provider = new Firebase.auth.GoogleAuthProvider();