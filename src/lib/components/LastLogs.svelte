<script lang="ts">
	import { fly } from 'svelte/transition';
	import Log from '$lib/components/Log.svelte';
	import type { LogsCollection } from '$lib/interfaces';
	import Accordion from '$lib/components/Accordion.svelte';

	interface Props {
		logs: LogsCollection;
	}

	const { logs }: Props = $props();

	let lastLogs = $derived.by(getLastLogs);

	function getLastLogs() {
		const logsValues = Object.values(logs).flatMap(Object.values);

		return logsValues.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
	}
</script>

<div class="last-logs" transition:fly={{ x: 100, duration: 300 }}>
	<Accordion title="Последние события">
		<!-- <div class="logs-list" transition:slide={{ axis: 'y', duration: 300 }}> -->
		{#each lastLogs as log}
			<Log {...log} isUsernameShown={true} />
		{/each}
		<!-- </div> -->
	</Accordion>
</div>
