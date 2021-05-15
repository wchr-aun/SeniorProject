<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import Footer from '$lib/Footer/index.svelte';
	import '../app.postcss';
</script>

<div class="flex flex-col h-screen justify-between">
	<Header />
	<main class="mb-auto h-10 px-40 py-10"><slot /></main>
	<Footer />
</div>
