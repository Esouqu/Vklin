<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	type PositionType =
		| 'top-left'
		| 'bottom-left'
		| 'bottom-left'
		| 'top-right'
		| 'bottom-right'
		| 'center'
		| 'bottom-center'
		| 'right-center';

	interface Props {
		position: PositionType;
		width?: string;
		height?: string;
		children: Snippet;
	}

	const { children, position, width = 'auto', height = 'auto' }: Props = $props();

	const positionStyle = $derived.by(() => getPosition(position));

	function getPosition(position: PositionType) {
		switch (position) {
			case 'top-left':
				return 'top: 2.5rem; left: 2.5rem;';
			case 'bottom-left':
				return 'bottom: 2.5rem; left: 2.5rem;';
			case 'top-right':
				return 'top: 2.5rem; right: 2.5rem;';
			case 'bottom-right':
				return 'bottom: 2.5rem; right: 2.5rem;';
			case 'center':
				return 'top: 50%; left: 50%; translate: -50% -50%;';
			case 'bottom-center':
				return 'bottom: 2.5rem; left: 50%; translate: -50% 0;';
			case 'right-center':
				return 'top: 50%; right: 2.5rem; translate: 0 -50%;';
			case 'bottom-left':
				return 'bottom: 2.5rem; left: 2.5rem;';
		}
	}
</script>

<div
	class="popup"
	style={positionStyle + `width: ${width}; height: ${height};`}
	transition:fly|global={{ y: 100, duration: 500 }}
>
	{@render children()}
</div>

<style lang="scss">
	.popup {
		position: absolute;
		z-index: 999;
		padding: 0.825rem;
		border-radius: 0.5rem;
		background-color: rgba(0 0 0 / 0.7);
		// background-color: var(--surface-container-lowest);
		box-shadow: var(--elevation-3);
	}
</style>
