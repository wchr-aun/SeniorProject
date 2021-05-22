<script lang="ts">
	import Footer from '$lib/Footer/index.svelte';
	import Navigation from '$lib/Navigation/index.svelte';
	import '../app.postcss';

	const pages = [
		{ url: '/', name: 'Home' },
		{ url: '/search', name: 'Search' },
		{ url: '/discover', name: 'Discover' },
		{ url: '/analytics', name: 'Analytics' }
	];
</script>

<div class="flex">
	<div class="fixed min-w-max">
		<Navigation {pages} />
	</div>
	<div class="flex flex-grow pl-64 flex-col h-screen justify-between">
		<div>
			<main class="bg-gray-100 px-10 py-10 fit-screen">
				<slot />
			</main>
		</div>
		<Footer />
	</div>
</div>

<style>
	:global(body) {
		background-color: rgba(31, 41, 55, 1);
	}
	.fit-screen {
		min-height: 91.5vh;
	}
</style>
