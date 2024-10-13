<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import type { IItem } from '$lib/data/itemsData';
	import type { FirebasePlayer, LogsCollection, PlayersCollection } from '$lib/interfaces';
	import itemManager from '$lib/ItemManager';
	import EffectIcon from '$lib/components/EffectIcon.svelte';
	import ItemNote from '$lib/components/ItemNote.svelte';
	import PlayerBanner from '$lib/components/PlayerBanner.svelte';
	import Item from '$lib/components/Item.svelte';
	import Log from '$lib/components/Log.svelte';

	interface Props {
		players: PlayersCollection;
		logs: LogsCollection;
	}

	const { players, logs }: Props = $props();

	let playerInfo: FirebasePlayer | null = $state(null);
	let hoveredItem: IItem | null = $state(null);
	let sortedPlayers = $derived.by(sortPlayers);
	let sortedLogs = $derived.by(sortLogs);
	let gameLogs = $derived(sortedLogs.filter((log) => log.type === 'game'));
	let completedGames = $derived(gameLogs.filter((log) => log.message.includes('Пройдено')).length);
	let droppedItems = $derived(gameLogs.filter((log) => log.message.includes('Дроп')).length);
	let otherLogs = $derived(sortedLogs.filter((log) => log.type === 'other'));

	function sortLogs() {
		if (!playerInfo) return [];

		const logsValues = Object.values(logs[playerInfo.id] || {});

		return logsValues.sort((a, b) => b.timestamp - a.timestamp);
	}

	function sortPlayers() {
		const sortedPlayersList = Object.values(players).sort((a, b) => {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		});

		return sortedPlayersList;
	}

	function onBannerClick(player: FirebasePlayer) {
		if (playerInfo?.id === player.id) {
			playerInfo = null;
		} else {
			playerInfo = player;
		}
	}
</script>

{#if hoveredItem}
	<div class="item-note-wrapper">
		<ItemNote {...hoveredItem} />
	</div>
{/if}

<div class="player-banners-wrapper" transition:fly={{ x: -100, duration: 300 }}>
	{#if players}
		{#each sortedPlayers as player}
			<div style="position: relative;">
				<PlayerBanner
					name={player.name}
					avatar={player.avatar}
					color={player.color}
					keys={player.keys}
					trophies={player.trophies}
					actionState={player.actionState}
					activationState={player.activationState}
					isOnline={player.isOnline}
					gameTitle={player.gameTitle}
					effects={player.effects}
					isSelected={playerInfo ? playerInfo.id === player.id : null}
					onclick={() => onBannerClick(player)}
				/>
				{#if player.effects}
					<div class="player-effects">
						{#each Object.entries(player.effects || {}) as [effectId, { duration }]}
							<EffectIcon {effectId} {duration} />
						{/each}
					</div>
				{/if}
			</div>
		{/each}
		{#if playerInfo}
			{#key playerInfo}
				<div class="player-info" transition:fade|global={{ duration: 300 }}>
					<div class="player-info-column">
						<span class="player-info-label">Инвентарь</span>
						<div class="player-info-items">
							{#each Object.entries(playerInfo.items || {}) as [id, { uses }] (id)}
								{@const item = itemManager.getItem(id)}

								{#if item}
									<Item
										{...item}
										{uses}
										onmouseover={() => (hoveredItem = item)}
										onmouseleave={() => (hoveredItem = null)}
									/>
								{/if}
							{/each}
						</div>
					</div>
					<div class="player-info-column">
						<span class="player-info-label">Игры</span>
						<div class="player-info-list">
							<div class="player-info-label" style="text-align: center;">
								Пройдено: {completedGames} Дропнуто: {droppedItems}
							</div>
							{#each gameLogs as log}
								<Log {...log} />
							{/each}
						</div>
					</div>
					<div class="player-info-column">
						<span class="player-info-label">События</span>
						<div class="player-info-list">
							{#each otherLogs as log}
								<Log {...log} />
							{/each}
						</div>
					</div>
				</div>
			{/key}
		{/if}
	{/if}
</div>

<style lang="scss">
	.player-info {
		position: absolute;
		left: 100%;
		display: flex;
		gap: 2rem;
		padding: 1rem;
		background-color: var(--surface-container-highest);
		border-radius: 0.5rem;
		box-shadow: var(--elevation-3);

		&-column {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.25rem;
		}

		&-label {
			font-weight: bold;
			color: var(--on-surface);
		}

		&-items {
			display: grid;
			grid-template-columns: repeat(4, 4.5rem);
			grid-template-rows: repeat(5, 4.5rem);
			gap: 0.25rem;
			color: var(--on-surface-variant);
		}

		&-list {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			color: var(--on-surface-variant);
			min-width: 20rem;
			max-height: 23rem;
			height: 100%;
			overflow: hidden scroll;
		}
	}

	.item-note-wrapper {
		position: absolute;
		bottom: 2.5rem;
		right: 2.5rem;
		z-index: 999;
		pointer-events: none;
	}

	.player-banners-wrapper {
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 998;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 1.25rem;
		width: 19rem;
	}

	.player-effects {
		position: absolute;
		top: 50%;
		left: calc(100% - 1rem);
		translate: 0 -50%;
		z-index: -1;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 2rem;
		align-items: center;
		gap: 0.5rem;
		padding: 0 1rem 0 2rem;
		border-radius: 0.5rem;
		height: 100%;
		box-shadow: var(--elevation-3);
		background-color: var(--surface-container-high);
	}
</style>
