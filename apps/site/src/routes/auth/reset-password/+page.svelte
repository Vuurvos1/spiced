<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	// import { route } from '$lib/ROUTES';

	// import PasswordResetForm from '$components/form/PasswordResetForm.svelte';
	// import Button from '$components/ui/button/button.svelte';

	export let data;
	export let form;
</script>

<form method="POST" action="?/sendPasswordResetEmail" use:enhance>
	<h2>Send reset email</h2>

	<label for="email">Email</label>
	<input type="email" name="email" id="email" required />
	<button type="submit">Submit</button>
</form>

<form method="POST" action="?/resetPassword" use:enhance>
	<h2>Reset password</h2>

	<label for="password">Password</label>
	<input type="password" name="password" id="password" required />

	<label for="confirmPassword">Confirm Password</label>
	<input type="password" name="confirmPassword" id="confirmPassword" required />

	<input type="hidden" name="token" value={$page.url.searchParams.get('token')} />

	<button type="submit">Submit</button>
</form>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<!-- {#if data.passwordResetTokenStatus.isValid === false}
	<h1 class="mb-5 text-2xl font-bold text-red-600">
		{data.passwordResetTokenStatus.message}
	</h1>

	<Button href={route('/auth/login')}>Return to Login Page to Request a New Code</Button>
{:else}
	<h1 class="mb-6 text-2xl font-bold leading-none">Reset Password</h1>

	<!-- <PasswordResetForm
		formData={data.passwordResetFormData}
		formAction={route('resetPassword /auth/reset-password')}
		isPasswordResetTokenRequired={true}
	/> -->
<!-- {/if} -->
