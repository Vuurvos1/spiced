<script lang="ts">
	let { data } = $props();

	let { stores } = $derived(data);
</script>

<ul>
	{#each stores as store}
		<li>
			<a href={`/stores/${store.name}`}>{store.name}</a>
		</li>
	{/each}
</ul>
