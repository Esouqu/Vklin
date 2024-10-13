<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	interface InputProps {
		id: string;
		value: string | number | null;
		type: HTMLInputTypeAttribute;
		name?: string;
		label?: string;
		size?: number;
		filter?: 'keys';
		placeholder?: string;
		suffix?: string;
		maxlength?: number;
		element?: HTMLInputElement | null;
		disabled?: boolean;
		required?: boolean;
		isValid?: boolean;
		isFilled?: boolean;
		isPreventInput?: boolean;
		isBorderless?: boolean;
		oninput?: (() => void) | null;
		onblur?: (() => void) | null;
		onEnter?: (() => void) | null;
	}

	let {
		id,
		value = $bindable(''),
		type,
		name,
		label,
		filter,
		placeholder,
		suffix,
		size,
		maxlength,
		disabled,
		required,
		isValid,
		isFilled,
		isBorderless,
		element = $bindable<HTMLInputElement | null>(null),
		oninput,
		onblur,
		onEnter
	}: InputProps = $props();

	function handleKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement;
		const isConfirmKey = e.code === 'Enter';

		e.stopPropagation();

		if (filter === 'keys') {
			e.preventDefault();
			value = e.code;
		}

		if (!isConfirmKey) return;

		if (onEnter) onEnter();
		target.blur();
	}
</script>

<label
	class="input-wrapper"
	class:disabled
	class:filled={isFilled}
	class:borderless={isBorderless}
	data-suffix={suffix}
>
	{#if label}
		{label}
	{/if}
	<input
		{id}
		{name}
		{placeholder}
		{maxlength}
		{type}
		{disabled}
		{size}
		class="input"
		spellcheck="false"
		onkeydown={handleKeyDown}
		aria-invalid={isValid}
		{required}
		{oninput}
		{onblur}
		bind:value
		bind:this={element}
	/>
</label>

<style lang="scss">
	.input {
		position: relative;
		padding: var(--input-p, 10.5px);
		border: 0;
		border-radius: 5px;
		outline: 1px solid var(--outline);
		width: var(--input-w, auto);
		font-size: var(--input-font-size, 16px);
		font-weight: var(--input-font-weight, 400);
		text-align: var(--input-text-al, start);
		text-decoration: none;
		text-overflow: ellipsis;
		letter-spacing: 0.25px;
		font-variant-numeric: tabular-nums;
		color: var(--on-surface);
		box-shadow: inset 0 0 0 0 var(--primary);
		background-color: transparent;
		transition: outline-color 0.3s;
		overflow: hidden;

		&-wrapper {
			position: relative;
			display: flex;
			flex-direction: column;
			gap: 10px;
			color: white;
			width: var(--input-w-w, auto);

			&.disabled {
				opacity: 0.5;
			}

			&.filled {
				& .input {
					background-color: var(--surface-container-highest);

					&:focus {
						border-color: var(--primary);
					}

					&:hover:not(:focus):not(:disabled) {
						border-color: white;
					}
				}
			}

			&.borderless {
				& .input {
					border: 0;
					border-radius: 0;
					outline: 0;
					transition: 0.3s;

					&:focus {
						z-index: 999;
						outline: none;
						border-color: transparent;
						box-shadow: inset 0 -3px 0px 0 var(--primary);
					}

					// &:hover:not(:focus):not(:disabled) {
					// 	background-color: var(--hover-white);
					// 	cursor: default;
					// }
				}
			}

			&::after {
				content: attr(data-suffix);
				position: absolute;
				top: 52%;
				right: 10px;
				z-index: 999;
				translate: 0 -50%;
				font-size: 14px;
				text-transform: capitalize;
				opacity: 0.7;
			}
		}

		&:focus {
			z-index: 999;
			outline: 3px solid var(--primary);
			border-color: transparent;
		}

		&:hover:not(:focus):not(:disabled) {
			outline-color: white;
		}

		&:invalid {
			border-color: var(--error);
		}

		&::selection {
			background-color: var(--inverse-primary);
		}

		&::-webkit-inner-spin-button {
			display: none;
		}
	}
</style>
