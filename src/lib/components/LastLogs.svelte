<script lang="ts">
	import { fly } from 'svelte/transition';
	import Log from '$lib/components/Log.svelte';
	import storable from '$lib/stores/storable';
	import gameLogs from '$lib/stores/gameLogs';
	import { Button } from './ui/button';
	import { flip } from 'svelte/animate';
	import ScrollIcon from '~icons/mdi/scroll-text';

	const maxItems = 9;

	let lastLogs = $derived.by(getLastLogs);
	let isOpen = storable(true, 'isLogsOpen');

	function getLastLogs() {
		const logsValues = Object.values($gameLogs || {}).flatMap(Object.values);

		return logsValues.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
	}
</script>

<div class="last-logs-menu">
	<Button
		variant={$isOpen ? 'default' : 'outline'}
		size="icon"
		onclick={() => ($isOpen = !$isOpen)}
	>
		<ScrollIcon width="1.25rem" height="1.25rem" />
	</Button>
	{#if $isOpen}
		<div class="last-logs" transition:fly={{ x: 100, duration: 300 }}>
			{#each lastLogs as log, idx (log.timestamp)}
				<div
					class="last-logs-item"
					style="opacity: {0.1 * (maxItems - idx + 1)};"
					animate:flip={{ duration: 300 }}
				>
					<Log {log} isCompact />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.last-logs {
		position: absolute;
		top: calc(100% + 2rem);
		right: 1rem;
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: 0.5rem;
		width: 30rem;

		&:hover {
			& .last-logs-item {
				opacity: 1 !important;
			}
		}

		.last-logs-item {
			transition: opacity 0.3s;
		}
	}
	.last-logs-menu {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
	}
</style>
