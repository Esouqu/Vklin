<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import ThreeCanvas from '$lib/threeEntities/ThreeCanvas';
	import gameController from '$lib/GameController.svelte';
	import { getGroupCenter } from '$lib/utils';
	import {
		BackSide,
		Group,
		Mesh,
		MeshStandardMaterial,
		SphereGeometry,
		TextureLoader
	} from 'three';
	import textureImage from '$lib/assets/images/glass3.jpg';

	interface Props {
		locationsGroup: Group;
		playersGroup: Group;
	}

	const { locationsGroup, playersGroup }: Props = $props();

	let width = $state(0);
	let height = $state(0);
	let aspectRatio = $derived(width / height);

	let canvasElement: HTMLCanvasElement | undefined;

	let threeCanvas: ThreeCanvas | undefined = $state();

	onMount(() => {
		initializeCanvas();
	});

	onDestroy(() => threeCanvas?.dispose());

	$effect(() => {
		if (aspectRatio && threeCanvas) {
			threeCanvas.onResize(width, height, aspectRatio);
		}
	});

	function createHalfSphere() {
		const textureLoader = new TextureLoader();
		const noiseTexture = textureLoader.load(textureImage);
		noiseTexture.rotation = Math.PI / 2;

		const material = new MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.7,
			metalness: 0.1,
			transparent: true,
			opacity: 0.5,
			side: BackSide,
			alphaMap: noiseTexture
		});
		const geometry = new SphereGeometry(35.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
		const mesh = new Mesh(geometry, material);

		return mesh;
	}

	async function initializeCanvas() {
		if (!canvasElement) throw new Error('Canvas element not found');

		const sphere = createHalfSphere();
		const locationsCenter = getGroupCenter(locationsGroup);
		const map = gameController.map;

		map.position.set(locationsCenter.x, 0, locationsCenter.z);
		sphere.position.set(locationsCenter.x, 0, locationsCenter.z);

		threeCanvas = new ThreeCanvas(canvasElement);
		threeCanvas.sceneObjects.add(map);
		threeCanvas.onResize(width, height, aspectRatio);
		threeCanvas.renderFrame();
		threeCanvas.sceneObjects.add(locationsGroup);
		threeCanvas.sceneObjects.add(playersGroup);
		threeCanvas.sceneObjects.add(sphere);

		threeCanvas?.runIntro(locationsCenter);
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<canvas style="user-select: none;" bind:this={canvasElement} {width} {height}></canvas>
