<script lang="ts">
	import { onMount } from 'svelte';
	import LastLogs from '../lib/components/LastLogs.svelte';
	import PlayersBanners from '../lib/components/PlayersBanners.svelte';
	import type { LocationsCollection, PlayersCollection } from '../lib/interfaces';
	import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { ARROW_OBJECT, loadGLB, POINTS_OBJECT } from '$lib/utils';
	import arrowGLB from '$lib/assets/3d-models/arrow/direction_arrow.glb';
	import characterGLB from '$lib/assets/3d-models/character/archiedos.glb';
	import locationsGLB from '$lib/assets/3d-models/locations.glb';
	import mapGLB from '$lib/assets/3d-models/map/map.glb';
	import * as SkieletonUtils from 'three/addons/utils/SkeletonUtils.js';
	import ThreePlayer from '$lib/threeEntities/ThreePlayer';
	import Spinner from '$lib/components/Spinner.svelte';
	import gameController from '$lib/GameController.svelte';
	import SpectatorCanvas from '$lib/components/SpectatorCanvas.svelte';
	import Rules from '$lib/components/Rules.svelte';
	import GamePlayer from '$lib/gameEntities/GamePlayer.svelte';
	import gameLogs from '$lib/stores/gameLogs';
	import itemManager from '$lib/ItemManager';
	import effectManager from '$lib/effectManager';
	import EFFECTS from '$lib/data/effectsData';
	import ITEMS from '$lib/data/itemsData';

	let isLoading = $state(true);
	let players: PlayersCollection = $state({});
	let locations: LocationsCollection = $state({});

	let gltfCharacter: GLTF;
	let gltfMap: GLTF;

	onMount(async () => {
		isLoading = true;

		await load3DModels();
		await fetchGameData();

		createPlayers(players);
		createLocations(locations);
		effectManager.addEffects(EFFECTS);
		itemManager.addItems(ITEMS);

		isLoading = false;
	});

	async function load3DModels() {
		const [arrow, map, points, character] = await Promise.all([
			loadGLB(arrowGLB),
			loadGLB(mapGLB),
			loadGLB(locationsGLB),
			loadGLB(characterGLB)
		]);

		points.scene.children.forEach((child) => {
			child.children[0].name = 'hexagon';
		});

		POINTS_OBJECT.add(points.scene);
		ARROW_OBJECT.add(arrow.scene);
		gltfCharacter = character;
		gltfMap = map;

		gameController.addMap(gltfMap.scene);
	}

	async function fetchGameData() {
		const res = await fetch('https://server.vklin.com/');
		const data = await res.json();

		players = data.players;
		locations = data.locations;
		gameLogs.set(data.logs);
	}

	function createLocations(locationsValue: LocationsCollection) {
		for (const location of Object.values(locationsValue)) {
			const ownerColor = location.ownerId
				? gameController.getPlayerById(location.ownerId)?.color
				: undefined;

			gameController.addLocation(location, ownerColor);
		}

		for (const gameLocation of gameController.gameLocations) {
			gameController.addArrows(gameLocation);
		}
	}

	function createPlayers(playersCollection: PlayersCollection) {
		const playersArray = Object.values(playersCollection);

		for (const player of playersArray) {
			const threePlayer = new ThreePlayer({
				...player,
				object3d: SkieletonUtils.clone(gltfCharacter.scene),
				animations: gltfCharacter.animations
			});

			let gamePlayer: GamePlayer = new GamePlayer(player, threePlayer);

			gameController.addPlayer(gamePlayer);
		}
	}
</script>

<div class="w-full h-full">
	{#if isLoading || !players}
		<div class="w-full h-full flex items-center justify-center">
			<Spinner --spinner-size="3rem" />
		</div>
	{:else}
		<SpectatorCanvas
			locationsGroup={gameController.locationsGroup}
			playersGroup={gameController.playersGroup}
		/>
		<PlayersBanners />
		<div class="absolute top-[1rem] right-[1rem] z-50 flex gap-2">
			<Rules />
			<LastLogs />
		</div>
	{/if}
</div>
