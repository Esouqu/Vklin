<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<div class={cn('flex items-center justify-center w-full', className)}>
	<div class="circle"></div>
</div>

<style>
	.circle {
		height: var(--spinner-size, 1.5rem);
		width: var(--spinner-size, 1.5rem);
		border-color: hsl(var(--accent)) hsl(var(--accent)) transparent transparent;
		border-width: calc(var(--spinner-size) / 10);
		border-style: solid;
		border-image: initial;
		border-radius: 50%;
		animation: 1s ease-in-out 0s infinite normal none running rotate;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
