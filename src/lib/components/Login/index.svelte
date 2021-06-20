<script lang="ts">
	import Fa from '$lib/components/Fa/index.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { EModalSize } from '$lib/components/Modal/model';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
	import { faGoogle } from '@fortawesome/free-brands-svg-icons';
	import {
		loginModalShown$,
		isLogin$,
		toggleLoginModal,
		setIsLogin,
		setUserProfile,
		setIsLoading
	} from '$lib/store';
	import LoginModal from '$lib/components/Modal/ConfirmModal/index.svelte';
	import { apiGetAuthentication, apiPostAuthentication } from '$lib/api/authentication';
	import { auth, provider } from '$lib/firebase';
	import { ROUTES } from '$lib/constants/routes';

	let modalShown: boolean;
	let loginModalShown: boolean;
	let isLogin: boolean;
	const subscription = [];

	subscription.push(isLogin$.subscribe((status) => (isLogin = status)));

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

		auth.onAuthStateChanged(async (user) => {
			if (!user || isLogin) return;

			setIsLoading(true);
			const response = await apiGetAuthentication();
			setIsLogin(true);
			setIsLoading(false);

			if (response.new) {
				await apiPostAuthentication(user.displayName, user.phoneNumber, user.photoURL);
				setUserProfile(user.displayName, user.phoneNumber, user.photoURL);
				goto(ROUTES.SETTINGS);
				return;
			}

			setUserProfile(response.fullname, response.phonenumber, response.photourl);
		});
	});

	onDestroy(() => {
		subscription.forEach((unsub) => unsub());
	});

	function handleLoginWithGoogle() {
		auth.signInWithPopup(provider);
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
