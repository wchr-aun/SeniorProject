<script lang="ts">
	import Fa from '$lib/components/Fa/index.svelte';
	import { faSearch, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

	export let suggestionList: string[] = [];
</script>

<div class="inline-flex flex-col justify-center relative text-gray-500">
	<div class="relative">
		<input
			type="text"
			class="p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
			placeholder="Search"
		/>
		<Fa class="w-4 h-4 absolute left-2.5 top-3.5" icon={faSearch} />
	</div>
	<ul class="bg-white border border-gray-100 w-full mt-2">
		{#each suggestionList as suggest}
			<li
				class="pl-8 pr-2 py-1 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900"
			>
				<Fa class="absolute w-4 h-4 left-2 top-2" icon={faLongArrowAltRight} />
				{suggest}
			</li>
		{/each}
	</ul>
</div>
