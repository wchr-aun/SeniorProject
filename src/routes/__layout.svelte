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
	import Sidepanel from '$lib/components/Navigation/Sidepanel/index.svelte';
	import Bottombar from '$lib/components/Navigation/Bottombar/index.svelte';
	import LoginModal from '$lib/components/Login/index.svelte';
	import Loading from '$lib/components/Loading/index.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import type { IPage } from '$lib/models';
	import { onMount } from 'svelte';

	let w: number;
	onMount(() => {
		w = window.innerWidth;
		window.onresize = () => (w = window.innerWidth);
	});

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
<div class="flex flex-col lg:flex-row justify-between h-screen">
	{#if w < 1024}
		<main class="bg-gray-100 px-10 py-10 flex-grow">
			<slot />
		</main>
		<div class="flex-none"><Bottombar {pages} /></div>
	{:else}
		<div class="fixed">
			<Sidepanel {pages} />
		</div>
		<div class="flex flex-grow pl-64 flex-col h-screen justify-between">
			<main class="bg-gray-100 px-10 py-10 flex-grow">
				<slot />
			</main>
			<Footer />
		</div>
	{/if}
</div>
