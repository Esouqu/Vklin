<script lang="ts">
	type T = $$Generic<MaybeButtonSelectItem>;

	interface MaybeButtonSelectItem {
		name: string;
	}

	interface Props {
		options: T[];
		currentOption: number;
		prevOption?: number;
		color?: string;
		disableOther?: boolean;
		isDisabled?: boolean;
		onOptionChange?: ((optionValue: number) => void) | null;
	}

	let {
		options = [],
		currentOption = $bindable(0),
		prevOption = $bindable(0),
		disableOther,
		isDisabled,
		onOptionChange
	}: Props = $props();

	let buttonElements: HTMLButtonElement[] = $state([]);
	let currentOptionWidth = $derived.by(() => buttonElements[currentOption]?.offsetWidth || 0);
	let buttonsStartPositions: number[] = $derived.by(() =>
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
		prevOption = currentOption;
		currentOption = optionValue;

		if (onOptionChange) onOptionChange(optionValue);
	}
</script>

<div class="button-select bg-background bg-opacity-50" class:disabled={isDisabled}>
	{#each options as option, idx}
		<button
			type="button"
			class="data-[selected=true]:text-primary-foreground opacity-50 data-[selected=true]:opacity-100 data-[selected=true]:pointer-events-none]"
			data-selected={idx === currentOption}
			class:disabled={disableOther && idx !== currentOption}
			onclick={() => selectOption(idx)}
			bind:this={buttonElements[idx]}
		>
			{option.name}
		</button>
	{/each}
	<span
		class="button-select-selector bg-primary"
		style="translate: {buttonsStartPositions[currentOption]}px 0;
		width: {currentOptionWidth}px;"
	></span>
</div>

<style>
	.button-select {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 0.5rem;
		overflow: hidden;

		&.disabled {
			opacity: 0.3;
			pointer-events: none;
		}

		.button-select-selector {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
			border-radius: 0.5rem;
			height: 100%;
			transition: 0.3s;
			pointer-events: none;
		}

		button {
			position: relative;
			z-index: 1;
			border: none;
			padding: 0.5rem 1rem;
			width: 100%;
			line-height: 1;
			font-weight: 600;
			text-transform: uppercase;
			font-size: 0.875rem;
			background-color: transparent;
			transition: 0.3s;
			cursor: pointer;

			&.disabled {
				opacity: 0.3;
				pointer-events: none;
			}

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
