<script lang="ts">
	import { LOCATION_OFFSET } from '$lib/constants';
	import ThreeCanvas from '$lib/threeEntities/ThreeCanvas';
	import { getGroupCenter } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	interface Props {
		locationsGroup: THREE.Group;
		playersGroup: THREE.Group;
		treasure: THREE.Group;
	}

	const { locationsGroup, playersGroup, treasure }: Props = $props();

	let width = $state(0);
	let height = $state(0);
	let aspectRatio = $derived(width / height);

	let threeCanvas: ThreeCanvas | undefined = $state();
	let canvasElement: HTMLCanvasElement | undefined;

	onMount(() => {
		initializeCanvas();
	});

	$effect(() => {
		if (aspectRatio && threeCanvas) {
			threeCanvas.onResize(width, height, aspectRatio);
		}
	});

	function createFloor() {
		const floorWidth = 13 * LOCATION_OFFSET;
		const floorHeight = 10 * LOCATION_OFFSET;
		const geometry = new THREE.CylinderGeometry(floorHeight, floorHeight, 1, 8);
		const floor = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#262b26' }));
		floor.position.y = -0.55;
		floor.position.z = floorHeight / 2 - LOCATION_OFFSET / 2;
		floor.position.x = floorWidth / 2 - LOCATION_OFFSET / 2;

		floor.scale.set(0.8, 1, 0.8);
		floor.rotateY(1.96);

		return floor;
	}

	function initializeCanvas() {
		if (!canvasElement) throw new Error('Canvas element not found');

		const introCenter = getGroupCenter(locationsGroup);

		threeCanvas = new ThreeCanvas(canvasElement);

		threeCanvas.scene.add(locationsGroup);
		threeCanvas.scene.add(playersGroup);
		threeCanvas.scene.add(treasure);
		threeCanvas.scene.add(createFloor());

		threeCanvas.onResize(width, height, aspectRatio);
		threeCanvas.renderFrame();

		threeCanvas.runIntro(introCenter);
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<canvas style="user-select: none;" bind:this={canvasElement} {width} {height}></canvas>
