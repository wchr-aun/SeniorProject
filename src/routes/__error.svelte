<script>
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';
</script>

<div class="grid justify-items-center">
	<div class="text-4xl font-medium pb-8">Page Not Found</div>
	<button
		on:click={() => {
			goto(ROUTES.HOME);
		}}
		class="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded"
	>
		Back to Home
	</button>
</div>
