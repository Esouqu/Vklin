<script lang="ts">
	import anime from 'animejs';
	import { onMount, type Snippet } from 'svelte';
	import ToolsIcon from '~icons/mdi/tools';

	const { children }: { children: Snippet } = $props();

	onMount(() => {
		anime({
			targets: '.wip-text',
			opacity: [0.5, 1],
			direction: 'alternate',
			easing: 'easeInOutSine',
			loop: true
		});
		anime({
			targets: '.wip-icon-wrapper',
			rotate: anime.stagger([-360, 360]),
			delay: anime.stagger(1000, { start: 1000 }),
			loop: true
		});
	});
</script>

<div class="layout-wrapper">
	<!-- {@render children()} -->
	<div class="wip">
		<div class="wip-icon-wrapper">
			<ToolsIcon />
		</div>
		<span class="wip-text"> В разработке </span>
		<div class="wip-icon-wrapper">
			<ToolsIcon transform="scale(-1, 1)" />
		</div>
	</div>
</div>

<style lang="scss">
	.layout-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		width: 100%;
		align-items: center;
	}

	.wip {
		display: flex;
		gap: 1rem;
		font-weight: 500;
		font-size: 2.5rem;
		color: var(--on-surface);
	}
</style>
