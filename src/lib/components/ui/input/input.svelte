<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	interface Props {
		onConfirmation?: ((value: number | string | null) => void) | null;
	}

	let {
		type,
		ref = $bindable(null),
		value = $bindable(type === 'number' ? null : ''),
		class: className,
		onblur: onBlur,
		onkeydown: onKeyDown,
		onConfirmation,
		...restProps
	}: WithElementRef<HTMLInputAttributes> & Props = $props();

	function onkeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		e.stopPropagation();

		if (e.key === 'Enter') {
			ref?.blur();
		}

		onKeyDown?.(e);
	}

	function onblur(e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		onConfirmation?.(value);
		onBlur?.(e);
	}
</script>

<input
	bind:this={ref}
	{type}
	class={cn(
		'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
		className
	)}
	bind:value
	{onkeydown}
	{onblur}
	{...restProps}
/>
