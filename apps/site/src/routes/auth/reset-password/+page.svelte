<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import TextInput from '$lib/components/form/TextInput.svelte';

	export let form;
</script>

<section class="mb-8">
	<div class="container max-w-2xl">
		<h2 class="h3">Send reset email</h2>

		<form class="flex flex-col gap-4" method="POST" action="?/sendPasswordResetEmail" use:enhance>
			<TextInput label="Email" name="email" id="email" required></TextInput>

			<button class="btn" type="submit">Submit</button>
		</form>
	</div>
</section>

<section>
	<div class="container max-w-2xl">
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
