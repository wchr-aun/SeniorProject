<script lang="ts">
	import Fa from '$lib/components/Fa/index.svelte';
	import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
	import { createEventDispatcher } from 'svelte';
	import { _colorToneMapping, EModalColorTone, EModalSize } from '../model';

	export let icon: IconDefinition;
	export let heading: string;
	export let confirmBtn = '';
	export let cancelBtn = '';
	export let colorTone: EModalColorTone = EModalColorTone.GRAY;
	export let size: EModalSize = EModalSize.LG;

	const dispatch = createEventDispatcher();
</script>

<div
	class="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none"
	style="background: rgba(0,0,0,.2);"
	on:click={() => dispatch('clickBg')}
>
	<div class="w-full {size} p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
		<div class="">
			<div class="text-center flex-auto justify-center">
				<div
					class="mx-auto flex items-center justify-center h-12 w-12 rounded-full
					{_colorToneMapping[colorTone].circle}"
				>
					<Fa class={_colorToneMapping[colorTone].icon} {icon} size="2x" />
				</div>
				<h2 class="text-xl font-bold py-4 ">{heading}</h2>
				<p class="text-sm text-gray-500 px-8">
					<slot />
				</p>
			</div>
			{#if confirmBtn || cancelBtn}
				<div class="pt-5 text-center space-x-4 md:block">
					<button
						class="mb-2 md:mb-0 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg
          	{_colorToneMapping[colorTone].button}"
						on:click={() => dispatch('confirm')}
					>
						{confirmBtn}
					</button>
					<button
						class="mb-2 md:mb-0 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg"
						on:click={() => dispatch('cancel')}
					>
						{cancelBtn}
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
