<script lang="ts">
	import { onMount } from 'svelte';
	import { faExclamation } from '@fortawesome/free-solid-svg-icons';
	import { EModalColorTone } from '$lib/components/Modal/model';
	import ErrorModal from '$lib/components/Modal/DialogModal/index.svelte';

	let errorShown = false;
	// let errorHeader: string;
	let errorMsg: string;

	onMount(() => {
		window.onerror = (e) => {
			errorShown = true;
			errorMsg = e.toString();
		};

		window.onunhandledrejection = (e) => {
			errorShown = true;
			errorMsg = e.toString();
		};
	});
</script>

{#if errorShown}
	<ErrorModal
		icon={faExclamation}
		colorTone={EModalColorTone.RED}
		heading="Unhandled Error"
		confirmBtn="OK"
		on:confirm={() => (errorShown = !errorShown)}
	>
		<p>{errorMsg}</p>
	</ErrorModal>
{/if}
