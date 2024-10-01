<script lang="ts">
	import { BeamAvatar } from '@app/boring-avatars';
	import { page } from '$app/stores';

	let { data } = $props();

	let { user, session, checkedSauces } = $derived(data);
</script>

<section class="pb-12">
	<div class="container flex flex-col items-center gap-4">
		<BeamAvatar size={128} name={user.username}></BeamAvatar>

		<h1 class="h1">{user.username}</h1>

		<a href={`/profile/${$page.params.slug}/wishlist`}>wishlist</a>

		{#if session?.userId === user.id}
			<form method="post" action="/?/logout">
				<button type="submit">Logout</button>
			</form>
		{/if}
	</div>
</section>

<section>
	<div class="container">
		<h2 class="h2 mb-5">Check-ins</h2>

		{#if checkedSauces.length > 0}
			<ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each checkedSauces as sauce}
					<li>
						<a href={`/sauces/${sauce.id}`}>
							<img src={sauce?.imageUrl} alt={sauce.name} />

							<h3 class="h3">
								{sauce.name}
							</h3>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No check-ins yet.</p>
		{/if}
	</div>
</section>
