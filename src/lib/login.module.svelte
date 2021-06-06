<script lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { EModalSize } from '$lib/components/Modal/model';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
	import { faGoogle } from '@fortawesome/free-brands-svg-icons';
	import {
		loginModalShown$,
		isLogin$,
		toggleLoginModal,
		setIsLogin,
		setAuthToken,
		setUserProfile
	} from '$lib/store';
	import LoginModal from '$lib/components/Modal/ConfirmModal/index.svelte';
	import { apiAuthentication } from '$lib/api/authentication';
	import { auth, provider } from '$lib/firebase.module.svelte';

	let modalShown: boolean;
	let loginModalShown: boolean;
	let isLogin: boolean;

	const subscription = [];

	onMount(() => {
		subscription.push(
			isLogin$.subscribe((status) => {
				modalShown = !status && loginModalShown;
			})
		);
		subscription.push(
			loginModalShown$.subscribe((status) => {
				modalShown = status && !isLogin;
			})
		);
	});

	onDestroy(() => {
		subscription.forEach((unsub) => unsub());
	});

	async function handleLoginWithGoogle() {
		const result = await auth.signInWithPopup(provider);
		if (!result) return;
		await apiAuthentication(result.user['za']);
		console.log(result);
		setAuthToken(result.user['za']);
		setUserProfile(result.user.displayName, result.user.photoURL);
		setIsLogin(true);
		toggleLoginModal();
	}
</script>

{#if modalShown}
	<LoginModal
		icon={faSignInAlt}
		heading="Login"
		size={EModalSize.LG}
		on:clickBg={() => toggleLoginModal()}
	>
		<button
			class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded"
			on:click={() => handleLoginWithGoogle()}
		>
			<div class="inline-flex space-x-2">
				<p>Login With</p>
				<Fa class="mt-1" icon={faGoogle} />
			</div>
		</button>
	</LoginModal>
{/if}
