<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import TextInput from '$lib/components/form/TextInput.svelte';

	export let form;
</script>

<section class="mb-12 grid flex-1 place-items-center">
	<div class="container max-w-xl">
		<h2 class="h3">Reset password</h2>

		<form class="flex flex-col gap-4" method="POST" action="?/resetPassword" use:enhance>
			<TextInput label="Password" name="password" id="password" type="password" required
			></TextInput>

			<TextInput
				label="Confirm password"
				name="confirmPassword"
				id="confirmPassword"
				type="password"
				required
			></TextInput>

			<input type="hidden" name="token" value={$page.url.searchParams.get('token')} />

			<button class="btn" type="submit">Submit</button>
		</form>
	</div>
</section>

{#if form?.message}
	<p>{form.message}</p>
{/if}
