<script lang="ts">
	import type { FirebaseLog } from '../interfaces';

	interface Props extends FirebaseLog {
		isUsernameShown?: boolean;
	}

	let { message, timestamp, username, isUsernameShown = false }: Props = $props();

	let localDate = $derived(
		new Date(timestamp).toLocaleString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	);
</script>

<div class="log">
	<div class="log-message">
		{#if isUsernameShown}
			<p class="log-username">{username}</p>
		{/if}
		<p>{message}</p>
	</div>
	<p class="log-date">{localDate}</p>
</div>

<style lang="scss">
	.log {
		padding: 0.5rem 0.5rem;
		border-radius: 0.5rem;
		white-space: pre-wrap;
		color: var(--on-surface-variant);
		background-color: var(--surface-container-high);

		&-message {
			display: flex;
			flex-direction: column;
		}
		&-date {
			font-size: 0.8rem;
			color: #a4a4a4;
		}

		&-username {
			font-size: 1rem;
			font-weight: 600;
		}

		& p {
			margin: 0;
		}
	}
</style>
