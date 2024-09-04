<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Search } from '@o7/icon/lucide';

	let search = $state($page.url.searchParams.get('search') || '');

	let {
		data: { session }
	} = $derived($page);
</script>

<header class="sticky top-0">
	<nav class="bg-neutral-950 py-4 text-white">
		<ul class="container flex flex-row items-center gap-4 font-medium md:grid md:grid-cols-4">
			<li>
				<a class="font-logo gap flex flex-row items-center gap-2.5 text-2xl" href="/sauces">
					<svg class="size-8" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M80 340.315c0-49.502 18.99-82.698 42.008-103.081-4.028 8.736-8.172 28.537-5.179 36.107 1.151 2.912 8.404.066 16.688-12.229 5.174-7.679 9.933-22.261 15.023-37.854 3.403-10.424 6.953-21.3 10.872-30.867 8.508-20.766 31.075-65.809 37.405-65.809 1.268 0 1.635 2.265 2.179 5.627.937 5.79 2.401 14.833 9.906 21.162 6.905 5.824 13.235 9.73 18.415 7.571 5.179-2.158 24.232-55.829 27.621-82.697 5.075-40.226-1.348-62.214-4.198-71.971-1.028-3.522-1.592-5.45-.981-6.068 2.302-2.33 25.665 15.724 33.952 22.713 10.358 8.735 28.773 25.624 37.405 57.073 4.489 16.356 5.346 34.13 6.134 50.454.726 15.063 1.393 28.891 4.799 39.232.961 2.916 1.869 5.803 2.751 8.605v.001c5.188 16.49 9.449 30.032 17.966 29.249 7.348-.676 9.424-23.45 10.934-40.023.856-9.383 1.53-16.778 2.877-17.05 2.307-.467 4.812 4.98 8.729 13.497 2.409 5.237 5.351 11.636 9.11 18.533.986 1.811 1.998 3.661 3.027 5.546 12.813 23.446 28.468 52.096 34.953 73.658 10.683 35.525 17.604 92.287-8.056 146.759-15.965 33.889-45.103 72.045-89.196 93.177v-76.87c0-14.559-4.719-22.946-9.783-28.537-6.906-7.623-13.811-18.636-16.113-28.536-1.841-7.92-5.562-64.256-7.481-96.092H238.25c-1.918 31.836-5.639 88.172-7.481 96.092-2.302 9.9-9.207 20.913-16.112 28.537-5.064 5.59-9.783 13.977-9.783 28.536V512C123.625 490.253 80 412.482 80 340.315Zm151.345-96.675c0-12.23 6.33-18.636 6.33-18.636h54.668s6.33 4.659 6.33 18.636c0 12.23-6.33 18.636-6.33 18.636h-54.668s-6.33-4.659-6.33-18.636Z"
							fill="#CC1E28"
						/>
					</svg>
					<span class="-mb-1 leading-none">Sauced</span>
				</a>
			</li>

			<li class="md:col-span-2">
				<form method="post" data-sveltekit-keepfocus action="?/search" use:enhance>
					<label
						class="relative mx-auto flex w-full max-w-lg flex-row items-center text-base text-black"
					>
						<input
							bind:value={search}
							class="w-full rounded-full bg-white py-1.5 pl-4 pr-12 focus:outline-none"
							placeholder="Search sauces"
							name="search"
							type="text"
						/>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
							<Search size="20"></Search>
						</div>
					</label>
				</form>
			</li>

			<li class="ml-auto">
				{#if session}
					<a href="/profile">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg
						>
					</a>
				{:else}
					<a href="/login">login</a>
				{/if}
			</li>
		</ul>
	</nav>
</header>
