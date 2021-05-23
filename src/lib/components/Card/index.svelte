<script lang="ts">
	export let tag: string;
	export let heading: string;
	export let content: string;
	export let aboveHeading = '';
	export let link = '';
</script>

<div class="px-10 my-4 py-6 rounded shadow-xl bg-white mx-auto">
	<div class="flex justify-between items-center">
		<span class="font-light text-gray-600">
			{#if aboveHeading}
				{aboveHeading}
			{/if}
		</span>
		<p class="px-2 py-1 bg-blue-600 text-gray-100 font-bold rounded">
			{tag}
		</p>
	</div>
	<div class="mt-2">
		<p class="text-2xl text-gray-700 font-bold hover:text-gray-600">
			{heading}
		</p>
		<p class="mt-2 text-gray-600">
			{content}
		</p>
	</div>
	<div class="flex justify-between items-center mt-4">
		{#if link}
			<a class="text-blue-600 hover:underline" href={link}>Visit</a>
		{/if}
	</div>
</div>
