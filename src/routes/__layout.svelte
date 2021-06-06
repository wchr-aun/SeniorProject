<script lang="ts">
	import '../app.postcss';
	import { faHome, faSearch, faGlobe, faChartLine } from '@fortawesome/free-solid-svg-icons';
	import GlobalErrorHandler from '$lib/errorHandler.module.svelte';
	import Footer from '$lib/components/Footer/index.svelte';
	import Navigation from '$lib/components/Navigation/index.svelte';
	import LoginModal from '$lib/login.module.svelte';

	const pages = [
		{ icon: faHome, url: '/', name: 'Home' },
		{ icon: faSearch, url: '/search', name: 'Search' },
		{ icon: faGlobe, url: '/discover', name: 'Discover' },
		{ icon: faChartLine, url: '/analytics', name: 'Analytics' }
	];
</script>

<LoginModal />
<GlobalErrorHandler />
<div class="flex static">
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
		min-height: calc(100vh - 4rem);
	}
</style>
