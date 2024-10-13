<script lang="ts">
	import { fade } from 'svelte/transition';
	import effectManager from '$lib/effectManager';
	import { getEffectIcon } from '$lib/data/effectIcons';

	const { effectId, duration }: { effectId: string; duration: number } = $props();
	const effect = $derived(effectManager.getEffect(effectId));
	const icon = $derived(getEffectIcon(effectId));
</script>

{#if effect}
	<div
		class="effect"
		class:negative={effect.isNegative}
		data-tooltip={effect.description + `\n\nДлительность: ${duration}`}
		transition:fade|global
	>
		<img src={icon} alt={effect.name} />
	</div>
{/if}

<style lang="scss">
	.effect {
		position: relative;
		display: flex;
		border-radius: 50%;
		outline: 0.125rem solid limegreen;

		&.negative {
			outline: 0.125rem solid red;
		}

		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			aspect-ratio: 1 / 1;
			border-radius: 50%;
		}

		&:hover {
			&::after {
				content: attr(data-tooltip);
				position: absolute;
				top: 50%;
				left: calc(100% + 2rem);
				translate: 0 -50%;
				z-index: 999;
				padding: 1rem;
				border-radius: 0.5rem;
				min-width: 12rem;
				white-space: pre-wrap;
				box-shadow: var(--elevation-3);
				background-color: var(--surface-container-highest);
				color: white;
			}
		}
	}
</style>
