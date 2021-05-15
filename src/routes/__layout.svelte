<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import Footer from '$lib/Footer/index.svelte';
	import '../app.postcss';

	const pages = [
		{ url: '/', name: 'Home' },
		{ url: '/search', name: 'Search' },
		{ url: '/discover', name: 'Discover' },
		{ url: '/analytics', name: 'Analytics' }
	];
</script>

<div class="flex flex-col h-screen justify-between">
	<Header {pages} defaultPage={pages[0].name} />
	<div class="px-24">
		<main class="bg-gray-100 px-16 py-10 fit-screen">
			<slot />
		</main>
	</div>
	<Footer />
</div>

<style>
	:global(body) {
		background-color: rgba(31, 41, 55, 1);
	}
	.fit-screen {
		min-height: 85vh;
	}
</style>
