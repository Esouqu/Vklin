<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ButtonProps {
		type?: 'button' | 'submit' | 'reset' | null;
		color?: string;
		isDisabled?: boolean;
		isRound?: boolean;
		onclick?: ((e: MouseEvent) => void) | null;
		onkeydown?: ((e: KeyboardEvent) => void) | null;
		children: Snippet;
	}

	const { type, color, isDisabled, isRound, onclick, onkeydown, children }: ButtonProps = $props();
</script>

<div class="button" class:disabled={isDisabled}>
	<button
		{type}
		class:round={isRound}
		style="--button-color: {color || 'buttonface'};"
		{onclick}
		{onkeydown}
	>
		{@render children()}
	</button>
</div>

<style lang="scss">
	.button {
		position: relative;

		&.disabled {
			opacity: 0.3;
			pointer-events: none;
		}

		&:hover {
			& button {
				filter: brightness(90%);
			}
		}

		&:active {
			& button {
				scale: 0.95;
				box-shadow: unset;
			}
		}

		button {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: var(--button-p, 0.8rem);
			border: none;
			width: 100%;
			height: var(--button-height, auto);
			opacity: 1;
			line-height: 1;
			font-weight: 600;
			text-transform: uppercase;
			background-color: var(--button-color, buttonface);
			box-shadow: var(--elevation-1);
			transition: 0.2s;
			user-select: none;
			cursor: pointer;

			&.round {
				border-radius: 100%;
			}
		}
	}
</style>
