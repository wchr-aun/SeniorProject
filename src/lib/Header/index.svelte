<script lang="ts">
	import Modal from '$lib/Modal/index.svelte';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

	export let pages: {
		url: string;
		name: string;
	}[];
	export let defaultPage: string;

	let hideProfileMenu = true;
	let currentPage = defaultPage;
	let isLogin = false;
	let modalShown = false;
</script>

<nav class="bg-gray-600">
	<div class="mx-auto sm:px-6 lg:px-24">
		<div class="relative flex items-center justify-between h-16">
			<div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
				<div class="flex-shrink-0 flex items-center">
					<p class="text-white font-bold">Senior Project Extended</p>
				</div>
				<div class="hidden sm:block sm:ml-6">
					<div class="flex space-x-4">
						{#each pages as page}
							<a
								href={page.url}
								class={currentPage === page.name
									? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
									: 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'}
								on:click={() => (currentPage = page.name)}
								aria-current="page"
							>
								{page.name}
							</a>
						{/each}
					</div>
				</div>
			</div>
			{#if isLogin}
				<div
					class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
				>
					<div class="ml-3 relative">
						<div>
							<button
								on:click={() => (hideProfileMenu = !hideProfileMenu)}
								type="button"
								class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
								id="user-menu-button"
								aria-expanded="false"
								aria-haspopup="true"
							>
								<div class="h-8 w-8 rounded-full bg-white" />
							</button>
						</div>
						{#if !hideProfileMenu}
							<div
								class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu-button"
							>
								<a
									class="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									id="user-menu-item-0">
									Your Profile
								</a>
								<a
									class="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									id="user-menu-item-1">
									Settings
								</a>
								<a
									class="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									id="user-menu-item-2">
									Sign out
								</a>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<button
					class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
					on:click={() => (modalShown = !modalShown)}
				>
					Login
				</button>
				{#if modalShown}
					<Modal
						icon={faSignInAlt}
						heading="Login"
						confirmBtn="Login"
						cancelBtn="Cancel"
						size="max-w-3xl"
						on:confirm={() => (isLogin = true)}
						on:cancel={() => (modalShown = !modalShown)}
						on:clickBg={() => (modalShown = !modalShown)}
					>
						<p>// LOGIN STUFF HERE</p>
					</Modal>
				{/if}
			{/if}
		</div>
	</div>
</nav>
