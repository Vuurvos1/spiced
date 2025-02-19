<script lang="ts">
	let { data } = $props();

	let { store, sauces } = $derived(data);
</script>

<h1>
	<a href={store.url}>{store.name}</a>
</h1>

<p>{store.description}</p>

<div>
	<h2>Hot Sauces</h2>
	<ul>
		{#each sauces as hotSauce}
			<li>
				<a href={`/sauces/${hotSauce.sauce.sauceId}`}>{hotSauce.sauce.name}</a>
			</li>
		{/each}
	</ul>
</div>
