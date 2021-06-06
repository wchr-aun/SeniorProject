<script lang="ts" context="module">
	import Firebase from 'firebase';
	import '@firebase/auth';
	import Key from '../../firebase.json';

	if (!Firebase.apps.length) {
		Firebase.initializeApp(Key);
	} else {
		Firebase.app();
	}

	export const auth = Firebase.auth();
	export const provider = new Firebase.auth.GoogleAuthProvider();
</script>
