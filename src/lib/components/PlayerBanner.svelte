<script lang="ts">
	import { fly } from 'svelte/transition';
	import KeyIcon from '~icons/mdi/key';
	import TrophyIcon from '~icons/mdi/trophy';
	import type { FirebasePlayer } from '$lib/interfaces';
	import { PLAYER_ACTION_STATE, PLAYER_ACTIVATION_STATE } from '$lib/constants';
	import placeholderImage from '$lib/assets/images/placeholder.png';

	interface Props extends Partial<FirebasePlayer> {
		isSelected: boolean | null;
		onclick?: ((e: MouseEvent) => void) | null;
	}

	const {
		name,
		keys,
		trophies,
		color,
		actionState,
		activationState,
		isOnline,
		gameTitle,
		avatar,
		isSelected,
		onclick
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
				return `Играет в ${gameTitle}`;
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
	class="player-banner"
	class:selected={isSelected}
	class:active={isSelected === null}
	class:online={isOnline}
	style="--banner-color: {color};"
	aria-hidden="true"
	{onclick}
>
	<div class="player-banner-avatar">
		<img src={avatar || placeholderImage} alt="Player avatar" />
	</div>
	<div class="player-banner-info">
		<div class="player-banner-name-wrapper">
			<p class="player-banner-name">{name}</p>
			<div style="display: grid; align-items: center;">
				{#key actionStateText || activationStateText}
					<p class="player-banner-state" transition:fly={{ x: -20 }}>
						{activationState !== PLAYER_ACTIVATION_STATE.NONE
							? activationStateText
							: actionStateText}
					</p>
				{/key}
			</div>
		</div>
		<div class="player-banner-scores">
			<div class="player-banner-keys">
				<TrophyIcon width="1.25rem" height="1.25rem" />
				{#key trophies}
					<p style="margin: 0; font-variant-numeric: tabular-nums;" transition:fly={{ y: 30 }}>
						{trophies}
					</p>
				{/key}
			</div>
			<div class="player-banner-keys">
				<KeyIcon width="1.25rem" height="1.25rem" />
				{#key keys}
					<p style="margin: 0; font-variant-numeric: tabular-nums;" transition:fly={{ y: 30 }}>
						{keys}
					</p>
				{/key}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.player-banner {
		position: relative;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		border-left: 0.2rem solid red;
		border-radius: 0.5rem;
		background-color: var(--surface-container-highest);
		box-shadow: var(--elevation-3);
		opacity: 1;
		transition: opacity 0.3s;
		overflow: hidden;
		cursor: pointer;

		&:not(.active):not(.selected) {
			opacity: 0.5;
		}

		&.selected {
			opacity: 1;

			&::before {
				translate: 0 0;
			}
		}

		&.online {
			border-color: springgreen;
		}

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			translate: -25% 0;
			z-index: 0;
			border-radius: 0.5rem;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(to right, var(--banner-color), transparent 100%);
			transition: 0.3s;
		}

		&:hover {
			opacity: 1;

			&::before {
				translate: 0 0;
			}
		}

		&-state {
			grid-area: 1 / 1;
			margin: 0;
			font-size: 0.75rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		&-name {
			margin: 0;
			font-weight: 600;
			line-height: 1.25rem;

			&-wrapper {
				display: grid;
				grid-template-rows: 1.25rem 1.25rem;
			}
		}

		&-info {
			z-index: 1;
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: space-between;
			color: white;
		}

		&-avatar {
			position: relative;
			z-index: 1;
			display: flex;
			height: 2.75rem;
			border-radius: 50%;
			overflow: hidden;

			& img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				aspect-ratio: 1 / 1;
			}
		}

		&-scores {
			display: flex;
			flex-direction: column;
		}

		&-keys {
			display: grid;
			align-items: center;
			gap: 6px;

			& p {
				grid-area: 1 / 2;
				min-width: 2.25rem;
			}
		}
	}
</style>
