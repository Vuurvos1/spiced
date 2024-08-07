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
			<input class="input mb-4" name="username" id="username" /><br />
			<label class="label block" for="password">Password</label>
			<input class="input mb-4" type="password" name="password" id="password" /><br />
			<button>Continue</button>
			<p>{form?.message ?? ''}</p>
		</form>
		<a href="/login">Sign in</a>
	</div>
</section>
