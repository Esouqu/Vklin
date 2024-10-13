<script lang="ts">
	import { onMount } from 'svelte';
	import type {
		FirebaseLocation,
		FirebasePlayer,
		LocationsCollection,
		PlayersCollection
	} from '$lib/interfaces';
	import { getLocationColor, isSamePosition, remToPixel } from '$lib/utils';
	import imagePlaceholder from '$lib/assets/images/placeholder.png';

	interface Props {
		locations: LocationsCollection;
		players: PlayersCollection;
	}

	const { locations, players }: Props = $props();

	let locationSize = remToPixel(3.25);
	let locationBorder = remToPixel(0.5);
	let locationGap = remToPixel(5.25);
	let arrowLength = remToPixel(3);
	let arrowHeadSize = remToPixel(1);
	let avatarSize = remToPixel(2.25);
	let avatarGap = remToPixel(1.25);
	let avatarBorder = remToPixel(0.25);

	let width = $state(0);
	let height = $state(0);
	let aspectRatio = $derived(width / height);

	let canvasElement: HTMLCanvasElement | undefined = $state();
	let canvasContext: CanvasRenderingContext2D | null | undefined = $state(null);

	onMount(() => {
		canvasContext = canvasElement?.getContext('2d');

		if (!canvasContext) throw new Error('Canvas context not found');

		renderLocations(canvasContext);
	});

	$effect(() => {
		if (aspectRatio && canvasElement) {
			onResize();
		}
	});

	function onResize() {
		if (!canvasElement || !canvasContext) throw new Error('Canvas element not found');

		canvasElement.width = width;
		canvasElement.height = height;

		locationSize = remToPixel(3.25);
		locationBorder = remToPixel(0.5);
		locationGap = remToPixel(5.25);
		arrowLength = remToPixel(3);
		arrowHeadSize = remToPixel(0.875);
		avatarSize = remToPixel(2.25);
		avatarGap = remToPixel(1.25);
		avatarBorder = remToPixel(0.25);

		canvasContext.clearRect(0, 0, width, height);

		renderLocations(canvasContext);
	}

	function renderPlayerAvatar(
		ctx: CanvasRenderingContext2D,
		player: FirebasePlayer,
		location: FirebaseLocation,
		offsetX: number,
		offsetY: number
	) {
		const { x, y } = calculateLocationCoordinates(location, offsetX, offsetY);
		const playerImage = new Image();
		playerImage.src = player.avatar || imagePlaceholder;

		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, avatarSize / 2, 0, 2 * Math.PI);
		ctx.clip();
		ctx.drawImage(playerImage, x - avatarSize / 2, y - avatarSize / 2, avatarSize, avatarSize);
		ctx.strokeStyle = 'white'; // Set the border color
		ctx.lineWidth = avatarBorder; // Set the border width
		ctx.stroke();
		ctx.restore();
	}

	function calculateCanvasOffset() {
		// Calculate the average x and y coordinates of all locations
		let sumX = 0;
		let sumY = 0;
		let count = 0;

		for (const location of Object.values(locations)) {
			sumX += location.position.x;
			sumY += location.position.y;
			count++;
		}

		const avgX = sumX / count;
		const avgY = sumY / count;

		// Calculate the offset to center the locations
		const centerX = width / 2;
		const centerY = height / 2;
		const offsetX = centerX - avgX * locationGap;
		const offsetY = centerY - avgY * locationGap;

		return { offsetX, offsetY };
	}

	function calculateLocationCoordinates(
		location: FirebaseLocation,
		offsetX: number,
		offsetY: number
	) {
		const x = location.position.x * locationGap + offsetX;
		const y = location.position.y * locationGap + offsetY;
		return { x, y };
	}

	function drawHexagon(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		hexagonSize: number,
		color: string,
		ownerColor: string | null
	) {
		ctx.beginPath();
		for (let i = 0; i < 6; i++) {
			const angle = (i * Math.PI) / 3;
			const px = x + Math.cos(angle) * (hexagonSize / 2);
			const py = y + Math.sin(angle) * (hexagonSize / 2);
			if (i === 0) {
				ctx.moveTo(px, py);
			} else {
				ctx.lineTo(px, py);
			}
		}
		ctx.closePath();
		ctx.strokeStyle = color; // Black color for border
		ctx.lineWidth = locationBorder; // Border width
		ctx.stroke();
		ctx.fillStyle = ownerColor || 'rgb(54 58 53)'; // Blue color for locations
		ctx.fill();
	}

	function drawArrow(
		canvasContext: CanvasRenderingContext2D,
		x: number,
		y: number,
		direction: { x: number; y: number }
	) {
		const dx = direction.x;
		const dy = direction.y;
		const angle = Math.atan2(dy, dx);
		const arrowX = x + Math.cos(angle) * arrowLength;
		const arrowY = y + Math.sin(angle) * arrowLength;

		// canvasContext.beginPath();
		// canvasContext.moveTo(x, y);
		// canvasContext.lineTo(arrowX, arrowY);
		// canvasContext.lineWidth = arrowWidth;
		// canvasContext.strokeStyle = '#fff'; // White color for arrow
		// canvasContext.stroke();

		// Draw arrow head
		const arrowHeadAngle = Math.PI / 6;
		const arrowHeadX1 = arrowX - Math.cos(angle + arrowHeadAngle) * arrowHeadSize;
		const arrowHeadY1 = arrowY - Math.sin(angle + arrowHeadAngle) * arrowHeadSize;
		const arrowHeadX2 = arrowX - Math.cos(angle - arrowHeadAngle) * arrowHeadSize;
		const arrowHeadY2 = arrowY - Math.sin(angle - arrowHeadAngle) * arrowHeadSize;

		canvasContext.beginPath();
		canvasContext.moveTo(arrowX, arrowY);
		canvasContext.lineTo(arrowHeadX1, arrowHeadY1);
		canvasContext.lineTo(arrowHeadX2, arrowHeadY2);
		canvasContext.fillStyle = '#fff'; // White color for arrow head
		canvasContext.fill();
	}

	function renderLocation(
		ctx: CanvasRenderingContext2D,
		location: FirebaseLocation,
		offsetX: number,
		offsetY: number
	) {
		const { x, y } = calculateLocationCoordinates(location, offsetX, offsetY);
		const locationColor = location.ownerId ? players[location.ownerId]?.color : null;

		for (const direction of location.possibleMoves) {
			drawArrow(ctx, x, y, direction);
		}

		drawHexagon(ctx, x, y, locationSize, getLocationColor(location.type), locationColor);
	}

	function renderPlayerAvatars(
		canvasContext: CanvasRenderingContext2D,
		playersOnLocation: FirebasePlayer[],
		location: FirebaseLocation,
		offsetX: number,
		offsetY: number
	) {
		if (playersOnLocation.length > 1) {
			for (let i = 0; i < playersOnLocation.length; i++) {
				const player = playersOnLocation[i];
				const angle = (i / playersOnLocation.length) * 2 * Math.PI;
				const radius = avatarGap; // distance from center
				const avatarOffsetX = Math.cos(angle) * radius;
				const avatarOffsetY = Math.sin(angle) * radius;
				renderPlayerAvatar(
					canvasContext,
					player,
					location,
					offsetX + avatarOffsetX,
					offsetY + avatarOffsetY
				);
			}
		} else {
			for (const player of playersOnLocation) {
				renderPlayerAvatar(canvasContext, player, location, offsetX, offsetY);
			}
		}
	}

	function renderLocations(ctx: CanvasRenderingContext2D) {
		const { offsetX, offsetY } = calculateCanvasOffset();

		for (const location of Object.values(locations)) {
			let playersOnLocation = [];
			renderLocation(ctx, location, offsetX, offsetY);

			for (const player of Object.values(players)) {
				if (isSamePosition(player.position, location.position)) {
					playersOnLocation.push(player);
				}
			}

			renderPlayerAvatars(ctx, playersOnLocation, location, offsetX, offsetY);
		}
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<canvas style="user-select: none;" bind:this={canvasElement} {width} {height}></canvas>
