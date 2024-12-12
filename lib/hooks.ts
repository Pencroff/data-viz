import { useRef } from 'preact/hooks';

export function useFirstRender() {
	const isFirstRender = useRef(true);

	if (isFirstRender.current) {
		isFirstRender.current = false;
		return true;
	}

	return false;
}
