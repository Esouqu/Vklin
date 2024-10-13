<script lang="ts">
	type T = $$Generic<MaybeButtonSelectItem>;

	interface MaybeButtonSelectItem {
		name: string;
	}

	interface Props {
		options: T[];
		currentOption: number;
		color?: string;
		disableOther?: boolean;
		isDisabled?: boolean;
		onOptionChange?: ((optionValue: number) => void) | null;
	}

	let {
		options = [],
		currentOption = $bindable(0),
		color,
		disableOther,
		isDisabled,
		onOptionChange
	}: Props = $props();
	let buttonElements: HTMLButtonElement[] = $state([]);
	let currentOptionWidth = $derived(
		buttonElements[currentOption] ? buttonElements[currentOption].offsetWidth : 0
	);
	let buttonsStartPositions: number[] = $derived(
		makeAccumulativeArray(buttonElements.map((b) => b.offsetWidth))
	);

	function makeAccumulativeArray(inputArray: number[]): number[] {
		return inputArray.reduce(
			(acc, cur) => {
				acc.push(acc[acc.length - 1] + cur);
				return acc;
			},
			[0]
		);
	}

	function selectOption(optionValue: number) {
		currentOption = optionValue;

		if (onOptionChange) onOptionChange(optionValue);
	}
</script>

<div
	class="button-select"
	class:disabled={isDisabled}
	style="--selector-color: {color ||
		'buttonface'}; --selector-size: 50px; --selector-width: {currentOptionWidth}px;"
>
	{#each options as option, idx}
		<button
			type="button"
			class:selected={idx === currentOption}
			class:disabled={disableOther && idx !== currentOption}
			onclick={() => selectOption(idx)}
			bind:this={buttonElements[idx]}
		>
			{option.name}
		</button>
	{/each}
	<span
		class="button-select-selector"
		style="translate: {buttonsStartPositions[currentOption]}px 0;"
	></span>
</div>

<style lang="scss">
	.button-select {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 8px;
		color: white;
		overflow: hidden;

		&.disabled {
			opacity: 0.3;
			pointer-events: none;
		}

		&-selector {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
			border-radius: 8px 8px 0 0;
			width: var(--selector-width);
			height: 100%;
			background-color: var(--selector-color);
			transition: 0.3s;
			pointer-events: none;
		}

		button {
			position: relative;
			z-index: 1;
			border: none;
			padding: 8px 16px;
			width: 100%;
			line-height: 1;
			font-weight: 500;
			text-transform: uppercase;
			background-color: transparent;
			color: var(--on-surface);
			opacity: 0.5;
			transition: 0.3s;
			cursor: pointer;

			&.disabled {
				opacity: 0.3;
				pointer-events: none;
			}

			&.selected {
				opacity: 1;
				color: black;
				pointer-events: none;
			}

			&:last-child {
				border-radius: 0 8px 8px 0;
			}

			&:first-child {
				border-radius: 8px 0 0 8px;
			}

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
