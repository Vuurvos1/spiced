import type { Action } from 'svelte/action';

/**
 * Dispatch event on escape keydown
 */
export const escapeKeydown: Action<HTMLElement, () => void> = (
	node: HTMLElement,
	callback: () => void
) => {
	let unsub = () => {};

	function update() {
		unsub();

		const onKeyDown = (ev: KeyboardEvent) => {
			if (ev.key !== 'Escape') {
				return;
			}

			ev.preventDefault();
			callback();
		};

		document.addEventListener('keydown', onKeyDown);

		unsub = () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	}

	update();

	return {
		update,
		destroy() {
			unsub();
		}
	};
};
