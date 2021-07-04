<script lang="ts">
	import Searchbox from '$lib/components/Searchbox/index.svelte';
	import BuyerCard from '$lib/components/Card/BuyerCard.svelte';

	const mockedBuyerData = [
		{
			name: 'Narawit Tubtimtoe',
			score: 4,
			address: 'ที่อยู่ใหม่: 58/8 ต.มาบแค อ.เมืองนครปฐม จังหวัดนครปฐม 74289',
			imageUrl:
				'https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.6435-9/95798099_2686194104993456_2140764248974819328_n.jpg?_nc_cat=100&ccb=1-3&_nc_sid=174925&_nc_eui2=AeHat9gsiLXxsTeToBUNMcpbG0rUzjnUZP0bStTOOdRk_ecXbSQSdtwbr71Umkr5dJRQnCIhlEhNQTt0nZHqA5Q1&_nc_ohc=PJ6BhaBlSOgAX9m0MUS&_nc_ht=scontent.fbkk17-1.fna&oh=db7ce4b1e9e50385ce300a052cadecef&oe=60E46957'
		},
		{
			name: 'Chayut Tubtimtoe',
			score: 5,
			address: 'ที่อยู่: 58/8 ต.มาบแค อ.เมืองนครปฐม จังหวัดนครปฐม 23233',
			imageUrl:
				'https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.6435-9/67106839_2437736989839170_2207306787177103360_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=174925&_nc_eui2=AeH8g5BDCcHFXtd1k3SBEjsuz6krD3wo5yPPqSsPfCjnI5qKDHwB3zKsvjvrqjZMDzO2uodfCYdLb_4Y-oVvpOpS&_nc_ohc=uXmLZ5w0ZfQAX_7QMaJ&tn=GHMOCQpcGJpmR7l9&_nc_ht=scontent.fbkk17-1.fna&oh=9a3b7e288bf06feaea1513ca4013b430&oe=60E58601'
		},
		{
			name: 'Chayut Tubtimtoe',
			score: 5,
			address: 'ที่อยู่: 58/8 ต.มาบแค อ.เมืองนครปฐม จังหวัดนครปฐม 23233',
			imageUrl:
				'https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.6435-9/67106839_2437736989839170_2207306787177103360_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=174925&_nc_eui2=AeH8g5BDCcHFXtd1k3SBEjsuz6krD3wo5yPPqSsPfCjnI5qKDHwB3zKsvjvrqjZMDzO2uodfCYdLb_4Y-oVvpOpS&_nc_ohc=uXmLZ5w0ZfQAX_7QMaJ&tn=GHMOCQpcGJpmR7l9&_nc_ht=scontent.fbkk17-1.fna&oh=9a3b7e288bf06feaea1513ca4013b430&oe=60E58601'
		},
		{
			name: 'Chayut Tubtimtoe',
			score: 5,
			address: 'ที่อยู่: 58/8 ต.มาบแค อ.เมืองนครปฐม จังหวัดนครปฐม 23233',
			imageUrl:
				'https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.6435-9/67106839_2437736989839170_2207306787177103360_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=174925&_nc_eui2=AeH8g5BDCcHFXtd1k3SBEjsuz6krD3wo5yPPqSsPfCjnI5qKDHwB3zKsvjvrqjZMDzO2uodfCYdLb_4Y-oVvpOpS&_nc_ohc=uXmLZ5w0ZfQAX_7QMaJ&tn=GHMOCQpcGJpmR7l9&_nc_ht=scontent.fbkk17-1.fna&oh=9a3b7e288bf06feaea1513ca4013b430&oe=60E58601'
		},
		{
			name: 'Chayut Tubtimtoe',
			score: 5,
			address: 'ที่อยู่: 58/8 ต.มาบแค อ.เมืองนครปฐม จังหวัดนครปฐม 23233',
			imageUrl:
				'https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.6435-9/67106839_2437736989839170_2207306787177103360_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=174925&_nc_eui2=AeH8g5BDCcHFXtd1k3SBEjsuz6krD3wo5yPPqSsPfCjnI5qKDHwB3zKsvjvrqjZMDzO2uodfCYdLb_4Y-oVvpOpS&_nc_ohc=uXmLZ5w0ZfQAX_7QMaJ&tn=GHMOCQpcGJpmR7l9&_nc_ht=scontent.fbkk17-1.fna&oh=9a3b7e288bf06feaea1513ca4013b430&oe=60E58601'
		}
	];
</script>

<svelte:head>
	<title>Senior Project Extended: Search Buyer</title>
</svelte:head>

<Searchbox />

<!-- <div class="grid grid-cols-3 gap-4"> -->
<div class="flex justify-start">
	{#each mockedBuyerData as buyer}
		<BuyerCard
			name={buyer.name}
			score={buyer.score}
			address={buyer.address}
			imageUrl={buyer.imageUrl}
		/>
	{/each}
</div>
