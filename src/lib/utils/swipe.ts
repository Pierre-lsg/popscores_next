interface SwipeOptions {
	onRight: () => void;
	onLeft: () => void;
	threshold?: number;
}

export const swipe = (node: HTMLElement, options: SwipeOptions) => {
	let touchStartX = 0;
	const threshold = options.threshold ?? 50;

	const handleTouchStart = (e: TouchEvent) => {
		touchStartX = e.changedTouches[0].screenX;
	};

	const handleTouchEnd = (e: TouchEvent) => {
		const touchEndX = e.changedTouches[0].screenX;
		const distance = touchEndX - touchStartX;

		if (Math.abs(distance) > threshold) {
			if (distance > 0) {
				if (typeof options.onRight === 'function') options.onRight();
			} else if (typeof options.onLeft === 'function') options.onLeft();
		}
	};

	node.addEventListener('touchstart', handleTouchStart);
	node.addEventListener('touchend', handleTouchEnd);

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchend', handleTouchEnd);
		}
	};
};
