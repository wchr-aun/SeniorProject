<script>
	export let name;
	export let score;
	export let address;
	export let imageUrl;
</script>

<div class="rounded-md shadow-xl mx-auto w-72 h-40 p-4 flex">
	<div class="w-1/3">
		<div>
			<img class="object-cover rounded" src={imageUrl} alt="" />
		</div>

		<div class="flex justify-center">
			<span class="p-4 font-bold text-green-500">Favourite </span>
		</div>
	</div>

	<div class="w-2/3 p-10">
		<p class="font-bold text-sm">{name}</p>
		<p class="font-bold">คะแนนรีวิว: {score}</p>
		<p class="text-gray-500 text-sm">{address}</p>
	</div>
</div>
