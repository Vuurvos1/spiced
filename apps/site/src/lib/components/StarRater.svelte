<script lang="ts">
	interface Props {
		rating: number;
	}

	// let { rating }: Props = $props();

	// let starRating = $derived(Math.round(rating / 2) * 2);

	// function getStarFillAmount(i: number) {
	// 	if (starRating >= i * 2) {
	// 		return '100%';
	// 	}

	// 	if (starRating % 2 === 1 && starRating === i * 2 - 1) {
	// 		return '50%';
	// 	}

	// 	return '0%';
	// }
</script>

<fieldset class="star-rating">
	<legend>Your rating:</legend>
	<div class="flex flex-row gap-2">
		{#each { length: 5 } as _, i}
			<input class="sr-only" type="radio" name="rating" value={i + 1} id="rating{i}" />
			<label for="rating{i}">
				<span class="sr-only">{i + 1}</span>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-star"
				>
					<!-- clip path -->

					<clipPath id="star-clip">
						<polygon
							points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
						/>
					</clipPath>

					<rect
						x="0"
						y="0"
						width="100%"
						height="100%"
						fill="currentColor"
						clip-path="url(#star-clip)"
					></rect>

					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
					/>
				</svg>
			</label>
		{/each}
	</div>
</fieldset>

<style lang="postcss">
	input:checked + label {
		color: blue;
	}
</style>
