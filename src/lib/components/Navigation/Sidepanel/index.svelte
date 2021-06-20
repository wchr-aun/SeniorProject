<script lang="ts">
	import Fa from '$lib/components/Fa/index.svelte';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
	import { onDestroy, onMount } from 'svelte';
	import { isLogin$, toggleLoginModal, userProfile$ } from '$lib/store';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';
	import { page } from '$app/stores';
	import type { IPage } from '$lib/models';

	export let pages: IPage[];

	let currentPage = '';
	let projectName = 'Senior Project';
	let isLogin: boolean;
	let displayName = '';
	let photoUrl = '';
	const subscription = [];

	onMount(() => {
		subscription.push(
			userProfile$.subscribe((userProfile) => {
				if (!userProfile) return;
				displayName =
					userProfile.displayName?.length > 20
						? `${userProfile.displayName.slice(0, 18)}...`
						: userProfile.displayName;
				photoUrl = userProfile.photoUrl;
			})
		);
	});

	subscription.push(page.subscribe((p) => (currentPage = p.path)));
	subscription.push(isLogin$.subscribe((status) => (isLogin = status)));

	onDestroy(() => subscription.forEach((unsub) => unsub()));
</script>

<div class="min-h-screen bg-white">
	<nav class="h-screen flex flex-col w-64 bg-gray-50">
		<div class="p-4 text-xl self-center">{projectName}</div>
		<ul class="p-2 space-y-2 flex-1 overflow-auto" style="scrollbar-width: thin;">
			{#each pages as page}
				{#if !page.requireLogin || isLogin}
					<li>
						<a
							href={page.url}
							class="flex space-x-2 items-center text-gray-600 p-2 rounded-lg {currentPage ===
							page.url
								? 'bg-gray-200'
								: 'hover:text-gray-900 hover:bg-gray-200'}"
							on:click={() => (currentPage = page.name)}
						>
							<Fa icon={page.icon} />
							<span class="text-gray-900">{page.name}</span>
						</a>
					</li>
				{/if}
			{/each}
		</ul>

		<div class="p-2 flex items-center border-t-2 border-gray-300 space-x-4">
			{#if isLogin}
				<div class="relative inline-flex">
					<span
						class="inline-flex bg-green-500 w-2 h-2 absolute right-0 bottom-0 rounded-full ring-2 ring-white transform translate-x-1/3 translate-y-1/3"
					/>
					<img class="w-8 h-8 object-cover rounded-full" src={photoUrl} alt="pfp" />
				</div>
				<div class="cursor-pointer" on:click={() => goto(ROUTES.SETTINGS)}>
					<h3 class="font-semibold tracking-wide text-gray-800">{displayName}</h3>
					<p class="text-sm text-gray-700">Edit Profile</p>
				</div>
			{:else}
				<button
					class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded"
					on:click={() => toggleLoginModal()}
				>
					<div class="inline-flex space-x-1">
						<Fa class="mt-1" icon={faSignInAlt} />
						<p>Login</p>
					</div>
				</button>
			{/if}
		</div>
	</nav>
</div>
