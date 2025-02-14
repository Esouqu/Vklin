<script lang="ts">
	import type { FirebaseItem } from '$lib/interfaces';
	import itemManager from '$lib/ItemManager';
	import Item from './Item.svelte';

	interface Props {
		items: { [key: string]: FirebaseItem | null } | null;
	}

	let { items }: Props = $props();

	const maxRows = 2;
	const maxCols = 8;
	const mappedItems = $derived.by(getItems);

	function getItems() {
		const itemsList = Object.entries(items || {}).map(([id, u]) => {
			const item = itemManager.getItem(id);
			const uses = u?.uses || 0;

			return { uses, item };
		});

		const emptyItems: typeof itemsList = Array(maxRows * maxCols - itemsList.length).fill({
			uses: 0
		});

		return [...itemsList, ...emptyItems].sort((a, b) => {
			if (!a.item) return 1;
			if (!b.item) return -1;
			return b.item.rarity - a.item.rarity;
		});
	}
</script>

<div class="grid grid-cols-[repeat(8,_3.5rem)] grid-rows-[repeat(2,_3.5rem)] justify-center gap-2">
	{#each mappedItems as { uses, item }}
		{#if item}
			<Item {...item} {uses} />
		{:else}
			<div class="rounded border-2"></div>
		{/if}
	{/each}
</div>
