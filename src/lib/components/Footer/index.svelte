<script>
	import Fa from '$lib/components/Fa/index.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<div class="h-16 bg-gray-200 px-6 text-gray-600 inline-grid justify-items-end">
	<div class="inline-flex space-x-2 self-center">
		<p>Senior Project Extended @ 2021</p>
		<span>|</span>
		<a
			class="inline-flex space-x-1"
			href="https://github.com/wchr-aun/SeniorProject"
			target="_blank"
		>
			<Fa class="mt-1" icon={faGithub} />
			<span>GitHub</span>
		</a>
	</div>
</div>
