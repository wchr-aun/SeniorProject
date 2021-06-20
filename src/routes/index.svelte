<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import WarningModal from '$lib/components/Modal/DialogModal/index.svelte';
	import Card from '$lib/components/Card/index.svelte';
	import { EModalColorTone } from '$lib/components/Modal/model';
	import { faExclamation } from '@fortawesome/free-solid-svg-icons';

	let warningShown = false;
</script>

<svelte:head>
	<title>Senior Project Extended: Home</title>
</svelte:head>

<div class="container mx-auto">
	<Card heading="Heading Card" content="Content Card" tag="News" />

	<button
		on:click={() => (warningShown = !warningShown)}
		class="bg-yellow-400 hover:bg-yellow-700 text-gray-100 font-bold py-2 px-4 rounded"
	>
		Alert
	</button>
</div>

{#if warningShown}
	<WarningModal
		icon={faExclamation}
		colorTone={EModalColorTone.YELLOW}
		heading="Warning"
		confirmBtn="OK"
		on:confirm={() => (warningShown = !warningShown)}
	>
		<p>WARNING!!!</p>
	</WarningModal>
{/if}
