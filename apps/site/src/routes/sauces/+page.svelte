<script lang="ts">
	import { page } from '$app/stores';
	import SauceGrid from '$lib/components/SauceGrid.svelte';

	let { data } = $props();

	let { sauces, sauceCount, pageSize } = $derived(data);

	const currentPage = $derived(Math.max(Number($page.url.searchParams.get('page')) || 1, 1));

	let search = $state($page.url.searchParams.get('search') || '');

	const previousUrl = $derived.by(() => {
		const url = new URL($page.url);
		url.searchParams.set('page', String(currentPage - 1));
		return url.toString();
	});

	const nextUrl = $derived.by(() => {
		const url = new URL($page.url);
		url.searchParams.set('page', String(currentPage + 1));
		return url.toString();
	});
</script>

<div class="container">
	<div class="flex flex-row items-center justify-between">
		<div>
			<h1 class="text-4xl font-semibold">Sauces</h1>

			<p class="text-gray-500">Showing {sauceCount} sauces</p>
		</div>

		<form data-sveltekit-keepfocus>
			<input bind:value={search} placeholder="Search" type="text" name="search" />
		</form>
	</div>

	<SauceGrid {sauces}></SauceGrid>

	<div class="flex flex-row justify-end gap-6 py-4">
		<a
			href={previousUrl}
			class={currentPage < 2 ? 'pointer-events-none cursor-not-allowed opacity-70' : ''}
		>
			Prev
		</a>

		<span>
			{currentPage}
		</span>

		<a
			href={nextUrl}
			class={currentPage > Math.ceil(sauceCount / pageSize) - 1
				? 'pointer-events-none cursor-not-allowed opacity-70'
				: ''}
		>
			Next
		</a>
	</div>
</div>
