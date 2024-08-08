<script lang="ts">
	import { enhance } from '$app/forms';
	import { BeamAvatar } from '@app/boring-avatars';
	import dayjs from '$lib/dayjs';
	import StarRating from '$lib/components/StarRating.svelte';
	import StarRater from '$lib/components/StarRater.svelte';

	let { data } = $props();

	let { sauce, reviews } = $derived(data);
</script>

<div class="container">
	<section class="mb-12 grid gap-4 md:grid-cols-5">
		<img class="md:col-span-3" src={sauce.imageUrl} alt="" />

		<div class="md:col-span-2">
			<h1 class="mb-3 text-4xl font-semibold">{sauce.name}</h1>

			<p class="mb-5 text-gray-500">{sauce.description}</p>

			<div class="flex flex-row gap-6">
				<!-- TODO: if logged in -->
				<!-- TODO: add/remove from withlist text -->
				<!-- TODO: error handle -->
				<form method="post" action="?/addWishlist" use:enhance>
					<button type="submit" class="rounded bg-blue-400 px-2 py-2">Add Wishlist +</button>
				</form>

				<button class="rounded bg-blue-400 px-2 py-2">Check in</button>
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-3xl font-semibold">Reviews</h2>

		<!-- TODO: maybe put this into a modal with shallow routing? -->
		<form class="mb-12" method="post" action="?/review" use:enhance>
			<div class="flex max-w-md flex-col gap-4">
				<!-- rating slider -->
				<StarRater></StarRater>

				<!-- comment -->
				<label for="content">Review</label>
				<textarea class="resize-none rounded border" name="content" rows="4" cols="50"></textarea>

				<button
					type="submit"
					class="rounded bg-blue-500 px-3 py-2 font-semibold text-white hover:bg-blue-700"
				>
					Submit Review
				</button>
			</div>
		</form>

		{#if reviews.length === 0}
			<p>No reviews yet.</p>
		{:else}
			<ul class="flex flex-col divide-y">
				{#each reviews as review}
					<li class="py-4 first:pt-0 last:pb-0">
						<div class="mb-3 flex flex-row items-center gap-4">
							<BeamAvatar name={review.username ?? ''}></BeamAvatar>

							<div class="flex flex-col">
								<span>
									<!-- TODO: change into date/time element? -->
									{dayjs(review.review.createdAt).format('MMMM D, YYYY')}
								</span>
								{#if review.username}
									<a href={`/profile/${review.username}`}>{review.username}</a>
								{/if}
							</div>
						</div>

						<div class="mb-3 flex flex-row items-center gap-2">
							<StarRating rating={review.review?.rating ?? 0}></StarRating>

							<span class="ml-2">({review.review.rating?.toFixed(1)})</span>
						</div>

						<p>{review.review.reviewText}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
