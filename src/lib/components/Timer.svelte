<script lang="ts">
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';

	const targetDate = DateTime.fromISO('2025-02-28T18:00:00', { zone: 'Europe/Moscow' });
	let timeRemaining = $state(calculateTimeRemaining(targetDate));

	function calculateTimeRemaining(endDate: DateTime<true> | DateTime<false>) {
		const total = Date.parse(endDate.toString()) - Date.parse(new Date().toString());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
		const days = Math.floor(total / (1000 * 60 * 60 * 24));

		return {
			total,
			hours: hours + Math.floor(days * 24),
			minutes: minutes,
			seconds: seconds
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

<div class="grid absolute grid-cols-[14rem] top-2 left-1/2 translate-x-[-50%] w-fit font-medium">
	<div class="col-start-1 row-start-1">
		<img
			src="https://enter-media.org/upload/iblock/147/147432ef60155b033bd722770a4a854d.png"
			alt="timer bg"
		/>
	</div>
	<div class="col-start-1 row-start-1 flex flex-col items-center justify-center">
		{#if timeRemaining.total <= 0}
			<p class="text-lg uppercase text-red-500">Ивент окончен</p>
		{:else}
			<b class="text-red-500 text-5xl font-[DIGI]">
				{`${timeRemaining.hours.toString().padStart(2, '0')}:${timeRemaining.minutes.toString().padStart(2, '0')}:${timeRemaining.seconds.toString().padStart(2, '0')}`}
			</b>
		{/if}
	</div>
	<div class="col-start-1 row-start-1">
		<img
			src="https://enter-media.org/upload/iblock/d66/d663c91251e0f1e88dfbc94f1a1205f4.png"
			alt="timer foreground"
		/>
	</div>
</div>
