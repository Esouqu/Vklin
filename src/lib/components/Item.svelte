<script lang="ts">
	import type { IItem } from '$lib/data/itemsData';

	interface Props extends IItem {
		uses: number;
		onmouseover?: () => void;
		onmouseleave?: () => void;
	}

	const { image, uses, onmouseover, onmouseleave }: Props = $props();
</script>

<button class="item" {onmouseover} {onmouseleave} onfocus={() => {}} onblur={() => {}}>
	<img src={image} alt="Item" draggable="false" />
	<span class="item__uses">{uses}</span>
</button>

<style lang="scss">
	.item {
		position: relative;
		display: flex;
		padding: 0;
		margin: 0;
		border: 0;
		border-radius: 0.5rem;
		border: 3px solid #070707;
		min-width: 4.5rem;
		max-width: 4.5rem;
		height: 4.5rem;
		transition: 0.3s;
		overflow: hidden;
		background-color: transparent;

		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}

		&__uses {
			position: absolute;
			bottom: -5px;
			right: -5px;
			padding: 0.25rem 0.5rem;
			border-radius: 50%;
			font-variant-numeric: tabular-nums;
			font-weight: 600;
			background-color: var(--surface-container-lowest);
			color: white;
			pointer-events: none;
		}
	}
</style>
