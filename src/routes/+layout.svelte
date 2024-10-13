<script lang="ts">
	import { type Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="layout-wrapper">
	{@render children()}
</div>

<style>
	.layout-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		width: 100%;
		align-items: center;
	}
</style>
