<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import Footer from '$lib/Footer/index.svelte';
	import '../app.postcss';
</script>

<div class="flex flex-col h-screen justify-between">
	<Header />
	<div class="px-24">
		<main class="bg-gray-200 px-16 py-10 fit-screen">
			<slot />
		</main>
	</div>
	<Footer />
</div>

<style>
	.fit-screen {
		min-height: 75vh;
	}
</style>
