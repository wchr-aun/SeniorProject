<script lang="ts">
	import type { IPage } from '$lib/models';
	import { onDestroy } from 'svelte';
	import { isLogin$, toggleLoginModal } from '$lib/store';
	import Fa from '$lib/components/Fa/index.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import { faCog, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

	export let pages: IPage[];

	let isLogin: boolean;
	const subscription = [];

	subscription.push(isLogin$.subscribe((status) => (isLogin = status)));

	onDestroy(() => subscription.forEach((unsub) => unsub()));
</script>

<section id="bottom-navigation" class="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
	<div id="tabs" class="flex justify-between">
		{#each pages as page}
			{#if !page.requireLogin || isLogin}
				<a
					href={page.url}
					class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
				>
					<Fa class="inline-block mb-1" icon={page.icon} />
					<span class="tab tab-home block text-xs">{page.name}</span>
				</a>
			{/if}
		{/each}
		{#if isLogin}
			<a
				href={ROUTES.SETTINGS}
				class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 cursor-pointer"
			>
				<Fa class="inline-block mb-1" icon={faCog} />
				<span class="tab tab-home block text-xs">Settings</span>
			</a>
		{:else}
			<span
				on:click={() => toggleLoginModal()}
				class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 cursor-pointer"
			>
				<Fa class="inline-block mb-1" icon={faSignInAlt} />
				<span class="tab tab-home block text-xs">Login</span>
			</span>
		{/if}
	</div>
</section>
