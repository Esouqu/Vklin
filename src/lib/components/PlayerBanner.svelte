<script lang="ts">
	import { fly } from 'svelte/transition';
	import KeyIcon from '~icons/mdi/key';
	import TrophyIcon from '~icons/mdi/trophy';
	import { PLAYER_ACTIVATION_STATE, PLAYER_ACTION_STATE } from '$lib/constants';
	import type GamePlayer from '$lib/gameEntities/GamePlayer.svelte';
	import placeholderImage from '$lib/assets/images/placeholder.png';
	import EffectIcon from './EffectIcon.svelte';

	interface Props extends Partial<GamePlayer> {
		placement: number;
		playersAmount: number;
	}

	const {
		name,
		avatar,
		keys,
		trophies,
		color,
		actionState,
		activationState,
		isOnline,
		game,
		effects,
		placement,
		isStunned,
		playersAmount
	}: Props = $props();

	let actionStateText = $derived.by(getBaseStateText);
	let activationStateText = $derived.by(getActivationStateText);

	function getActivationStateText() {
		switch (activationState) {
			case PLAYER_ACTIVATION_STATE.STARTING:
				return 'Готовится к Аукциону';
			case PLAYER_ACTIVATION_STATE.AUCTION:
				return 'Проводит Аукцион';
			case PLAYER_ACTIVATION_STATE.PLAYING:
				return `Играет в ${game?.name}`;
			case PLAYER_ACTIVATION_STATE.TAKING_REWARD:
				return 'Получает Награду';
		}
	}

	function getBaseStateText() {
		switch (actionState) {
			case PLAYER_ACTION_STATE.IDLE:
				return 'Бросает Кубик';
			case PLAYER_ACTION_STATE.MOVING:
				return 'Передвигается';
			case PLAYER_ACTION_STATE.ACTIVATING:
				return 'Активирует Клетку';
			case PLAYER_ACTION_STATE.USING_ITEM:
				return 'Использует Предмет';
		}
	}
</script>

<div
	class="player-banner border-2 border-muted"
	data-placement={placement}
	data-last={placement === playersAmount}
	style="--banner-color: {color};"
>
	<div
		class="player-banner-placement"
		data-placement={placement}
		data-last={placement === playersAmount}
	>
		{#if placement === playersAmount}
			<div class="text-background text-sm font-medium">Курьер Яндекс Еды</div>
		{:else}
			<div class="text-sm text-background font-medium">{placement}</div>
		{/if}
	</div>
	<div class="player-banner-avatar" class:online={isOnline}>
		<img src={avatar || placeholderImage} alt="Player avatar" />
	</div>
	<div class="pl-2">
		<p class="text-sm font-bold">{name}</p>
		<div class="grid items-center">
			{#key actionStateText || activationStateText}
				<p class="player-banner-state text-xs" transition:fly={{ x: -20 }}>
					{activationState !== PLAYER_ACTIVATION_STATE.NONE ? activationStateText : actionStateText}
				</p>
			{/key}
		</div>
	</div>
	<div class="player-banner-scores">
		<div class="player-banner-keys">
			<TrophyIcon width="1rem" height="1rem" />
			{#key trophies}
				<p class="tabular-nums text-sm" transition:fly={{ y: 30 }}>
					{trophies}
				</p>
			{/key}
		</div>
		<div class="player-banner-keys">
			<KeyIcon width="1rem" height="1rem" />
			{#key keys}
				<p class="tabular-nums text-sm" transition:fly={{ y: 30 }}>
					{keys}
				</p>
			{/key}
		</div>
	</div>

	{#if effects || isStunned}
		<div class="player-effects">
			{#each Object.entries(effects || {}) as [effectId, d]}
				{@const duration = d?.duration || -1}
				<EffectIcon {effectId} {duration} />
			{/each}
			{#if isStunned}
				<EffectIcon effectId="knockout" duration={1} />
			{/if}
		</div>
	{/if}
</div>

<style>
	.player-banner {
		position: relative;
		display: grid;
		grid-template-columns: 1.5rem 2.75rem 1fr auto;
		align-items: center;
		border-radius: 0.5rem;
		width: 19rem;
		text-align: start;
		background-color: var(--surface-container-highest);
		box-shadow: var(--elevation-3);
		opacity: 1;
		/* transition: border-color 0.2s; */
		user-select: none;
		cursor: pointer;

		&[data-last='true'] {
			margin-top: 1.25rem;
			grid-template-columns: 2.75rem 1fr auto;
			border: 0.25rem solid #fdd835;
			border-radius: 0 0 0.5rem 0.5rem;

			& .player-banner-avatar {
				border-radius: 0 0 0 0.5rem;
				overflow: hidden;
			}
		}

		&::before {
			border-radius: 0 0 0.5rem 0.5rem;
		}

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
			border-radius: 0.5rem;
			width: 100%;
			height: 100%;
			opacity: 0.5;
			background-image: linear-gradient(to right, var(--banner-color), transparent);
			transition: 0.3s;
		}

		&:hover {
			border-color: white;
		}

		.player-banner-placement {
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 0.35rem 0 0 0.35rem;
			height: 100%;
			color: var(--on-inverse-surface);
			background-color: #a6a6a6;

			&[data-placement='1'] {
				background-color: #fdd835;
			}
			&[data-placement='2'] {
				background-color: #e0e0e0;
			}
			&[data-placement='3'] {
				background-color: #cd7f32;
			}
			&[data-last='true'] {
				position: absolute;
				display: flex;
				bottom: calc(100% + 0.25rem);
				left: -0.25rem;
				width: calc(100% + 0.25rem * 2);
				height: auto;
				border-radius: 0.5rem 0.5rem 0 0;
				background-color: #fdd835;
			}
		}

		.player-banner-state {
			grid-area: 1 / 1;
			margin: 0;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.player-banner-avatar {
			position: relative;
			z-index: 1;
			display: flex;

			&.online {
				&::after {
					background-color: springgreen;
				}
			}
			&::after {
				content: '';
				position: absolute;
				bottom: 0.25rem;
				right: 0.25rem;
				z-index: 1;
				outline: 0.125rem solid black;
				border-radius: 50%;
				width: 0.5rem;
				height: 0.5rem;
				background-color: crimson;
			}

			& img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				aspect-ratio: 1 / 1;
			}
		}

		.player-banner-scores {
			display: flex;
			flex-direction: column;
		}

		.player-banner-keys {
			display: grid;
			align-items: center;
			gap: 6px;

			& p {
				grid-area: 1 / 2;
				min-width: 2.25rem;
			}
		}
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
		padding: 0 1rem 0 1.5rem;
		border-radius: 0.5rem;
		height: 100%;
	}
</style>
