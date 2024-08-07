<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<section class="grid h-full flex-1 place-items-center">
	<div class="pb-20">
		<h1 class="h1 mb-4">Sign in</h1>
		<form method="post" use:enhance>
			<label class="label mb-2 block" for="username">Username</label>
			<input class="input mb-4" name="username" id="username" /><br />

			<label class="label mb-2 block" for="password">Password</label>
			<input class="input mb-4" type="password" name="password" id="password" /><br />

			<button class="btn ml-auto block">Continue</button>
			<p>{form?.message ?? ''}</p>
		</form>
		<a class="hover:underline" href="/signup">Create an account</a>
	</div>
</section>
