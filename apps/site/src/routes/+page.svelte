<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<section class="py-6">
	<div class="container">
		<h1 class="h1">Recent Activity</h1>

		<p>Not implemented :(</p>
	</div>
</section>

<section>
	<div class="container">
		<form method="post" use:enhance>
			<button>Sign out</button>
		</form>
	</div>
</section>

<!-- TODO: show timeline -->

<!-- Or do like a category browse thing, and trending sauces -->
