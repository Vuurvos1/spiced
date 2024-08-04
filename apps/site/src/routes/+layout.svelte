<script>
	import '../app.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header></Header>

	<main class="flex-1 py-4">
		{@render children()}
	</main>
</div>
