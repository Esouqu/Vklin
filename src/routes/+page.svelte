<script lang="ts">
	import { onMount } from 'svelte';
	import LastLogs from '../lib/components/LastLogs.svelte';
	import PlayersBanners from '../lib/components/PlayersBanners.svelte';
	import Spinner from '../lib/components/Spinner.svelte';
	import type {
		FirebaseTreasure,
		LocationsCollection,
		LogsCollection,
		PlayersCollection
	} from '../lib/interfaces';
	import Legend from '$lib/components/Legend.svelte';
	import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import mapController from '$lib/MapController.svelte';
	import { loadGLB } from '$lib/utils';
	import arrowGLB from '$lib/assets/3d-models/arrow/direction_arrow.glb';
	import characterGLB from '$lib/assets/3d-models/character/character.glb';
	import treasureGLB from '$lib/assets/3d-models/treasure/treasure.glb';
	import * as SkieletonUtils from 'three/addons/utils/SkeletonUtils.js';
	import ThreePlayer from '$lib/threeEntities/ThreePlayer';
	import GameCanvas from '$lib/components/GameCanvas.svelte';

	let isLoading = $state(true);
	let players: PlayersCollection = $state({});
	let locations: LocationsCollection = $state({});
	let logs: LogsCollection = $state({});
	let treasure: FirebaseTreasure = $state({
		position: { x: 0, y: 0, z: 0 },
		keysRequired: 0
	});

	let gltfCharacter: GLTF;
	let gltfTreasure: GLTF;
	let gltfArrow: GLTF;

	onMount(async () => {
		isLoading = true;

		await load3DModels();
		await fetchGameData();

		createLocations(locations);
		createPlayers(players);
		createTreasure(treasure);

		isLoading = false;
	});

	async function load3DModels() {
		const [arrow, character, treasure] = await Promise.all([
			loadGLB(arrowGLB),
			loadGLB(characterGLB),
			loadGLB(treasureGLB)
		]);

		gltfArrow = arrow;
		gltfTreasure = treasure;
		gltfCharacter = character;
	}

	async function fetchGameData() {
		const data = await fetch('/api/game-data').then((res) => res.json());

		players = data.players;
		locations = data.locations;
		treasure = data.treasure;
		logs = data.logs;
	}

	function createLocations(locationsValue: LocationsCollection) {
		for (const location of Object.values(locationsValue)) {
			const ownerColor = location.ownerId ? players[location.ownerId]?.color : undefined;

			mapController.addLocation(location, gltfArrow, ownerColor);
		}
	}

	function createPlayers(playersCollection: PlayersCollection) {
		const playersArray = Object.values(playersCollection);

		for (const player of playersArray) {
			const threePlayer = new ThreePlayer({
				...player,
				object3d: SkieletonUtils.clone(gltfCharacter.scene),
				animations: gltfCharacter.animations,
				direction: locations[`${player.position.x}-${player.position.y}`].possibleMoves[0]
			});

			mapController.addPlayer(threePlayer);
		}
	}

	function createTreasure(treasureValue: FirebaseTreasure) {
		mapController.createTreasure(gltfTreasure);
	}
</script>

<div class="game-page">
	{#if isLoading}
		<div class="loading-page">
			<Spinner --spinner-size="3rem" />
		</div>
	{:else}
		<GameCanvas
			locationsGroup={mapController.locationsObjects}
			playersGroup={mapController.playersObjects}
			treasure={mapController.treasureObject}
		/>
		<!-- <SpectatorCanvas {locations} {players} /> -->
		<PlayersBanners {players} {logs} />
		<LastLogs {logs} />
		<!-- <div class="spectator-info"> -->
		<Legend {locations} />
		<!-- </div> -->
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
