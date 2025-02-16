<script lang="ts">
	import type { IGame } from '$lib/interfaces';
	import { getLocalTime } from '$lib/utils';
	import { Badge } from './ui/badge';

	interface Props extends IGame {
		timestamp: number;
	}

	const { name, ingameTime, status, rating, review, timestamp }: Props = $props();

	const statusStyles = $derived.by(getStatusText);
	const localDate = $derived.by(() => getLocalTime(timestamp));

	function getStatusText() {
		switch (status) {
			case 'active':
				return {
					text: 'Проходит',
					bg: 'bg-blue-600'
				};
			case 'completed':
				return {
					text: 'Пройдено',
					bg: 'bg-green-600'
				};
			case 'dropped':
				return {
					text: 'Дроп',
					bg: 'bg-red-600'
				};
			case 'rerolled':
				return {
					text: 'Реролл',
					bg: 'bg-zinc-600'
				};
		}
	}
</script>

<div class="bg-background bg-opacity-50 prose-sm prose-invert border p-4 rounded-md">
	<div class="flex gap-2">
		<Badge variant="outline" class={statusStyles.bg}>{statusStyles.text}</Badge>
		{#if ingameTime && ingameTime !== 'none'}
			<Badge variant="outline" class="bg-zinc-600">{`${ingameTime} часов`}</Badge>
		{/if}
	</div>
	<h2 class="font-medium my-1">{name}</h2>
	<p class="leading-4 whitespace-break-spaces">
		{rating === 'none' || rating === undefined ? '?' : rating} / 10 — {review}
	</p>
	{#if localDate !== 'Invalid Date'}
		<div class="text-xs text-muted-foreground">{localDate}</div>
	{/if}
</div>
