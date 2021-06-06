<script lang="ts">
	import Fa from 'svelte-fa/src/fa.svelte';
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

<div class="fixed z-10 inset-0 overflow-y-auto">
	<div
		class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
	>
		<div
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			aria-hidden="true"
			on:click={() => dispatch('clickBg')}
		/>
		<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true" />
		<div
			class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full {size}"
		>
			<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<div class="sm:flex sm:items-start">
					<div
						class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10
            {_colorToneMapping[colorTone].circle}"
					>
						<Fa class={_colorToneMapping[colorTone].icon} {icon} />
					</div>
					<div class="flex-grow mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
							{heading}
						</h3>
						<div class="mt-2">
							<span class="flex justify-center" style="transform: translateX(-2rem);">
								<slot />
							</span>
						</div>
					</div>
				</div>
			</div>
			{#if confirmBtn || cancelBtn}
				<div class="bg-gray-50 px-4 py-3 flex flex-row-reverse">
					<button
						type="button"
						class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
          	{_colorToneMapping[colorTone].button}"
						on:click={() => dispatch('confirm')}
					>
						{confirmBtn}
					</button>
					<button
						type="button"
						class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
						on:click={() => dispatch('cancel')}
					>
						{cancelBtn}
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
