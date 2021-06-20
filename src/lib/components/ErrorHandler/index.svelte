<script lang="ts">
	import { onMount } from 'svelte';
	import { faExclamation } from '@fortawesome/free-solid-svg-icons';
	import { EModalColorTone } from '$lib/components/Modal/model';
	import ErrorModal from '$lib/components/Modal/DialogModal/index.svelte';
	import { setIsLoading } from '$lib/store';

	let errorShown = false;
	let errorHeader: string;
	let errorMsg: string;

	onMount(() => {
		window.onerror = (e) => {
			errorShown = true;
			errorHeader = 'Unhandled Error';
			errorMsg = e.toString();
			setIsLoading(false);
		};

		window.onunhandledrejection = async (e: PromiseRejectionEvent) => {
			errorShown = true;
			errorHeader = e.reason?.response?.data?.title || 'Unknown Error';
			errorMsg = e.reason?.response?.data?.msg || e.reason;
			setIsLoading(false);
		};
	});
</script>

{#if errorShown}
	<ErrorModal
		icon={faExclamation}
		colorTone={EModalColorTone.RED}
		heading={errorHeader}
		confirmBtn="OK"
		on:confirm={() => (errorShown = !errorShown)}
	>
		<p>{errorMsg}</p>
	</ErrorModal>
{/if}
