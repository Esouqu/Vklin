<script lang="ts">
	import { onMount } from 'svelte';
	import { Card } from './ui/card';
	import { getNoun } from '$lib/utils';
	import { DateTime } from 'luxon';

	const targetDate = DateTime.fromISO('2025-02-28T18:00:00', { zone: 'Europe/Moscow' });
	let timeRemaining = calculateTimeRemaining(targetDate);

	function calculateTimeRemaining(endDate: DateTime<true> | DateTime<false>) {
		const total = Date.parse(endDate.toString()) - Date.parse(new Date().toString());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
		const days = Math.floor(total / (1000 * 60 * 60 * 24));

		return {
			total,
			days: getNoun(days, ['день', 'дня', 'дней']),
			hours: getNoun(hours, ['час', 'часа', 'часов']),
			minutes: getNoun(minutes, ['минута', 'минуту', 'минут']),
			seconds: getNoun(seconds, ['секунда', 'секунды', 'секунд'])
		};
	}

	function startCountdown() {
		const interval = setInterval(() => {
			timeRemaining = calculateTimeRemaining(targetDate);
			if (timeRemaining.total <= 0) {
				clearInterval(interval);
			}
		}, 1000);
	}

	onMount(() => {
		startCountdown();
	});
</script>

<div class="absolute top-4 left-1/2 translate-x-[-50%]">
	<Card class="flex p-2">
		<div>
			Ивент закончится через <b
				>{timeRemaining.days}
				{timeRemaining.hours}
				{timeRemaining.minutes}
			</b>
			по мск
		</div>
	</Card>
</div>
