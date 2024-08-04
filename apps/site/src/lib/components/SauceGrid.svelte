<script lang="ts">
	import type { HotSauce } from '@app/db/types';

	interface Props {
		sauces: HotSauce[];
	}

	const { sauces = [] }: Props = $props();
</script>

{#snippet sauce(sauce: HotSauce)}
	<li>
		<!-- TODO: make relative? -->
		<a href="/sauces/{sauce.id}">
			<img src={sauce.imageUrl} alt="" />

			<h2 class="mb-2 text-xl font-semibold">{sauce.name}</h2>
			<p class="line-clamp-3">{sauce.description}</p>
		</a>
	</li>
{/snippet}

<ul class="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
	{#each sauces as s}
		{@render sauce(s)}
	{:else}
		<li>No sauces found</li>
	{/each}
</ul>
