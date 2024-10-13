<script lang="ts">
	import type { LocationsCollection, LocationType } from '$lib/interfaces';
	import { getLocationColor } from '$lib/utils';
	import HexagonIcon from '~icons/mdi/hexagon-outline';
	import Accordion from '$lib/components/Accordion.svelte';

	interface Props {
		locations: LocationsCollection;
	}

	const { locations }: Props = $props();

	const locationTypes = $derived.by(getLegendOptions);

	function getLocationTypes() {
		return [...new Set(Object.values(locations).map((location) => location.type))];
	}

	function getTypeDescription(type: LocationType) {
		switch (type) {
			case 'key':
				return '+5 Ключей';
			case 'chest':
				return 'Получение случайного предмета';
			case 'drain':
				return 'Может быть захвачена.\nПередает владельцу клетки 5 Ключей от наступившего на клетку';
			case 'skull':
				return '-10 Ключей';
			case 'exclamation':
				return 'Получение случайного особого предмета';
			case 'start':
				return 'Старт';
		}
	}

	function getLegendOptions() {
		const types = getLocationTypes();

		return types.map((type) => ({
			color: getLocationColor(type),
			description: getTypeDescription(type)
		}));
	}
</script>

<div class="legend">
	<Accordion title="Описание Клеток" isInverse={true}>
		{#each locationTypes as { color, description }}
			<div class="legend-item">
				<div class="legend-icon">
					<HexagonIcon font-size="2rem" {color} />
				</div>
				<div>{description}</div>
			</div>
		{/each}
	</Accordion>
</div>

<style lang="scss">
	.legend {
		position: absolute;
		left: 2.5rem;
		bottom: 2.5rem;
		width: 19rem;

		&-item {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			border-radius: 0.5rem;
			padding: 0.5rem;

			color: var(--on-surface-variant);
			background-color: var(--surface-container-high);
		}
	}
</style>
