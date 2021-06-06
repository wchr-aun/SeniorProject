<script lang="ts" context="module">
	import Firebase from 'firebase';
	import '@firebase/auth';

	if (!Firebase.apps.length) {
		Firebase.initializeApp({
			apiKey: import.meta.env.VITE_API_KEY,
			authDomain: import.meta.env.VITE_AUTH_DOMAIN,
			projectId: import.meta.env.VITE_PROJECT_ID,
			appId: import.meta.env.VITE_APP_ID
		});
	} else {
		Firebase.app();
	}

	export const auth = Firebase.auth();
	export const provider = new Firebase.auth.GoogleAuthProvider();
</script>
