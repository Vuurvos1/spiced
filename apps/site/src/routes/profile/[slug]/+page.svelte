<script lang="ts">
	// TODO: svelte 5 ify
	export let data;

	$: ({ user } = data);
</script>

<pre>
  {JSON.stringify(user, null, 2)}
</pre>
