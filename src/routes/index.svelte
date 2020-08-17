<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<script>
	import { onMount } from 'svelte';
	import LineChart from '../components/LineChart.svelte';

	let temperaturesData = getTemperatures();

	async function getTemperatures() {
		try{
			const res = await fetch(
				'api/get-temperatures.json',
				{method: 'GET', headers: {'Content-Type': 'application/json'}}
			);
			const data = await res.json();

			if (res.status === 200) {
				temperaturesData = data;
			}
		}catch(err){
    	}
		
	};		
</script>

<svelte:head>
	<title>Domaparte</title>
</svelte:head>

<h1>Welcome poupette!</h1>

<figure>
	<img alt='Success Kid' src='successkid.jpg'>
</figure>

{#await temperaturesData}
	<p>...waiting</p>
{:then number}
	<LineChart title="Temperatures extérieur" data="{temperaturesData}"/>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
