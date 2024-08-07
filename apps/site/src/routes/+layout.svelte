<script>
	import '../app.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header></Header>

	<main class="flex flex-1 flex-col py-4">
		{@render children()}
	</main>
</div>
