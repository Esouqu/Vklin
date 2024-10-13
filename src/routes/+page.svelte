<script lang="ts">
	import { onMount } from 'svelte';
	import LastLogs from '../lib/components/LastLogs.svelte';
	import PlayersBanners from '../lib/components/PlayersBanners.svelte';
	import SpectatorCanvas from '../lib/components/SpectatorCanvas.svelte';
	import Spinner from '../lib/components/Spinner.svelte';
	import type { LocationsCollection, LogsCollection, PlayersCollection } from '../lib/interfaces';
	import Legend from '$lib/components/Legend.svelte';

	let isLoading = $state(true);
	let players: PlayersCollection = $state({});
	let locations: LocationsCollection = $state({});
	let logs: LogsCollection = $state({});

	onMount(async () => {
		isLoading = true;

		await fetchGameData();

		isLoading = false;
	});

	async function fetchGameData() {
		const data = await fetch('/api/game-data').then((res) => res.json());

		players = data.players;
		locations = data.locations;
		logs = data.logs;
	}
</script>

<div class="game-page">
	{#if isLoading}
		<div class="loading-page">
			<Spinner --spinner-size="3rem" />
		</div>
	{:else}
		<SpectatorCanvas {locations} {players} />
		<PlayersBanners {players} {logs} />
		<div class="spectator-info">
			<LastLogs {logs} />
			<Legend {locations} />
		</div>
	{/if}
</div>

<style lang="scss">
	.game-page {
		width: 100%;
		height: 100%;
	}

	.loading-page {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spectator-info {
		position: absolute;
		z-index: 997;
		top: 2.5rem;
		right: 2.5rem;
		width: 20rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
