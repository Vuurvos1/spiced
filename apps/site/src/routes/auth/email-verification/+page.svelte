<script lang="ts">
	import { enhance } from '$app/forms';

	// import { toast } from 'svelte-sonner';
	// import { superForm } from 'sveltekit-superforms/client';

	// import { route } from '$lib/ROUTES';
	// import { EmailVerificationCodeZodSchema } from '$validations/AuthZodSchemas';

	// import InputField from '$components/form/InputField.svelte';
	// import SubmitButton from '$components/form/SubmitButton.svelte';

	export let data;

	// const {
	// 	form,
	// 	errors,
	// 	message,
	// 	delayed,
	// 	enhance: verifyCodeEnhance
	// } = superForm(data.emailVerificationCodeFormData, {
	// 	resetForm: false,
	// 	taintedMessage: null,
	// 	validators: EmailVerificationCodeZodSchema,

	// 	onUpdated: () => {
	// 		if (!$message) return;

	// 		const { alertType, alertText } = $message;

	// 		if (alertType === 'error') {
	// 			toast.error(alertText);
	// 		}
	// 	}
	// });
</script>

<div class="container">
	<h1 class="mb-6 text-2xl font-bold leading-none">Email Verification Code</h1>

	<h2 class="mb-5">
		Welcome aboard 🎉! To complete your registration, please enter the verification code we've sent
		to your email:
		<!-- <strong>{data.pendingUserEmail}</strong>. -->
	</h2>

	<!-- use:verifyCodeEnhance -->
	<form method="post" class="space-y-4" action="?/verifyCode">
		<label for="">Verification Code</label>

		<!-- bind:value={$form.verificationCode} -->
		<input type="text" name="verificationCode" placeholder="Enter your verification code here" />
		<!-- <p></p> -->
		<!-- errorMessage={$errors.verificationCode} -->

		<button>Verify</button>
		<!-- <SubmitButton class="w-full" disabled={$delayed}>Verify</SubmitButton> -->
	</form>

	<form
		method="post"
		action={'?/sendNewCode'}
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'failure') {
					// toast.error(result.data?.message);
				}

				if (result.type === 'success') {
					// toast.success(result.data?.message);
				}
			};
		}}
		class="mt-4"
	>
		<button type="submit">Send new code</button>
	</form>
</div>
