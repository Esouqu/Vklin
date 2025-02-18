<script lang="ts">
	import { fade } from 'svelte/transition';
	import effectManager from '$lib/effectManager';
	import { getEffectIcon } from '$lib/data/effectIcons';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

	const { effectId, duration }: { effectId: string; duration: number } = $props();
	const effect = $derived(effectManager.getEffect(effectId));
	const icon = $derived(getEffectIcon(effectId));
</script>

{#if effect}
	<Tooltip>
		<TooltipTrigger>
			<div
				class="relative flex rounded-full outline outline-[0.125rem] outline-green-500 data-[negative=true]:outline-red-500 bg-muted"
				data-negative={effect.isNegative}
				in:fade|global
			>
				<img class="w-full h-full object-cover rounded-full" src={icon} alt={effect.name} />
			</div>
		</TooltipTrigger>
		<TooltipContent
			class="w-[12rem] bg-[var(--surface-container-highest)]"
			side="right"
			sideOffset={24}
		>
			<div>{effect.description}</div>
			<br />
			<div class="text-xs">Длительность: {duration === -1 ? 'бесконечно' : duration}</div>
		</TooltipContent>
	</Tooltip>
{/if}
