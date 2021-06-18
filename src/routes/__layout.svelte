<script context="module" lang="ts">
	import { authGuard } from '$lib/guards';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ page, fetch, session, context }: LoadInput): Promise<LoadOutput> {
		return await authGuard({ page, fetch, session, context });
	}
</script>

<script lang="ts">
	import '../app.postcss';
	import { faHome, faSearch, faGlobe, faChartLine } from '@fortawesome/free-solid-svg-icons';
	import GlobalErrorHandler from '$lib/components/ErrorHandler/index.svelte';
	import Footer from '$lib/components/Footer/index.svelte';
	import Navigation from '$lib/components/Navigation/index.svelte';
	import LoginModal from '$lib/components/Login/index.svelte';
	import Loading from '$lib/components/Loading/index.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import type { IPage } from '$lib/models';

	const pages: IPage[] = [
		{ icon: faHome, url: ROUTES.HOME, name: 'Home' },
		{ icon: faSearch, url: ROUTES.SEARCH, name: 'Search' },
		{ icon: faGlobe, url: ROUTES.DISCOVER, name: 'Discover' },
		{ icon: faChartLine, url: ROUTES.ANALYTICS, name: 'Analytics' }
	];
</script>

<LoginModal />
<GlobalErrorHandler />
<Loading />
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
