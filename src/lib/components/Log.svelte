<script lang="ts">
	import type { FirebaseLog } from '$lib/interfaces';
	import itemManager from '$lib/ItemManager';
	import gameController from '$lib/GameController.svelte';
	import { getLocalTime, getNoun } from '$lib/utils';
	import Item from './Item.svelte';
	import TrophyIcon from '~icons/mdi/trophy';
	import RemoveIcon from '~icons/mdi/remove-circle';
	import CheckIcon from '~icons/mdi/checkCircle';
	import ArrowIcon from '~icons/mdi/arrowRight';
	import TreasureIcon from '~icons/mdi/treasureChest';
	import HookIcon from '~icons/mdi/hook';
	import KeyIcon from '~icons/mdi/key';
	import RefreshIcon from '~icons/mdi/refresh';

	interface Props {
		log: FirebaseLog;
		isCompact?: boolean;
	}

	const { log, isCompact }: Props = $props();

	const { Icon, title } = $derived.by(getActionData);
	const localDate = $derived.by(() => getLocalTime(log.timestamp));
	const itemAction = $derived.by(getItemAction);
	const logOwner = $derived(gameController.getPlayerById(log.playerId));

	function getPlayers(ids: string[]) {
		return ids.map((id) => gameController.getPlayerById(id));
	}

	function getItemAction() {
		if (log.type !== 'item') return;

		const item = itemManager.getItem(log.data.itemId);

		if (!item) throw new Error('Item not found');

		if (log.data.itemTargetIds) {
			const players = log.data.itemTargetType === 'player' && getPlayers(log.data.itemTargetIds);

			return {
				item,
				targets: players
			};
		} else {
			return {
				item
			};
		}
	}

	function getActionData() {
		switch (log.type) {
			case 'key': {
				if (log.data.keyAction === 'gained') {
					return {
						title: `Получает ${getNoun(log.data.keyAmount, ['ключ', 'ключа', 'ключей'])}`,
						Icon: KeyIcon
					};
				}
				if (log.data.keyAction === 'lost') {
					return {
						title: `Теряет ${getNoun(log.data.keyAmount, ['ключ', 'ключа', 'ключей'])}`,
						Icon: KeyIcon
					};
				}
				return {
					title: '',
					Icon: null
				};
			}
			case 'game': {
				return {
					title: log.data.name,
					Icon:
						log.data.status === 'completed'
							? CheckIcon
							: log.data.status === 'rerolled'
								? RefreshIcon
								: RemoveIcon
				};
			}
			case 'item': {
				if (log.data.itemAction === 'used') {
					return {
						title: 'Использует предмет',
						Icon: ArrowIcon
					};
				}
				if (log.data.itemAction === 'received') {
					return {
						title: 'Получает предмет',
						Icon: TreasureIcon
					};
				}
				if (log.data.itemAction === 'trapped') {
					return {
						title: 'Попадает в ловушку',
						Icon: HookIcon
					};
				}
			}
			case 'trophy': {
				return {
					title: 'Получает трофей',
					Icon: TrophyIcon
				};
			}
			default: {
				return {
					title: '',
					Icon: null
				};
			}
		}
	}
</script>

{#if isCompact}
	<div
		class="flex gap-2 items-center bg-background bg-opacity-50 border px-4 py-2 rounded-md"
		style="--log-color: {logOwner?.color};"
	>
		<div class="z-10 leading-6 font-medium" style="color: var(--log-color);">{logOwner?.name}</div>
		<div>
			<Icon width="1.25rem" height="1.25rem" color="var(--on-surface)" />
		</div>

		{#if log.type === 'key'}
			<div class="z-10 flex gap-1">
				<div class="z-10 leading-6 font-medium">
					{log.data.keyAction === 'lost' ? '-' : '+'}{log.data.keyAmount}
				</div>
			</div>
		{/if}

		{#if log.type === 'item' && itemAction}
			<div class="flex items-center gap-2">
				{#if itemAction.item}
					<div>
						<Item {...itemAction.item} size="2.5rem" />
					</div>
				{/if}
				{#if itemAction.targets}
					<div class="log-item-targets">
						на {itemAction.targets.map((t) => t?.name).join(', ')}
					</div>
				{/if}
			</div>
		{/if}

		{#if log.type === 'game'}
			<div class="z-10 flex gap-1">
				<div class="z-10 leading-6 font-medium">{title}</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="bg-background bg-opacity-50 border p-4 rounded-md">
		<div class="leading-6 font-medium">{title}</div>
		{#if itemAction}
			<div class="flex items-center gap-2 my-2">
				{#if itemAction.item}
					<Item {...itemAction.item} size="2.5rem" />
				{/if}
				{#if itemAction.targets}
					<div class="text-sm">
						на {itemAction.targets.map((t) => t?.name).join(', ')}
					</div>
				{/if}
			</div>
		{/if}

		<div class="text-xs text-muted-foreground">{localDate}</div>
	</div>
{/if}
