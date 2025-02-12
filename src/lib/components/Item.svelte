<script lang="ts">
	import type { IItem } from '$lib/data/itemsData';
	import RARITIES from '$lib/data/raritiesData';
	import RangeIcon from '~icons/mdi/callMade';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

	interface Props extends IItem {
		uses?: number;
		isSelected?: boolean | null;
		size?: string;
		onclick?: ((e: MouseEvent) => void) | null;
	}

	const {
		image,
		uses,
		name,
		effect,
		range,
		rarity,
		size = '3.5rem',
		isSelected = null,
		onclick
	}: Props = $props();

	const color = $derived(rarity !== undefined ? RARITIES[rarity].color : undefined);
</script>

<Tooltip delayDuration={500}>
	<TooltipTrigger
		class="relative rounded border-2 p-2 bg-background bg-opacity-50 border-[var(--border-color)] data-[selected=true]:border-white data-[selected=false]:opacity-50"
		data-selected={isSelected}
		style="width: {size}; height: {size}; --border-color: {color}; cursor: {onclick
			? 'pointer'
			: 'help'};"
		{onclick}
	>
		<img
			src={image}
			alt="Item"
			draggable="false"
			class="w-full h-full object-cover object-center"
		/>
		{#if uses}
			<div
				class="absolute bottom-0.5 right-0.5 w-6 h-6 flex items-center justify-center text-sm aspect-square rounded-full bg-[var(--surface-container-lowest)] tabular-nums font-medium pointer-events-none"
			>
				{uses}
			</div>
		{/if}
	</TooltipTrigger>
	<TooltipContent class="p-0 w-[20rem]" side="top" sideOffset={8}>
		<div
			class="p-4 rounded shadow bg-[radial-gradient(circle_at_100%_0,_var(--card-accent-color),_var(--surface-container-high),_var(--surface-container))] prose-sm prose-invert"
			style="--card-accent-color: {color || 'var(--surface-container-highest)'};"
		>
			<h3>{name}</h3>
			<p class="leading-none">{effect}</p>
			{#if range}
				<div class="flex items-center text-xs">
					<RangeIcon />
					<div>Дальность {range < 0 ? 'неограниченная' : range}</div>
				</div>
			{/if}
		</div>
	</TooltipContent>
</Tooltip>
