<script lang="ts">
	import { BeamAvatar } from '@spiced/boring-avatars';

	let { data } = $props();

	let { user } = $derived(data);
</script>

<BeamAvatar name={user.username}></BeamAvatar>

<h2>{user.username}</h2>
