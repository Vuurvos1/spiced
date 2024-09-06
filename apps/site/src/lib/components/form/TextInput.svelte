<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	// import type { EnterKeyHintType } from '$lib/types';
	// import { cn } from '$lib/utils/styleTransitionUtils';

	// let className: HTMLInputAttributes['class'] = undefined;
	// export { className as class };
	// export let name: string = '';
	// export let placeholder: string = '';
	// export let spellcheck: boolean = true;
	// export let autocomplete: string = 'on';
	// export let enterkeyhint: EnterKeyHintType = 'next';

	interface Props {
		label: string;
		errorMessage?: string;
		maxlength?: number;
		type?: 'text' | 'password' | 'email';
		postLabel?: Snippet;
	}

	let {
		value = $bindable(''),
		label,
		errorMessage,
		maxlength,
		type = 'text',
		postLabel,
		...restProps
	}: Props & HTMLInputAttributes = $props();

	let valueLength = $derived(value?.length);
</script>

<label
	class="grid gap-1 text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
>
	<div class="label flex flex-row">
		<span>{label}</span>

		{#if maxlength}
			<span class="text-muted-foreground text-xs">
				{valueLength}/{maxlength}
			</span>
		{/if}

		{#if postLabel}
			{@render postLabel()}
		{/if}
	</div>

	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}

	<!-- class={cn('rounded border bg-transparent px-3 py-2', className)} -->

	<!-- {spellcheck}
	{placeholder}
	{autocomplete}
	{enterkeyhint} -->
	<!-- {name} -->
	<input
		class="input"
		{type}
		dir="auto"
		bind:value
		{maxlength}
		aria-label={label}
		aria-invalid={errorMessage ? 'true' : undefined}
		{...restProps}
	/>
</label>
