<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<section class="grid h-full flex-1 place-items-center">
	<div class="pb-20">
		<div>
			<h1 class="h1 mb-4">Sign in</h1>
			<form method="post" use:enhance>
				<label class="label mb-2 block" for="email">Email</label>
				<input class="input mb-4" required type="email" name="email" id="email" /><br />

				<label class="label mb-2 block" for="password">Password</label>
				<input
					class="input mb-4"
					required
					type="password"
					name="password"
					minlength="6"
					id="password"
				/><br />

				<button class="btn ml-auto block">Continue</button>
				<p>{form?.message ?? ''}</p>
			</form>

			<a class="hover:underline" href="/signup">Create an account</a>
		</div>

		<div class="my-4 flex items-center">
			<div class="mr-3 flex-grow border-t border-gray-500"></div>
			<div>Or continue with</div>
			<div class="ml-3 flex-grow border-t border-gray-500"></div>
		</div>

		<div class="flex flex-wrap gap-4">
			<a href="/login/google" class="flex-grow gap-2 font-bold">
				<span>Google</span>
			</a>
		</div>
	</div>
</section>
