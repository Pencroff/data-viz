import { type FunctionComponent, h, render } from 'preact';

export function renderToDom<T>(
	elementId: string,
	Component: FunctionComponent<T>,
	cmpParams?: T,
) {
	const el = document.getElementById(elementId);
	if (el) {
		render(h(Component, cmpParams), el);
	} else {
		console.error(`Element with id ${elementId} not found`);
	}
}
