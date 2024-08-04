<script lang="ts">
	import { page } from '$app/stores';
	import SauceGrid from '$lib/components/SauceGrid.svelte';

	let { data } = $props();

	let { sauces, sauceCount, pageSize } = $derived(data);

	const currentPage = $derived(Math.max(Number($page.url.searchParams.get('page')) || 0, 0));
</script>

<div class="container">
	<h1 class="text-4xl font-semibold">Sauces</h1>

	<p class="text-gray-500">Showing {sauceCount} sauces</p>

	<SauceGrid {sauces}></SauceGrid>

	<div class="flex flex-row justify-end gap-6 py-4">
		<a
			href={`/sauces?page=${currentPage - 1}`}
			class={`${currentPage < 1 ? 'pointer-events-none cursor-not-allowed opacity-70' : ''}`}
		>
			Prev
		</a>

		<span>
			{currentPage}
		</span>

		<a
			href={`/sauces?page=${currentPage + 1}`}
			class={`${currentPage > Math.ceil(sauceCount / pageSize) - 2 ? 'pointer-events-none cursor-not-allowed opacity-70' : ''}`}
		>
			Next
		</a>
	</div>
</div>
