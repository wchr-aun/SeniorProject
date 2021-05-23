<script lang="ts">
	import { onDestroy } from 'svelte';
	import { setIsLogin } from '$lib/store';
	import { EModalSize } from '$lib/components/Modal/model';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
	import { loginModalShown$, isLogin$, toggleLoginModal } from '$lib/store';
	import LoginModal from '$lib/components/Modal/ConfirmModal/index.svelte';

	let modalShown: boolean;
	let loginModalShown: boolean;
	let isLogin: boolean;

	const subscription = [];
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

	onDestroy(() => {
		subscription.forEach((unsub) => unsub());
	});
</script>

{#if modalShown}
	<LoginModal
		icon={faSignInAlt}
		heading="Login"
		confirmBtn="Login"
		cancelBtn="Cancel"
		size={EModalSize.XL3}
		on:confirm={() => {
			setIsLogin(true);
			toggleLoginModal();
		}}
		on:cancel={() => toggleLoginModal()}
		on:clickBg={() => toggleLoginModal()}
	>
		<p>// LOGIN STUFF HERE</p>
	</LoginModal>
{/if}
