<script lang="ts">
	let { data } = $props();

	let { sauces } = $derived(data);
</script>

<pre>{JSON.stringify(sauces, null, 2)}</pre>
