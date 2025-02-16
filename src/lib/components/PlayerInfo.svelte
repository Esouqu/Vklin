<script lang="ts">
	import type GamePlayer from '$lib/gameEntities/GamePlayer.svelte';
	import type { FirebaseLog, IGame } from '$lib/interfaces';
	import ButtonSelect from './ButtonSelect.svelte';
	import TwitchIcon from './icons/TwitchIcon.svelte';
	import InventoryInfo from './InventoryInfo.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
	import Color from 'color';
	import { Button } from './ui/button';
	import GameCard from './GameCard.svelte';
	import { ScrollArea } from './ui/scroll-area';
	import { Badge } from './ui/badge';
	import Log from './Log.svelte';
	import VkVideoIcon from './icons/VKVideoIcon.svelte';
	import YoutubeIcon from './icons/YoutubeIcon.svelte';

	interface Props {
		player: GamePlayer;
		logs: { [key: string]: FirebaseLog } | null;
	}

	const { player, logs }: Props = $props();

	const selectOptions = [{ name: 'Игры' }, { name: 'Действия' }];

	let currentOption = $state(0);
	let prevOption = $state(0);

	let sortedLogs = $derived.by(sortLogs);
	let gameLogs = $derived(sortedLogs.filter((log) => log.type === 'game'));
	let otherLogs = $derived(sortedLogs.filter((log) => log.type !== 'game'));
	let currentGame = $derived.by(getCurrentGameLog);

	let gamesCounter = $derived.by(getGamesCount);

	function getGamesCount() {
		let gamesCounter = { completed: 0, dropped: 0 };

		for (const game of gameLogs) {
			if (game.data.status === 'completed') {
				gamesCounter.completed += 1;
			} else if (game.data.status === 'dropped') {
				gamesCounter.dropped += 1;
			}
		}

		return gamesCounter;
	}

	function getCurrentGameLog() {
		if (!player.game || player.game.status !== 'active') return null;

		return {
			playerId: player.id,
			type: 'game',
			data: player.game
		} as FirebaseLog;
	}

	function sortLogs() {
		return Object.values(logs || {}).sort((a, b) => b.timestamp - a.timestamp);
	}
</script>

<Card class="relative flex flex-col bg-opacity-70 w-full bg-transparent shadow-none border-none">
	<div
		class="absolute z-[-1] top-[10%] left-[10%] right-[10%] bottom-[10%] blur-3xl rounded-full"
		style="background: radial-gradient(circle at bottom, {Color(player.color)
			.fade(0.7)
			.rgb()}, {Color(player.color).lighten(0.5).fade(0.7).rgb()});"
	></div>
	<CardHeader class="px-8 py-4">
		<CardTitle class="flex gap-2">
			<div class="w-16 h-auto rounded-lg flex overflow-hidden aspect-square border">
				<img class="object-contain" src={player.avatar} alt="player" />
			</div>
			<div class="flex flex-col">
				<div class="flex gap-2 items-center">
					<h2 class="text-2xl font-semibold leading-none tracking-tight">{player.name}</h2>
					{#if player.streamUrl}
						<Button variant="link" class="p-1" href={player.streamUrl} target="_blank">
							{#if player.streamUrl.includes('twitch.tv')}
								<TwitchIcon />
							{:else if player.streamUrl.includes('youtube.com')}
								<YoutubeIcon />
							{/if}
						</Button>
					{/if}
				</div>
				<div class="flex gap-2">
					<Badge variant="outline" class="bg-zinc-600">
						Ход — {player.turn}
					</Badge>
					<Badge variant="outline" class="bg-green-600">
						Пройдено — {gamesCounter.completed}
					</Badge>
					<Badge variant="outline" class="bg-red-600">
						Брошено — {gamesCounter.dropped}
					</Badge>
				</div>
			</div>
		</CardTitle>
	</CardHeader>
	<CardContent class="flex gap-8 p-0 h-[40rem]">
		<div class="flex flex-col w-full">
			<div class="py-4 px-8">
				<InventoryInfo items={player.items} />
			</div>
			<div class="px-8">
				<ButtonSelect options={selectOptions} bind:prevOption bind:currentOption />
			</div>
			<ScrollArea class="px-8">
				{#if currentOption === 0}
					<!-- <InventoryInfo items={player.items} /> -->
					<div class="flex flex-col gap-2 py-4">
						{#each currentGame ? [currentGame, ...gameLogs] : gameLogs as game}
							{@const data = game.data as IGame}
							<GameCard {...data} timestamp={game.timestamp} />
						{/each}
					</div>
				{:else}
					<div class="flex flex-col gap-2 py-4">
						{#each otherLogs as item}
							<Log log={item} />
						{/each}
					</div>
				{/if}
			</ScrollArea>
		</div>
	</CardContent>
</Card>
