<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<section class="mx-auto">
	<div class="">
		<h1 class="h1 mb-4">Create an account</h1>
		<form method="post" use:enhance>
			<label class="label block" for="username">Username</label>
			<input class="input mb-4" name="username" required id="username" /><br />

			<label class="label mb-2 block" for="email">Email</label>
			<input class="input mb-4" type="email" required name="email" id="email" /><br />

			<label class="label block" for="password">Password</label>
			<input
				class="input mb-4"
				minlength="6"
				required
				type="password"
				name="password"
				id="password"
			/><br />
			<button>Continue</button>
			<p>{form?.message ?? ''}</p>
		</form>
		<a href="/login">Sign up</a>

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
