<script lang="ts">
	import mapController from '$lib/GameController.svelte';
	import PlayerBanner from './PlayerBanner.svelte';
	import type GamePlayer from '$lib/gameEntities/GamePlayer.svelte';
	import PlayerInfo from './PlayerInfo.svelte';
	import gameLogs from '$lib/stores/gameLogs';
	import { flip } from 'svelte/animate';
	import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

	let playerInfo: GamePlayer | null = $state(null);

	let sortedPlayers = $derived.by(sortPlayers);

	function sortPlayers() {
		const players = Object.values(mapController.gamePlayers);

		const sortedPlayersList = players.sort((a, b) => {
			if (a.trophies !== b.trophies) {
				return b.trophies - a.trophies;
			} else if (a.keys !== b.keys) {
				return b.keys - a.keys;
			} else {
				return a.name.localeCompare(b.name);
			}
		});

		return sortedPlayersList;
	}

	function onBannerClick(player: GamePlayer) {
		playerInfo = player;
	}
</script>

<div class="absolute top-4 left-4 gap-2 flex flex-col z-50">
	{#if mapController.gamePlayers}
		{#each sortedPlayers as player, idx (player.id)}
			<div style="position: relative;" animate:flip={{ duration: 300 }}>
				<Dialog>
					<DialogTrigger onclick={() => onBannerClick(player)}>
						<PlayerBanner
							name={player.name}
							avatar={player.avatar}
							color={player.color}
							keys={player.keys}
							trophies={player.trophies}
							actionState={player.actionState}
							activationState={player.activationState}
							isOnline={player.isOnline}
							game={player.game}
							effects={player.effects}
							isStunned={player.isStunned}
							placement={idx + 1}
							playersAmount={sortedPlayers.length}
						/>
					</DialogTrigger>
					<DialogContent
						class="max-w-[unset] w-min p-0"
						onOpenAutoFocus={(e) => e.preventDefault()}
						onCloseAutoFocus={(e) => e.preventDefault()}
					>
						{#if playerInfo}
							<PlayerInfo player={playerInfo} logs={$gameLogs?.[playerInfo.id] || {}} />
						{/if}
					</DialogContent>
				</Dialog>
			</div>
		{/each}
	{/if}
</div>
