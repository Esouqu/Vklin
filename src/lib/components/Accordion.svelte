<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import ArrowDownIcon from '~icons/mdi/keyboardArrowDown';
	import ArrowUpIcon from '~icons/mdi/keyboardArrowUp';

	interface Props {
		title: string;
		isOpen?: boolean;
		isInverse?: boolean;
		maxHeight?: string;
		children: Snippet;
	}

	let {
		title,
		isOpen = $bindable(false),
		maxHeight = '20rem',
		isInverse = false,
		children
	}: Props = $props();

	function onclick() {
		isOpen = !isOpen;
	}
</script>

<div class="accordion" style="--accordion-max-height: {maxHeight}" class:opened={isOpen}>
	{#if isOpen && isInverse}
		<div class="accordion-content" transition:slide>
			{@render children()}
		</div>
	{/if}
	<button type="button" class="accordion-trigger" {onclick}>
		{title}
		{#if (!isInverse && isOpen) || (isInverse && !isOpen)}
			<ArrowUpIcon font-size="1.25rem" />
		{:else if (!isInverse && !isOpen) || (isInverse && isOpen)}
			<ArrowDownIcon font-size="1.25rem" />
		{/if}
	</button>
	{#if isOpen && !isInverse}
		<div class="accordion-content" transition:slide>
			{@render children()}
		</div>
	{/if}
</div>

<style lang="scss">
	.accordion {
		width: 100%;
		border-radius: 0.5rem;
		background-color: var(--surface-container-highest);
		box-shadow: var(--elevation-3);
		overflow: hidden;

		&.opened &-trigger::after {
			visibility: visible;
			width: 100%;
		}

		&-trigger {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border: none;
			padding: 0.75rem 1rem;
			width: 100%;
			font-weight: 600;
			color: var(--on-surface-variant);
			background-color: transparent;
			user-select: none;
			cursor: pointer;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 0;
				height: 0.1rem;
				background-color: var(--outline-variant);
				transition: 0.2s;
				visibility: hidden;
			}
		}

		&-content {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			padding: 0.5rem;
			max-height: var(--accordion-max-height);
			overflow: hidden auto;
		}
	}
</style>
