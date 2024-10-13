<div class="circle-wrapper">
	<div class="circle"></div>
</div>

<style lang="scss">
	.circle {
		height: var(--spinner-size, 25px);
		width: var(--spinner-size, 25px);
		border-color: var(--primary) var(--primary) var(--primary) transparent;
		border-width: var(--spinner-weight, 5px);
		border-style: solid;
		border-image: initial;
		border-radius: 50%;
		animation: 1s linear 0s infinite normal none running rotate;

		&-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
