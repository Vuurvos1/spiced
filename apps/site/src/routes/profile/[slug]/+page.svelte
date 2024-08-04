<script lang="ts">
	import { BeamAvatar } from '@app/boring-avatars';

	let { data } = $props();

	let { user } = $derived(data);
</script>

<div>
	<section>
		<div class="flex flex-col items-center gap-4">
			<BeamAvatar size={128} name={user.username}></BeamAvatar>

			<h1 class="text-xl font-medium">{user.username}</h1>
		</div>
	</section>
</div>
