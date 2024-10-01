<script lang="ts">
	import { enhance } from '$app/forms';
	import { BeamAvatar } from '@app/boring-avatars';
	import dayjs from '$lib/dayjs';
	import StarRating from '$lib/components/StarRating.svelte';
	import StarRater from '$lib/components/StarRater.svelte';
	import { ListPlus, ListMinus, Check } from '@o7/icon/lucide';

	let { data } = $props();

	let { sauce, session, user, checkedin, wishlisted } = $derived(data);
	let reviews = $state(data.reviews);
</script>

<div class="container">
	<section class="mb-12 grid gap-4 md:grid-cols-5">
		<img class="object-contain md:col-span-3" src={sauce.imageUrl} alt={sauce.name} />

		<div class="md:col-span-2">
			<h1 class="h1 mb-3">{sauce.name}</h1>

			<p class="mb-5 text-gray-500">{sauce.description}</p>

			{#if session}
				<div class="flex flex-row gap-6">
					<!-- TODO: error handle -->
					<form method="post" action="?/wishlist" use:enhance>
						<input type="hidden" name="wishlist" value={!wishlisted} />

						<button type="submit" class="btn">
							{#if wishlisted}
								<ListMinus size={20}></ListMinus>
							{:else}
								<ListPlus size={20}></ListPlus>
							{/if}
							{wishlisted ? 'Remove' : 'Add'} to Wishlist
						</button>
					</form>

					<form method="post" action="?/checkIn" use:enhance>
						<input type="hidden" name="checkin" value={!checkedin} />

						<button type="submit" class="btn">
							<Check class={`${checkedin ? 'text-green-500' : ''}`} size={20}></Check>
							{checkedin ? 'Checked-in' : 'Check-in'}
						</button>
					</form>
				</div>
			{/if}
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-3xl font-semibold">Reviews</h2>

		<!-- TODO: maybe put this into a modal with shallow routing? -->
		{#if session}
			<form
				class="mb-12"
				method="post"
				action="?/review"
				use:enhance={({ formData }) => {
					if (!user) return () => {};

					const baseReviews = structuredClone(data.reviews);

					const index = reviews.findIndex((review) => review.review.userId === session.userId);

					const newRating = Number(formData.get('rating'));
					const newReview = formData.get('content') as string;

					if (index !== -1) {
						if (newRating && newReview) {
							const review = reviews[index].review;
							review.rating = newRating;
							review.reviewText = newReview;
						}
					} else {
						reviews.unshift({
							username: user.username,
							// @ts-expect-error - only needed fields
							review: {
								rating: newRating,
								reviewText: newReview,
								createdAt: new Date()
							}
						});
					}

					return ({ result }) => {
						if (result.type !== 'success') {
							// reset
							console.error('Failed to submit review', result);
							data.reviews = baseReviews;
						}
					};
				}}
			>
				<div class="flex max-w-md flex-col gap-4">
					<!-- rating slider -->
					<StarRater></StarRater>

					<!-- comment -->
					<label for="content">Review</label>
					<textarea class="resize-none rounded border" name="content" rows="4" cols="50"></textarea>

					<button type="submit" class="btn">Submit Review</button>
				</div>
			</form>
		{/if}

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
