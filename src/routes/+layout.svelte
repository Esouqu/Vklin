<script lang="ts">
	import { type Snippet } from 'svelte';
	import '../app.css';
	import { TooltipProvider } from '$lib/components/ui/tooltip';

	const { children }: { children: Snippet } = $props();
</script>

<TooltipProvider disableHoverableContent delayDuration={0}>
	<div class="relative flex justify-center w-full items-center">
		{@render children()}
	</div>
</TooltipProvider>
