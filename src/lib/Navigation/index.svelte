<script lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte';
	import ConfirmModal from '$lib/Modal/ConfirmModal/index.svelte';
	import { EModalSize } from '$lib/Modal/model';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
	import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

	export let pages: {
		icon?: IconDefinition;
		url: string;
		name: string;
	}[];

	let currentPage = pages[0]?.name;
	let projectName = 'Senior Project';
	let isLogin = false;
	let modalShown = false;
</script>

<div class="min-h-screen bg-white">
	<nav class="h-screen flex flex-col w-64 bg-gray-50">
		<div class="p-4 text-xl self-center">{projectName}</div>
		<ul class="p-2 space-y-2 flex-1 overflow-auto" style="scrollbar-width: thin;">
			{#each pages as page}
				<li>
					<Fa icon={page.icon} />
					<a
						href={page.url}
						class="flex space-x-2 items-center text-gray-600 p-2 rounded-lg {currentPage ===
						page.name
							? 'bg-gray-200'
							: 'hover:text-gray-900 hover:bg-gray-200'}"
						on:click={() => (currentPage = page.name)}
					>
						<span class="text-gray-900">{page.name}</span>
					</a>
				</li>
			{/each}
		</ul>

		<div class="p-2 flex items-center border-t-2 border-gray-300 space-x-4">
			{#if isLogin}
				<div class="relative inline-flex">
					<span
						class="inline-flex bg-green-500 w-2 h-2 absolute right-0 bottom-0 rounded-full ring-2 ring-white transform translate-x-1/3 translate-y-1/3"
					/>
					<img class="w-8 h-8 object-cover rounded-full" src="" />
				</div>
				<div>
					<h3 class="font-semibold tracking-wide text-gray-800">Name Surname</h3>
					<p class="text-sm text-gray-700">View Profile</p>
				</div>
			{:else}
				<button
					class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded"
					on:click={() => (modalShown = !modalShown)}
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

{#if modalShown}
	<ConfirmModal
		icon={faSignInAlt}
		heading="Login"
		confirmBtn="Login"
		cancelBtn="Cancel"
		size={EModalSize.XL3}
		on:confirm={() => (isLogin = true)}
		on:cancel={() => (modalShown = !modalShown)}
		on:clickBg={() => (modalShown = !modalShown)}
	>
		<p>// LOGIN STUFF HERE</p>
	</ConfirmModal>
{/if}
