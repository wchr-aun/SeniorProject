<script lang="ts">
	import { apiPostAuthentication } from '$lib/api/authentication';
	import { setUserProfile, userProfile$ } from '$lib/store';
	import { onMount } from 'svelte';

	let ogName: string;
	let ogPhoneNo: string;
	let ogPhoto: string;
	let editableName: string;
	let editablePhoneNo: string;
	let editablePhoto: string;

	onMount(() => {
		userProfile$.subscribe((profile) => {
			ogName = profile?.displayName;
			ogPhoneNo = profile?.phoneNumber;
			ogPhoto = profile?.photoUrl;
			editableName = profile?.displayName;
			editablePhoneNo = profile?.phoneNumber;
			editablePhoto = profile?.photoUrl;
		});
	});

	async function changeUserProfile() {
		const response = await apiPostAuthentication(editableName, editablePhoneNo, editablePhoto);
		setUserProfile(response.fullname, response.phonenumber, response.photourl);
	}

	function resetValues() {
		editableName = ogName;
		editablePhoneNo = ogPhoneNo;
		editablePhoto = ogPhoto;
	}
</script>

<div class="text-4xl">Settings</div>
<input type="text" bind:value={editableName} />
<input type="text" bind:value={editablePhoneNo} />
<button
	on:click={() => changeUserProfile()}
	class="bg-blue-400 hover:bg-yellow-700 text-gray-100 font-bold py-2 px-4 rounded"
>
	Submit
</button>
<button
	on:click={() => resetValues()}
	class="bg-red-400 hover:bg-yellow-700 text-gray-100 font-bold py-2 px-4 rounded"
>
	Reset
</button>
