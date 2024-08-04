<script lang="ts">
	import type { HotSauce } from '@app/db/types';

	interface Props {
		sauces: HotSauce[];
	}

	const { sauces = [] }: Props = $props();
</script>

{#snippet sauce(sauce: HotSauce)}
	<li>
		<h2>{sauce.name}</h2>
		<p>{sauce.description}</p>
	</li>
{/snippet}

<ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each sauces as s}
		{@render sauce(s)}
	{:else}
		<li>No sauces found</li>
	{/each}
</ul>
