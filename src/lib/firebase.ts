import * as Firebase from '@firebase/app';
import '@firebase/auth';

if (!Firebase.firebase.apps.length) {
	Firebase.firebase.initializeApp({
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
		appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string
	});
} else {
	Firebase.firebase.app();
}

export const auth = Firebase.firebase.auth();
export const provider = new Firebase.firebase.auth.GoogleAuthProvider();
