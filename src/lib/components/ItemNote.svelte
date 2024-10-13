<script lang="ts">
	import { fade } from 'svelte/transition';
	import RangeIcon from '~icons/mdi/callMade';
	import RARITIES from '$lib/data/raritiesData';
	import type { IItem } from '$lib/data/itemsData';

	const { name, effect, rarity, range }: Partial<IItem> = $props();

	const color = $derived(rarity !== undefined ? RARITIES[rarity].color : undefined);
</script>

<div
	class="item-note"
	style="--card-accent-color: {color || 'var(--surface-container-highest)'};"
	transition:fade={{ duration: 300 }}
>
	<h3>{name}</h3>
	<p class="item-note-effect">{effect}</p>
	{#if range}
		<div class="item-note-range">
			<RangeIcon />
			<div>Дальность {range < 0 ? 'неограниченная' : range}</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.item-note {
		padding: 20px;
		border-radius: 0.5rem;
		width: 20rem;
		max-width: 20rem;
		box-shadow: var(--elevation-3);
		background: radial-gradient(
			circle at 100% 0,
			var(--card-accent-color),
			var(--surface-container-high),
			var(--surface-container)
		);
		color: white;

		& h3 {
			margin: 0;
			text-transform: uppercase;
		}

		&-range {
			display: flex;
			align-items: center;
			margin: 0;
			font-size: 0.875rem;
		}
	}
</style>
