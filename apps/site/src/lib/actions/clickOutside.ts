/**
 * Dispatch event on click outside of node
 */
export function clickOutside(node: HTMLElement, callback: () => void) {
	const handleClick = async (ev: MouseEvent) => {
		if (!node.contains(ev.target as HTMLElement)) callback();
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
